export interface ITerm {
  id?: string;
  defaultLabel: string;
  name: string;
  path: string;
  properties?: ITermProperties;
  sortOrder?: string;
  labels?: string[];
}

export interface ITermProperties {
  isNew?: boolean;
  eTag?: string;
  isAvailable?: boolean;
  isDeprecated?: boolean;
  children?: ITerm[];
  parentId?: string | null;
}
