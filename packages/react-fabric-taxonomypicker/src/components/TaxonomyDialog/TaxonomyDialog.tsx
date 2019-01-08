import { autobind } from "@uifabric/utilities/lib/autobind";
import { BaseComponent } from "@uifabric/utilities/lib/BaseComponent";
import { css } from "@uifabric/utilities/lib/css";
import { DefaultButton, PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { Dialog, DialogFooter, DialogType, IDialog } from "office-ui-fabric-react/lib/Dialog";
import * as React from "react";
import { replaceIllegalCharacters } from "../../utilities/invalidchars";
import * as Guid from "uuid/v4";
import { ITaxonomyApiContext, TaxonomyApi } from "../../api/TaxonomyApi";
import { ITerm } from "../../model/ITerm";
import { getClassName } from "../../utilities";
import { TermPicker } from "../TermPicker";
import { ITreeViewItem, TreeView } from "../TreeView";
import { ITaxonomyDialogProps } from "./TaxonomyDialog.types";
import { TermAdder } from "../TermAdder";

const styles = require("./TaxonomyDialog.module.scss");

export interface ITaxonomyDialogState {
  selectedItems: ITerm[];
  selectedTreeItem: ITerm | null;
  treeViewData?: ITreeViewItem<ITerm>;
  isOpenTermSet: boolean;
  itemAdding: boolean;
  newItemLabel?: string;
}

export class TaxonomyDialog extends BaseComponent<ITaxonomyDialogProps, ITaxonomyDialogState>
  implements IDialog {
  protected static defaultProps: Partial<ITaxonomyDialogProps> = {
    pickerSuggestionsProps: {
      suggestionsHeaderText: "Suggested Terms",
      noResultsFoundText: "No results found",
      loadingText: "Loading..."
    }
  };

  constructor(props: ITaxonomyDialogProps) {
    super(props);

    this.state = {
      selectedItems: props.defaultSelectedItems || [],
      selectedTreeItem: null,
      itemAdding: false,
      isOpenTermSet: false
    };
  }

  public componentDidMount(): void {
    this._loadTermSetData();
  }

  public render(): JSX.Element {
    return (
      <Dialog
        hidden={!this.props.isOpen}
        modalProps={{
          isBlocking: true,
          className: styles.dialog
        }}
        onDismiss={this._onDismiss}
        dialogContentProps={{ type: DialogType.close, title: "Browse Term Set" }}
      >
        {this.state.isOpenTermSet &&
          <TermAdder addNewItemClick={this._onAddNewItemClick} />
        }
        <div className={css(getClassName("TaxonomyDialog-Tree"), styles.taxonomyTree)}>
          <TreeView
            termSetId={this.props.termSetId}
            selectedItems={this.state.selectedItems}
            isOpenTermSet={this.state.isOpenTermSet}
            data={this.state.treeViewData}
            onItemInvoked={this._onTreeItemInvoked}
            onSelectionChanged={this._onTreeSelectionChanged}
            itemAdding={this.state.itemAdding}
            onNewItemFocusOut={this._onNewItemFocusOut}
            onNewItemKeyPress={this._onNewItemKeyPress}
            onNewItemValueChanged={this._onNewItemValueChanged}
          />
        </div>

        <div className={css(getClassName("TaxonomyDialog-Controls"), styles.controls)}>
          <DefaultButton className={styles.addButton} text="Add" onClick={this._addSelectedTerm} />

          <TermPicker
            className={css(getClassName("TaxonomyDialog-Picker"), styles.termPicker)}
            onResolveSuggestions={this._resolveSuggestions}
            selectedItems={this.state.selectedItems}
            onChange={this._onSelectedItemsChanged}
            pickerSuggestionsProps={this.props.pickerSuggestionsProps}
            itemLimit={this.props.itemLimit}
          />
        </div>

        <DialogFooter>
          <PrimaryButton text="OK" onClick={this._saveChanges} />
          <DefaultButton text="Cancel" onClick={this._onDismiss} />
        </DialogFooter>
      </Dialog>
    );
  }

  @autobind
  private async _loadTermSetData(itemAdding: boolean = false): Promise<void> {
    const apiContext: ITaxonomyApiContext = {
      absoluteSiteUrl: this.props.absoluteSiteUrl,
      termSetId: this.props.termSetId,
      rootTermId: this.props.rootTermId
    };

    const taxonomyApi = new TaxonomyApi(apiContext);
    const termTree = await taxonomyApi.getTermTree(this.props.lcid);
    const rootTreeTerms = termTree.terms.filter(t => !!t.id && t.id === this.props.rootTermId);
    const rootTreeTerm = rootTreeTerms.length > 0 ? rootTreeTerms[0] : null;

    const children =
      rootTreeTerm && rootTreeTerm.properties && rootTreeTerm.properties.children
        ? rootTreeTerm.properties.children.map(this._termToTreeViewItem)
        : termTree.terms.map(this._termToTreeViewItem);

    this.setState({
      treeViewData: {
        id: this.props.termSetId,
        label: termTree.termSetName,
        defaultLabel: termTree.termSetName,
        children,
        value: null,
        expanded: true,
        isSelectable: termTree.isOpenTermSet
      },
      itemAdding,
      isOpenTermSet: termTree.isOpenTermSet
    });
  }

  @autobind
  private _termToTreeViewItem(item: ITerm): ITreeViewItem<ITerm> {
    const treeViewItem: ITreeViewItem<ITerm> = {
      id: item.id!,
      label: item.name,
      defaultLabel: item.defaultLabel,
      value: {
        id: item.id,
        name: item.name,
        path: item.path,
        defaultLabel: item.defaultLabel
      },
      children:
        item.properties && item.properties.children
          ? item.properties.children.map(this._termToTreeViewItem)
          : [],
      isSelectable: item.properties && item.properties.isSelectable
    };

    treeViewItem.expanded = this._isExpanded(treeViewItem);

    return treeViewItem;
  }

  @autobind
  private _isExpanded(item: ITreeViewItem<ITerm>): boolean {
    if (this.props.defaultSelectedItems && this.props.defaultSelectedItems.length > 0) {
      if (item.id === this.props.defaultSelectedItems[0].id) {
        return true;
      } else if (item.children) {
        return this._isExpandedChild(item.children);
      }
    }

    return false;
  }

  private _isExpandedChild(items: ITreeViewItem<ITerm>[]): boolean {
    for (let i = 0; i < items.length; i++) {
      const isExpanded: boolean = this._isExpanded(items[i]);
      if (isExpanded) {
        return isExpanded;
      }
    }

    return false;
  }

  @autobind
  private _onDismiss(): void {
    if (this.props.isOpen && this.props.onDismiss) {
      this.props.onDismiss();
    }
  }

  @autobind
  private async _resolveSuggestions(filter: string, selectedItems?: ITerm[]): Promise<ITerm[]> {
    const apiContext: ITaxonomyApiContext = {
      absoluteSiteUrl: this.props.absoluteSiteUrl,
      termSetId: this.props.termSetId,
      rootTermId: this.props.rootTermId
    };

    const taxonomyApi = new TaxonomyApi(apiContext);
    const matchingTerms = await taxonomyApi.findTerms(
      replaceIllegalCharacters(filter),
      this.props.lcid,
      this.props.defaultLabelOnly,
      this.props.exactMatchOnly,
      this.props.searchTranslatedLabels,
      10,
      true
    );

    return matchingTerms.filter(
      item => !(selectedItems || []).some(selectedItem => selectedItem.id === item.id)
    );
  }

  @autobind
  private _onSelectedItemsChanged(items?: ITerm[]): void {
    const newItems = [...(items || [])];

    this.setState({
      selectedItems: newItems
    });
  }

  @autobind
  private _saveChanges(): void {
    if (this.props.onSave) {
      this.props.onSave(this.state.selectedItems);
    }

    this._onDismiss();
  }

  @autobind
  private _onTreeSelectionChanged(value: ITerm): void {
    this.setState({
      selectedTreeItem: value
    });
  }

  @autobind
  private _addSelectedTerm(): void {
    if (this.state.selectedTreeItem) {
      this._addItem(this.state.selectedTreeItem);
    }
  }

  @autobind
  private _onTreeItemInvoked(item: ITreeViewItem<ITerm>): void {
    this._addItem(item.value!);
  }

  @autobind
  private _addItem(itemToAdd: ITerm): void {
    const currentItems = this.state.selectedItems;

    if (
      (!this.props.itemLimit || this.props.itemLimit > currentItems.length) &&
      !currentItems.some((value: ITerm) => value.id === itemToAdd.id)
    ) {
      const newItems = [...currentItems, itemToAdd];
      this._onSelectedItemsChanged(newItems);
    }
  }

  @autobind
  private _onAddNewItemClick(): void {
    if (!this.state.itemAdding) {
      this.setState({ itemAdding: true });
    }
  }

  @autobind
  private async _onNewItemKeyPress(event): Promise<void> {
    // ENTER
    if (event.charCode === 13) {
      return this._onNewItemFocusOut();
    }

    return Promise.resolve();
  }

  @autobind
  private async _onNewItemFocusOut(): Promise<void> {
    // Check if empty -> cancel if so
    if (!this.state.newItemLabel) {
      this.setState({
        itemAdding: false
      });
      return Promise.resolve();
    } else {
      return this._createTerm();
    }
  }

  @autobind
  private async _createTerm(): Promise<void> {
    // Add the new term to the taxonomy
    const apiContext: ITaxonomyApiContext = {
      absoluteSiteUrl: this.props.absoluteSiteUrl,
      termSetId: this.props.termSetId,
      rootTermId: this.props.rootTermId
    };
    const taxonomyApi = new TaxonomyApi(apiContext);
    this.state.selectedTreeItem ?
      await taxonomyApi.createTerm(this.state.newItemLabel!, Guid(), this.props.lcid, this.state.selectedTreeItem) :
      await taxonomyApi.createTerm(this.state.newItemLabel!, Guid(), this.props.lcid);
    await this._loadTermSetData();

    if (this.state.selectedTreeItem) {
      this._onTreeSelectionChanged(this.state.selectedTreeItem);
    }

    return Promise.resolve();
  }

  @autobind
  private _onNewItemValueChanged(termLabel: string): void {
    this.setState({
      newItemLabel: termLabel
    });
  }
}
