import { BasePicker, IBasePickerProps, IPickerItemProps } from "office-ui-fabric-react/lib/Pickers";
import * as React from "react";
import { ITerm } from "../../model/ITerm";
import { TermItem } from "./TermItem";

export interface ITermPickerProps extends IBasePickerProps<ITerm> {}

export class TermPicker extends BasePicker<ITerm, ITermPickerProps> {
  protected static defaultProps: Partial<ITermPickerProps> = {
    onRenderItem: (props: IPickerItemProps<ITerm>) => {
      return (
        <TermItem {...props}>
          {props.item.defaultLabel ? props.item.defaultLabel : props.item.name}
        </TermItem>
      );
    },
    getTextFromItem: (item) => (item.defaultLabel ? item.defaultLabel : item.name),
  };
}
