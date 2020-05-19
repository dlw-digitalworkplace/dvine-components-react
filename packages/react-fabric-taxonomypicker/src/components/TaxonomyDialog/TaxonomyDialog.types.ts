import { IBaseProps } from "@uifabric/utilities/lib/BaseComponent";
import { IBasePickerSuggestionsProps } from "office-ui-fabric-react/lib/Pickers";
import { ITerm } from "../../model/ITerm";
import { ITreeViewItem } from "../TreeView";

export interface ITaxonomyDialogProps extends IBaseProps {
  title?: string;
  absoluteSiteUrl: string;
  termSetId?: string;
  termSetName?: string;
  rootTermId?: string;
  defaultSelectedItems?: ITerm[];
  pickerSuggestionsProps?: IBasePickerSuggestionsProps;
  itemLimit?: number;
  showTranslatedLabels?: boolean;
  defaultLabelOnly?: boolean;
  exactMatchOnly?: boolean;
  allowAddTerms?: boolean;
  hideDeprecatedTerms?: boolean;
  pathDelimiter?: string;

  isOpen?: boolean;

  lcid?: number;

  onSave?: (items: ITerm[]) => void;
  onDismiss?: () => void;
}

export const testData: ITreeViewItem<ITerm | null> = {
  id: "7258f249-b4fd-4d53-949f-9b2628b51b08",
  label: "Root",
  defaultLabel: "Root",
  children: [
    {
      id: "ab763b5c-9d6f-4478-a798-072f5f7a6c8c",
      label: "Term A",
      defaultLabel: "Term A",
      children: [
        {
          id: "089328a1-dc3a-480b-a0bb-a800c6afa7e9",
          label: "Term A 1",
          children: [],
          defaultLabel: "Term A 1",
          value: {
            id: "089328a1-dc3a-480b-a0bb-a800c6afa7e9",
            name: "Term A 1",
            path: "Term A;Term A 1",
            defaultLabel: "Term A 1",
          },
          isSelectable: true,
        },
        {
          id: "f29dffba-a335-4d68-8642-e4da4bc23ce9",
          label: "Term A 2",
          children: [],
          defaultLabel: "Term A 2",
          value: {
            id: "f29dffba-a335-4d68-8642-e4da4bc23ce9",
            name: "Term A 2",
            path: "Term A;Term A 2",
            defaultLabel: "Term A 2",
          },
          isSelectable: true,
        },
      ],
      value: {
        id: "ab763b5c-9d6f-4478-a798-072f5f7a6c8c",
        name: "Term A",
        path: "Term A",
        defaultLabel: "Term A",
      },
      isSelectable: false,
    },
    {
      id: "b674db32-f58b-4b6a-b1d1-8f490a715467",
      label: "Term B",
      defaultLabel: "Term B",
      children: [
        {
          id: "b7f6dc36-d980-4060-94cf-1cd15d5ba8ae",
          label: "Term B 1",
          defaultLabel: "Term B 1",
          children: [],
          value: {
            id: "b7f6dc36-d980-4060-94cf-1cd15d5ba8ae",
            name: "Term B 1",
            path: "Term B;Term B 1",
            defaultLabel: "Term B 1",
          },
          isSelectable: true,
        },
        {
          id: "22d13bf3-e495-4f04-bbb8-394779f6b498",
          label: "Term B 2",
          defaultLabel: "Term B 2",
          children: [],
          value: {
            id: "22d13bf3-e495-4f04-bbb8-394779f6b498",
            name: "Term B 2",
            path: "Term B;Term B 2",
            defaultLabel: "Term B 2",
          },
          isSelectable: true,
        },
      ],
      value: {
        id: "b674db32-f58b-4b6a-b1d1-8f490a715467",
        name: "Term B",
        path: "Term B",
        defaultLabel: "Term B",
      },
      isSelectable: true,
    },
  ],
  value: null,
  isSelectable: false,
};
