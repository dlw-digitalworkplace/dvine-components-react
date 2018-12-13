import { autobind } from "@uifabric/utilities/lib/autobind";
import { css } from "@uifabric/utilities/lib/css";
import { IObjectWithKey, ISelection } from "office-ui-fabric-react/lib/Selection";
import * as React from "react";
import { getClassName } from "../../utilities";
import { TreeLabel } from "./TreeLabel";
import { ITreeViewItem } from "./TreeView.types";
import { TreeLabelNew } from "./TreeLabelNew";

const styles = require("./TreeView.module.scss");

export interface ITreeNodeProps<T> {
  item: ITreeViewItem<T>;
  selection: ISelection;
  isOpenTermSet: boolean;
  isRootNode: boolean;
  defaultExpanded?: boolean;
  itemAdding?: boolean;
  newItemValue?: string;
  onNewItemValueChanged?: (value: string) => void;
  onNewItemFocusOut?: () => void;
  onNewItemKeyPress?: (event) => void;
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
    const {
      item,
      selection,
      isRootNode,
      isOpenTermSet,
      invokeItem,
      itemAdding,
      onNewItemValueChanged,
      onNewItemFocusOut,
      onNewItemKeyPress,
      newItemValue
    } = this.props;
    const { isCollapsed } = this.state;
    const isItemAddingBelowSelectedNode: boolean | undefined =
      itemAdding && selection.isKeySelected(item.id);
    return (
      <div
        className={css(getClassName("TreeView-Node"), styles.node, {
          [styles.isRootNode]: isRootNode
        })}
      >
        <TreeLabel
          id={item.id}
          label={item.defaultLabel ? item.defaultLabel : item.label}
          hasChildren={item.children && item.children.length > 0}
          isRootNode={isRootNode}
          isSelected={selection.isKeySelected(item.id)}
          isSelectable={
            (isRootNode && isOpenTermSet) ||
            selection.canSelectItem({ ...item, key: item.id } as IObjectWithKey)
          }
          isExpanded={!isCollapsed}
          onClick={this._selectItem}
          onDoubleClick={this._invokeItem}
          onToggleCollapse={this._toggleCollapse}
        />

        {isItemAddingBelowSelectedNode && (
          <TreeLabelNew
            label={newItemValue}
            onNewItemValueChanged={onNewItemValueChanged}
            onNewItemKeyPress={onNewItemKeyPress}
            onNewItemFocusOut={onNewItemFocusOut}
          />
        )}

        {!isCollapsed &&
          item.children &&
          item.children.map((child, index) => (
            <TreeNode
              key={child.id}
              item={child}
              isRootNode={false}
              selection={selection}
              isOpenTermSet={isOpenTermSet}
              defaultExpanded={isRootNode && index === 0}
              invokeItem={invokeItem}
              onNewItemValueChanged={onNewItemValueChanged}
              onNewItemFocusOut={onNewItemFocusOut}
              onNewItemKeyPress={onNewItemKeyPress}
              itemAdding={itemAdding}
              newItemValue={newItemValue}
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
