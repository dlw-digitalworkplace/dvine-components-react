export interface ITerm {
  id?: string;
  name: string;
  path: string;
  properties?: ITermProperties;
  labels?: string[];
}

export interface ITermProperties {
  isNew?: boolean;
  eTag?: string;
  isSelectable?: boolean;
  children?: ITerm[];
  parentId?: string | null;
}
