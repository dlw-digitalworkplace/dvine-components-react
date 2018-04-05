import { autobind } from "@uifabric/utilities/lib/autobind";
import {
  IObjectWithKey,
  ISelection,
  Selection,
  SelectionMode
} from "office-ui-fabric-react/lib/Selection";
import * as React from "react";

import { flatten } from "../../utilities/flatten";
import { TreeNode } from "./TreeNode";
import { ITreeViewItem, ITreeViewProps } from "./TreeView.types";

export interface ITreeViewState {
  selection: ISelection;
}

export class TreeView<T> extends React.Component<ITreeViewProps<T>, ITreeViewState> {
  private _hasMounted = false;

  constructor(props: ITreeViewProps<T>) {
    super(props);

    this.state = {
      selection: new Selection({
        onSelectionChanged: this._onSelectionChanged,
        selectionMode: SelectionMode.single,
        canSelectItem: (item: IObjectWithKey & ITreeViewItem<T>) => !!item.isSelectable
      })
    };

    this._setSelectableItems(props.data);
  }

  public componentDidMount() {
    this._hasMounted = true;
  }

  public componentWillReceiveProps(newProps: ITreeViewProps<T>) {
    if (newProps.data !== this.props.data) {
      this._setSelectableItems(newProps.data);
    }
  }

  public render(): JSX.Element {
    const { data } = this.props;
    const { selection } = this.state;

    return (
      <div>
        {data && (
          <TreeNode
            item={data}
            selection={selection}
            defaultExpanded={true}
            isRootNode={true}
            invokeItem={this.props.onItemInvoked}
          />
        )}
      </div>
    );
  }

  @autobind
  private _onSelectionChanged() {
    if (this._hasMounted) {
      this.forceUpdate();
    }

    if (this.props.onSelectionChanged) {
      const selectedItems = this.state.selection.getSelection();
      if (selectedItems.length > 0) {
        const selectedValue: IObjectWithKey &
          ITreeViewItem<T> = selectedItems[0] as IObjectWithKey & ITreeViewItem<T>;
        this.props.onSelectionChanged(selectedValue.value);
      } else {
        this.props.onSelectionChanged(null);
      }
    }
  }

  @autobind
  private _setSelectableItems(data?: ITreeViewItem<T>): void {
    const flattenedData = data
      ? flatten([data]).map(item => ({
          key: item.id,
          ...item
        }))
      : [];

    this.state.selection.setItems(flattenedData, false);
  }
}
