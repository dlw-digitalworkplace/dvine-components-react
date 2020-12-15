import { IBaseProps } from "@uifabric/utilities/lib/BaseComponent";
import { IIconProps } from "office-ui-fabric-react/lib/Icon";
import { IBasePickerSuggestionsProps } from "office-ui-fabric-react/lib/Pickers";
import { ITerm } from "../../model/ITerm";
import { ITaxonomyDialogLabels } from "../TaxonomyDialog/TaxonomyDialog.types";

export interface ITaxonomyPickerProps extends IBaseProps {
  absoluteSiteUrl: string;
  title?: string;
  showTranslatedLabels?: boolean;
  hideDeprecatedTerms?: boolean;
  label?: string;
  lcid?: number;
  required?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  termSetId?: string;
  termSetName?: string;
  rootTermId?: string;
  itemLimit?: number;
  onChange?: (newValue?: ITerm[]) => void;
  selectedItems?: ITerm[];
  defaultSelectedItems?: ITerm[];
  pickerSuggestionsProps?: IBasePickerSuggestionsProps;
  iconProps?: IIconProps;
  allowAddTerms?: boolean;
  defaultLabelOnly?: boolean;
  exactMatchOnly?: boolean;
  pathDelimiter?: string;
  labels?: ITaxonomyPickerLabels;
}

export interface ITaxonomyPickerLabels {
  openDialogButtonTitle?: string;
  dialogLabels?: ITaxonomyDialogLabels;
}
