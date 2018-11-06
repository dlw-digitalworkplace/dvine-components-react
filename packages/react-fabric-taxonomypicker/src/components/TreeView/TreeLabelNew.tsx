import { css } from "@uifabric/utilities/lib/css";
import { Icon } from "office-ui-fabric-react/lib/Icon";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import * as React from "react";
import { autobind } from "@uifabric/utilities";

import { getClassName } from "../../utilities";

const styles = require("./TreeView.module.scss");

export interface ITreeLabelNewProps {
  label?: string;
  onNewItemValueChanged?: (value: string) => void;
  onNewItemFocusOut?: () => void;
}

export class TreeLabelNew extends React.Component<ITreeLabelNewProps, any> {
  constructor(props: ITreeLabelNewProps) {
    super(props);
  }
  public render(): JSX.Element {
    return (
      <div
        className={css(getClassName("TreeView-NodeLabel"), styles.nodeLabel, styles.nodeLabelNew)}
      >
        <Icon
          className={css(getClassName("TreeView-NodeLabel-TagIcon"), styles.tagIcon)}
          iconName={"Tag"}
        />
        <TextField
          autoFocus={true}
          value={this.props.label}
          onChanged={this._onNewItemValueChanged}
          onBlur={this._onNewItemFocusOut}
          className={css(getClassName("TreeView-NodeLabel-Text"), styles.labelText)}
        />
      </div>
    );
  }

  @autobind
  private _onNewItemValueChanged(newValue?: string): void {
    if (newValue && this.props.onNewItemValueChanged) {
      this.props.onNewItemValueChanged(newValue);
    }
  }

  @autobind
  private _onNewItemFocusOut(): void {
    if (this.props.onNewItemFocusOut) {
      this.props.onNewItemFocusOut();
    }
  }
}
