import { BasePicker, IBasePickerProps, IPickerItemProps } from "office-ui-fabric-react/lib/pickers";
import * as React from "react";

import { ITerm } from "../../model/ITerm";
import { TermItem } from "./TermItem";
import { TermSuggestion } from "./TermSuggestion";

export interface ITermPickerProps extends IBasePickerProps<ITerm> {}

export class TermPicker extends BasePicker<ITerm, ITermPickerProps> {
  protected static defaultProps: Partial<ITermPickerProps> = {
    onRenderItem: (props: IPickerItemProps<ITerm>) => (
      <TermItem {...props}>{props.item.name}</TermItem>
    ),
    onRenderSuggestionsItem: (props: ITerm) => <TermSuggestion {...props} />
  };
}
