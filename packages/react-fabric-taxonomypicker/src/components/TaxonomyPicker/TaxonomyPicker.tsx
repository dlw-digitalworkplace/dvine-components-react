import { autobind } from "@uifabric/utilities/lib/autobind";
import { BaseComponent } from "@uifabric/utilities/lib/BaseComponent";
import { createRef } from "@uifabric/utilities/lib/createRef";
import { css } from "@uifabric/utilities/lib/css";
import { IconButton } from "office-ui-fabric-react/lib/Button";
import { Label } from "office-ui-fabric-react/lib/Label";
import { IBasePicker } from "office-ui-fabric-react/lib/pickers";
import * as React from "react";

import { ITaxonomyApiContext, TaxonomyApi } from "../../api/TaxonomyApi";
import { ITerm } from "../../model/ITerm";
import { getClassName } from "../../utilities";
import { TaxonomyDialog } from "../TaxonomyDialog";
import { TermPicker } from "../TermPicker";
import { ITaxonomyPickerProps } from "./TaxonomyPicker.types";

const styles = require("./TaxonomyPicker.module.scss");

export interface ITaxonomyPickerState {
  items: ITerm[];
  isPopupOpen: boolean;
}

export class TaxonomyPicker extends BaseComponent<ITaxonomyPickerProps, ITaxonomyPickerState>
  implements IBasePicker<ITerm> {
  protected static defaultProps: Partial<ITaxonomyPickerProps> = {
    pickerSuggestionsProps: {
      suggestionsHeaderText: "Suggested Terms",
      noResultsFoundText: "No results found",
      loadingText: "Loading..."
    },
    iconProps: {
      iconName: "Tag"
    }
  };

  private termPicker = createRef<TermPicker>();

  constructor(props: ITaxonomyPickerProps) {
    super(props);

    const items = props.selectedItems || props.defaultSelectedItems || [];

    this.state = {
      items: items,
      isPopupOpen: false
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
        items: newItems
      });
    }
  }

  public render(): JSX.Element {
    const { label, required, disabled, isLoading, iconProps, ...rest } = this.props;
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
            onChange={this._onSelectedItemsChanged}
            selectedItems={this.state.items}
            defaultSelectedItems={undefined}
          />

          <IconButton
            className={css(getClassName("TaxonomyPicker-OpenDialog"))}
            disabled={shouldBeDisabled}
            iconProps={iconProps}
            onClick={this._openDialog}
            title={"Open term picker"}
          />

          {this.state.isPopupOpen && (
            <TaxonomyDialog
              defaultSelectedItems={this.state.items}
              termSetId={this.props.termSetId}
              isOpen={this.state.isPopupOpen}
              onDismiss={this._closeDialog}
              onSave={this._onSelectedItemsChanged}
              itemLimit={this.props.itemLimit}
            />
          )}
        </div>
      </div>
    );
  }

  @autobind
  private async _resolveSuggestions(filter: string, selectedItems?: ITerm[]): Promise<ITerm[]> {
    const apiContext: ITaxonomyApiContext = {
      termSetId: this.props.termSetId
    };

    const taxonomyApi = new TaxonomyApi(apiContext);
    const matchingTerms = await taxonomyApi.findTerms(filter, true, false, 10, true);

    return matchingTerms.filter(
      item => !(selectedItems || []).some(selectedItem => selectedItem.id === item.id)
    );
  }

  @autobind
  private _onSelectedItemsChanged(items?: ITerm[]): void {
    if (this.props.selectedItems) {
      this._onChange(items);
    } else {
      this.setState(
        {
          items: items || []
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

  @autobind
  private _openDialog(): void {
    this.setState({
      isPopupOpen: true
    });
  }

  @autobind
  private _closeDialog(): void {
    this.setState({
      isPopupOpen: false
    });
  }
}
