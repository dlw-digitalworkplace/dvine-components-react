import { autobind } from "@uifabric/utilities/lib/autobind";
import { BaseComponent } from "@uifabric/utilities/lib/BaseComponent";
import { createRef } from "@uifabric/utilities/lib/createRef";
import { css } from "@uifabric/utilities/lib/css";
import { IconButton } from "office-ui-fabric-react/lib/Button";
import { Label } from "office-ui-fabric-react/lib/Label";
import { IBasePicker, ValidationState } from "office-ui-fabric-react/lib/Pickers";
import * as React from "react";
import * as Guid from "uuid/v4";
import { ITaxonomyApiContext, TaxonomyApi } from "../../api/TaxonomyApi";
import { ITerm } from "../../model/ITerm";
import { getClassName } from "../../utilities";
import { replaceIllegalCharacters } from "../../utilities/invalidchars";
import { TaxonomyDialog } from "../TaxonomyDialog";
import { TermPicker } from "../TermPicker";
import { TermSuggestion } from "../TermPicker/TermSuggestion";
import { ITaxonomyPickerProps } from "./TaxonomyPicker.types";

const styles = require("./TaxonomyPicker.module.scss");

export interface ITaxonomyPickerState {
  items: ITerm[];
  isPopupOpen: boolean;
  isLoaded: boolean;
}

interface IRequestedTerm {
  id: Guid;
  label: string;
}

