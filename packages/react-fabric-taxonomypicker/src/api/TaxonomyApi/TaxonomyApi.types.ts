export interface ITermData {
  id?: string;
  name: string;
  path: string;
  isSelectable: boolean;
  parentId: string | null;
  sortOrder?: string;
  children: ITermData[];
}
