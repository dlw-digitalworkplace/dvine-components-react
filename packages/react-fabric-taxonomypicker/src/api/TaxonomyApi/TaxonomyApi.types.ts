export interface ITermData {
  id?: string;
  name: string;
  defaultLabel: string;
  path: string;
  isSelectable: boolean;
  parentId: string | null;
  sortOrder?: string;
  children: ITermData[];
}