export class TaxonomyPicker
  extends BaseComponent<ITaxonomyPickerProps, ITaxonomyPickerState>
  implements IBasePicker<ITerm> {
  protected static defaultProps: Partial<ITaxonomyPickerProps> = {
    iconProps: {
      iconName: "Tag",
    },
  };

  private termPicker = createRef<TermPicker>();
  private requestedTerms: IRequestedTerm[] = [];

  constructor(props: ITaxonomyPickerProps) {
    super(props);

    const items = props.selectedItems || props.defaultSelectedItems || [];

    this.state = {
      items: items,
      isPopupOpen: false,
      isLoaded: false,
    };
  }

  public get items(): ITerm[] {
    return this.state.items;
  }

  @autobind
  public focus(): void {
    if (this.termPicker.value) {
      this.termPicker.value.focus();
    }
  }

  @autobind
  public focusInput(): void {
    if (this.termPicker.value) {
      this.termPicker.value.focusInput();
    }
  }

  public componentWillReceiveProps(newProps: ITaxonomyPickerProps) {
    const newItems = newProps.selectedItems;

    if (newItems) {
      this.setState({
        items: newItems,
      });
    }
  }

  public render(): JSX.Element {
    const {
      label,
      required,
      disabled,
      isLoading,
      iconProps,
      allowAddTerms,
      pickerSuggestionsProps,
      labels,
      ...rest
    } = this.props;
    const shouldBeDisabled = disabled || isLoading;

    return (
      <div className={css(getClassName("TaxonomyPicker"), styles.wrapper)}>
        {label && <Label required={required}>{label}</Label>}

        <div className={css(getClassName("TaxonomyPicker-Controls"), styles.controls)}>
          <TermPicker
            {...rest}
            className={css(getClassName("TaxonomyPicker-Picker"), styles.termPicker)}
            disabled={shouldBeDisabled}
            onResolveSuggestions={this._resolveSuggestions}
            onRenderSuggestionsItem={this._renderSuggestionsItem}
            onChange={this._onSelectedItemsChanged}
            selectedItems={this.state.items}
            defaultSelectedItems={undefined}
            onValidateInput={this._onValidateInput}
            createGenericItem={this._createGenericItem}
            pickerSuggestionsProps={{
              noResultsFoundText: allowAddTerms
                ? "No results found, press Enter to create it"
                : "No results found",
              suggestionsHeaderText: "Suggested Terms",
              loadingText: "Loading...",
              ...pickerSuggestionsProps,
            }}
          />

          <IconButton
            className={css(getClassName("TaxonomyPicker-OpenDialog"))}
            disabled={shouldBeDisabled}
            iconProps={iconProps}
            onClick={this._openDialog}
            title={(labels && labels.openDialogButtonTitle) || "Open term picker"}
          />

          {this.state.isPopupOpen && (
            <TaxonomyDialog
              title={this.props.title}
              absoluteSiteUrl={this.props.absoluteSiteUrl}
              defaultSelectedItems={this.state.items}
              termSetId={this.props.termSetId}
              termSetName={this.props.termSetName}
              rootTermId={this.props.rootTermId}
              isOpen={this.state.isPopupOpen}
              onDismiss={this._closeDialog}
              onSave={this._onSelectedItemsChanged}
              itemLimit={this.props.itemLimit}
              defaultLabelOnly={this.props.defaultLabelOnly}
              exactMatchOnly={this.props.exactMatchOnly}
              lcid={this.props.lcid}
              showTranslatedLabels={this.props.showTranslatedLabels}
              allowAddTerms={this.props.allowAddTerms}
              hideDeprecatedTerms={this.props.hideDeprecatedTerms}
              pathDelimiter={this.props.pathDelimiter}
              labels={labels && labels.dialogLabels}
            />
          )}
        </div>
      </div>
    );
  }

  @autobind
  private _renderSuggestionsItem(props: ITerm): JSX.Element {
    return <TermSuggestion {...props} pathDelimiter={this.props.pathDelimiter} />;
  }

  @autobind
  private async _resolveSuggestions(filter: string, selectedItems?: ITerm[]): Promise<ITerm[]> {
    const apiContext: ITaxonomyApiContext = {
      absoluteSiteUrl: this.props.absoluteSiteUrl,
      termSetId: this.props.termSetId,
      termSetName: this.props.termSetName,
      rootTermId: this.props.rootTermId,
    };

    const taxonomyApi = new TaxonomyApi(apiContext);
    const matchingTerms = await taxonomyApi.findTerms(
      replaceIllegalCharacters(filter),
      this.props.lcid,
      this.props.defaultLabelOnly,
      this.props.exactMatchOnly,
      this.props.showTranslatedLabels,
      10,
      true,
      true
    );

    const filteredItems = matchingTerms.filter(
      (item) => !(selectedItems || []).some((selectedItem) => selectedItem.id === item.id)
    );

    if (!this.state.isLoaded) {
      this.setState({
        isLoaded: true,
      });
    }

    return filteredItems;
  }

  @autobind
  private _onSelectedItemsChanged(items?: ITerm[]): void {
    if (this.props.selectedItems) {
      this._onChange(items);
    } else {
      this.setState(
        {
          items: items || [],
        },
        () => this._onChange(items)
      );
    }
  }

  @autobind
  private _onChange(items?: ITerm[]): void {
    if (this.props.onChange) {
      this.props.onChange(items);
    }
  }

  private _getRequestedTerm(input: string) {
    const requestedTerms = this.requestedTerms.filter((rt) => {
      return rt.label === input;
    });
    const requestedTerm = requestedTerms.length > 0 ? requestedTerms[0] : null;
    return requestedTerm;
  }

  private _removeRequestedTerm(input: string) {
    const requestedTerm = this._getRequestedTerm(input);

    if (!requestedTerm) {
      return;
    }

    const termIndex = this.requestedTerms.indexOf(requestedTerm);
    this.requestedTerms.splice(termIndex, 1);
  }

  @autobind
  private _createGenericItem(input: string) {
    const requestedTerm = this._getRequestedTerm(input);

    const genericItem = {
      id: requestedTerm ? requestedTerm.id : undefined,
      defaultLabel: input,
      name: input,
      path: input,
      properties: {
        isNew: true,
        eTag: Math.random().toString(36).substr(2, 8),
      },
    } as any;

    return genericItem;
  }

  @autobind
  private _onValidateInput(input: string): ValidationState {
    if (
      !this.props.allowAddTerms ||
      !this.state.isLoaded ||
      !input ||
      this.state.items.some((item) => item.name.toLowerCase() === input.toLowerCase()) ||
      input.replace(/\s/g, "").length === 0
    ) {
      return ValidationState.invalid;
    }

    // tslint:disable-next-line:no-this-assignment
    const that = this;
    // tslint:disable-next-line:no-function-expression
    this._makeMeLookSync(function* () {
      try {
        const result = yield that._createTerm(input);

        console.log("Result", result);
        that._removeRequestedTerm(input);

        const items = that.state.items;

        const termIndex = items.findIndex(
          (item: ITerm) => !!item.properties!.isNew && item.name === input
        );

        items[termIndex].id = result.id;
        that.setState({
          items: items,
        });

        return ValidationState.valid;
      } catch (err) {
        return ValidationState.invalid;
      }
    });

    return ValidationState.valid;
  }

  @autobind
  private _openDialog(): void {
    this.setState({
      isPopupOpen: true,
    });
  }

  @autobind
  private _closeDialog(): void {
    this.setState({
      isPopupOpen: false,
    });
  }

  private async _createTerm(input: string): Promise<ITerm> {
    const apiContext: ITaxonomyApiContext = {
      absoluteSiteUrl: this.props.absoluteSiteUrl,
      termSetId: this.props.termSetId,
      termSetName: this.props.termSetName,
      rootTermId: this.props.rootTermId,
    };

    // Due to the generator function, the create term function can be called multiple times, make sure to always use the same term id
    let generatedTermId;
    const requestedTerm = this._getRequestedTerm(input);

    if (requestedTerm) {
      generatedTermId = requestedTerm.id;
    } else {
      generatedTermId = Guid();
      this.requestedTerms.push({ id: generatedTermId, label: input });
    }

    const taxonomyApi = new TaxonomyApi(apiContext);
    const newTerm = await taxonomyApi.createTerm(input, generatedTermId, this.props.lcid);

    return newTerm;
  }

  private _makeMeLookSync(fn: any) {
    const iterator = fn();
    const loop = (result) => {
      !result.done &&
        result.value.then(
          (res) => loop(iterator.next(res)),
          (err) => loop(iterator.throw(err))
        );
    };

    loop(iterator.next());
  }
}
