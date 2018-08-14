import { autobind } from "@uifabric/utilities/lib/autobind";
import { BaseComponent } from "@uifabric/utilities/lib/BaseComponent";
import { css } from "@uifabric/utilities/lib/css";
import { DefaultButton, PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { Dialog, DialogFooter, DialogType, IDialog } from "office-ui-fabric-react/lib/Dialog";
import * as React from "react";

import { ITaxonomyApiContext, TaxonomyApi } from "../../api/TaxonomyApi";
import { ITerm } from "../../model/ITerm";
import { getClassName } from "../../utilities";
import { TermPicker } from "../TermPicker";
import { ITreeViewItem, TreeView } from "../TreeView";
import { ITaxonomyDialogProps } from "./TaxonomyDialog.types";

const styles = require("./TaxonomyDialog.module.scss");

export interface ITaxonomyDialogState {
  selectedItems: ITerm[];
  selectedTreeItem: ITerm | null;
  treeViewData?: ITreeViewItem<ITerm>;
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
      selectedTreeItem: null
    };
  }

  public componentDidMount(): void {
    this._loadTermSetData();
  }

  public render(): JSX.Element {
    return (
      <Dialog
        hidden={!this.props.isOpen}
        onDismiss={this._onDismiss}
        dialogContentProps={{
          type: DialogType.close,
          title: "Browse Term Set"
        }}
        className={styles.dialog}
        isBlocking={true}
      >
        <div className={css(getClassName("TaxonomyDialog-Tree"), styles.taxonomyTree)}>
          <TreeView
            termSetId={this.props.termSetId}
            data={this.state.treeViewData}
            onItemInvoked={this._onTreeItemInvoked}
            onSelectionChanged={this._onTreeSelectionChanged}
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
  private async _loadTermSetData(): Promise<void> {
    const apiContext: ITaxonomyApiContext = {
      absoluteSiteUrl: this.props.absoluteSiteUrl,
      termSetId: this.props.termSetId,
      rootTermId: this.props.rootTermId
    };

    const taxonomyApi = new TaxonomyApi(apiContext);
    const termTree = await taxonomyApi.getTermTree();
    const rootTreeTerm = termTree.terms.find(t => !!t.id && t.id === this.props.rootTermId);

    const children = rootTreeTerm && rootTreeTerm.properties && rootTreeTerm.properties.children
      ? rootTreeTerm.properties.children.map(this._termToTreeViewItem)
      : termTree.terms.map(this._termToTreeViewItem);

    this.setState({
      treeViewData: {
        id: this.props.termSetId,
        label: termTree.termSetName,
        children,
        value: null,
        isSelectable: false
      }
    });
  }

  @autobind
  private _termToTreeViewItem(item: ITerm): ITreeViewItem<ITerm> {
    return {
      id: item.id!,
      label: item.name,
      value: {
        id: item.id,
        name: item.name,
        path: item.path
      },
      children:
        item.properties && item.properties.children
          ? item.properties.children.map(this._termToTreeViewItem)
          : [],
      isSelectable: item.properties && item.properties.isSelectable
    };
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
      filter,
      this.props.defaultLabelOnly,
      this.props.exactMatchOnly,
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
}
