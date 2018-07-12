import { css } from "@uifabric/utilities/lib/css";
import { Icon } from "office-ui-fabric-react/lib/Icon";
import { IPickerItemProps } from "office-ui-fabric-react/lib/Pickers";
import { IDictionary } from "office-ui-fabric-react/lib/Utilities";
import * as React from "react";

import { ITerm } from "../../model/ITerm";
import { getClassName } from "../../utilities";

const styles = require("./TermPicker.module.scss");

export const TermItem = (props: IPickerItemProps<ITerm>) => (
  <div
    className={css(
      getClassName("TermItem"),
      styles.termItem,
      { "is-selected": props.selected } as IDictionary,
      props.selected && styles.isSelected
    )}
    key={props.index}
    data-selection-index={props.index}
    data-is-focusable={!props.disabled && true}
  >
    <span className={css(getClassName("TermItem-text"), styles.termItemText)}>
      {props.children}
    </span>
    {!props.disabled && (
      <span
        className={css(getClassName("TermItem-close"), styles.termItemClose)}
        onClick={props.onRemoveItem}
      >
        <Icon iconName="Cancel" />
      </span>
    )}
  </div>
);
