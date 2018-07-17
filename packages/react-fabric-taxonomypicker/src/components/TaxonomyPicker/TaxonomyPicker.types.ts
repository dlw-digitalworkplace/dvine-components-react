import { IBaseProps } from "@uifabric/utilities/lib/BaseComponent";
import { IIconProps } from "office-ui-fabric-react/lib/Icon";
import { IBasePickerSuggestionsProps } from "office-ui-fabric-react/lib/Pickers";

import { ITerm } from "../../model/ITerm";

export interface ITaxonomyPickerProps extends IBaseProps {
  absoluteSiteUrl: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  termSetId: string;
  itemLimit?: number;
  onChange?: (newValue?: ITerm[]) => void;
  selectedItems?: ITerm[];
  defaultSelectedItems?: ITerm[];
  pickerSuggestionsProps?: IBasePickerSuggestionsProps;
  iconProps?: IIconProps;
  allowAddTerms?: boolean;
  defaultLabelOnly?: boolean;
  exactMatchOnly?: boolean;
}
