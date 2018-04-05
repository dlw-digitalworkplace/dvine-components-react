export interface ITreeViewProps<T> {
  data?: ITreeViewItem<T>;
  termSetId: string;
  onSelectionChanged?: (value: T | null) => void;
  onItemInvoked?: (item: ITreeViewItem<T>) => void;
}

export interface ITreeViewItem<T> {
  id: string;
  label: string;
  value: T | null;
  children?: ITreeViewItem<T>[];
  isSelectable?: boolean;
}
