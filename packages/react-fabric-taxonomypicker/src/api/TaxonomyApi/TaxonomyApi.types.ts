export interface ITermData {
  id?: string;
  name: string;
  defaultLabel: string;
  path: string;
  isAvailable: boolean;
  isDeprecated?: boolean;
  parentId: string | null;
  sortOrder?: string;
  children: ITermData[];
}
