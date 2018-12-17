import { ITerm } from "src/model/ITerm";

export interface ITreeViewProps<T> {
  data?: ITreeViewItem<T>;
  termSetId: string;
  itemAdding: boolean;
  isOpenTermSet: boolean;
  selectedItems?: ITerm[];
  onSelectionChanged?: (value: T | null) => void;
  onItemInvoked?: (item: ITreeViewItem<T>) => void;
  onNewItemFocusOut?: () => void;
  onNewItemKeyPress?: (event) => void;
  onNewItemValueChanged?: (value: string) => void;
}

export interface ITreeViewItem<T> {
  id: string;
  label: string;
  defaultLabel: string;
  expanded?: boolean;
  value: T | null;
  children?: ITreeViewItem<T>[];
  isSelectable?: boolean;
}
