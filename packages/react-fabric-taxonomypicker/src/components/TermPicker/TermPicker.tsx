import {
  BasePicker,
  IBasePickerProps,
  IPickerItemProps,
  ValidationState
} from "office-ui-fabric-react/lib/pickers";
import * as React from "react";

import { ITerm } from "../../model/ITerm";
import { TermItem } from "./TermItem";
import { TermSuggestion } from "./TermSuggestion";

export interface ITermPickerProps extends IBasePickerProps<ITerm> {}

export class TermPicker extends BasePicker<ITerm, ITermPickerProps> {
  protected static defaultProps: Partial<ITermPickerProps> = {
    onRenderItem: (props: IPickerItemProps<ITerm>) => {
      return <TermItem {...props}>{props.item.name}</TermItem>;
    },
    onRenderSuggestionsItem: (props: ITerm) => <TermSuggestion {...props} />,
    createGenericItem: (input: string, validationState: ValidationState) => {
      return {
        id: undefined,
        name: input,
        path: input,
        properties: {
          isNew: true
        }
      } as any;
    },
    getTextFromItem: item => item.name
  };
}
