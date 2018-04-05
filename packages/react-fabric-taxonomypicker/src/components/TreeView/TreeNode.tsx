import { autobind } from "@uifabric/utilities/lib/autobind";
import { css } from "@uifabric/utilities/lib/css";
import { IObjectWithKey, ISelection } from "office-ui-fabric-react/lib/Selection";
import * as React from "react";

import { getClassName } from "../../utilities";
import { TreeLabel } from "./TreeLabel";
import { ITreeViewItem } from "./TreeView.types";

const styles = require("./TreeView.module.scss");

export interface ITreeNodeProps<T> {
  item: ITreeViewItem<T>;
  selection: ISelection;
  defaultExpanded?: boolean;
  isRootNode?: boolean;
  invokeItem?: (item: ITreeViewItem<T>) => void;
}

export interface ITreeNodeState {
  isCollapsed: boolean;
}

export class TreeNode<T> extends React.Component<ITreeNodeProps<T>, ITreeNodeState> {
  constructor(props: ITreeNodeProps<T>) {
    super(props);

    this.state = {
      isCollapsed: !props.defaultExpanded
    };
  }
  public render(): JSX.Element {
    const { item, selection, isRootNode, invokeItem } = this.props;
    const { isCollapsed } = this.state;

    return (
      <div
        className={css(getClassName("TreeView-Node"), styles.node, {
          [styles.isRootNode]: isRootNode
        })}
      >
        <TreeLabel
          id={item.id}
          label={item.label}
          hasChildren={item.children && item.children.length > 0}
          isRootNode={isRootNode}
          isSelected={selection.isKeySelected(item.id)}
          isSelectable={selection.canSelectItem({ ...item, key: item.id } as IObjectWithKey)}
          isExpanded={!isCollapsed}
          onClick={this._selectItem}
          onDoubleClick={this._invokeItem}
          onToggleCollapse={this._toggleCollapse}
        />

        {!isCollapsed &&
          item.children &&
          item.children.map((child, index) => (
            <TreeNode
              key={child.id}
              item={child}
              selection={selection}
              defaultExpanded={isRootNode && index === 0}
              invokeItem={invokeItem}
            />
          ))}
      </div>
    );
  }

  @autobind
  private _selectItem(): void {
    this.props.selection.setKeySelected(this.props.item.id, true, false);
  }

  @autobind
  private _invokeItem(): void {
    this.props.selection.setKeySelected(this.props.item.id, true, false);
    if (this.props.invokeItem) {
      this.props.invokeItem(this.props.item);
    }
  }

  @autobind
  private _toggleCollapse(): void {
    this.setState((prevState: ITreeNodeState) => ({
      isCollapsed: !prevState.isCollapsed
    }));
  }
}
