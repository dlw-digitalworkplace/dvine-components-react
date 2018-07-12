import { PrincipalType } from "@pnp/sp";
import { autobind } from "@uifabric/utilities";
import { Label } from "office-ui-fabric-react/lib/Label";
import {
  CompactPeoplePicker,
  IBasePickerSuggestionsProps,
  NormalPeoplePicker
} from "office-ui-fabric-react/lib/Pickers";
import * as React from "react";

import { PeoplePickerApi } from "../api/PeoplePickerApi";
import { SharePointUserPersona, UserInfo } from "../model/SharePointUserPersona";

export enum PeoplePickerType {
  Normal = 0,
  Compact = 1
}

type PickerType = typeof NormalPeoplePicker | typeof CompactPeoplePicker;

export interface IPeoplePickerProps {
  label?: string;
  required?: boolean;
  allowUsers?: boolean;
  allowSharePointGroups?: boolean;
  allowSecurityGroups?: boolean;
  allowDistributionGroups?: boolean;
  itemLimit?: number;
  searchResultItemLimit?: number;
  type?: PeoplePickerType;
  selectedItems?: SharePointUserPersona[];
  defaultSelectedItems?: SharePointUserPersona[];

  onChange?: (items: any[]) => void; // todo: change to custom Persona object
}

export interface IPeoplePickerState {}

export class PeoplePicker extends React.Component<IPeoplePickerProps, IPeoplePickerState> {
  private suggestionProps: IBasePickerSuggestionsProps = {
    suggestionsHeaderText: "Suggested People",
    noResultsFoundText: "No results found",
    loadingText: "Loading..."
  };

  private peoplePickerService: PeoplePickerApi;

  constructor(props: IPeoplePickerProps) {
    super(props);

    this.peoplePickerService = new PeoplePickerApi();
  }

  public render(): JSX.Element {
    const { label, required, itemLimit, defaultSelectedItems, selectedItems } = this.props;

    const Picker: PickerType =
      this.props.type === PeoplePickerType.Compact ? CompactPeoplePicker : NormalPeoplePicker;

    return (
      <div>
        {label && <Label required={required}>{label}</Label>}
        <Picker
          className={"ms-PeoplePicker"}
          defaultSelectedItems={defaultSelectedItems}
          getTextFromItem={this._getTextFromItem}
          itemLimit={itemLimit}
          onChange={this._onChange}
          onResolveSuggestions={this._onFilterChanged}
          pickerSuggestionsProps={this.suggestionProps}
          selectedItems={selectedItems}
        />
      </div>
    );
  }

  @autobind
  private _getTextFromItem(persona: SharePointUserPersona): string {
    return persona.primaryText;
  }

  @autobind
  private async _onFilterChanged(
    filter: string,
    selectedItems?: SharePointUserPersona[]
  ): Promise<SharePointUserPersona[]> {
    const principalType: PrincipalType = this._getPrincipalType();

    const { searchResultItemLimit } = this.props;

    if (filter && filter.length > 0) {
      const matchingUsers: UserInfo[] = await this.peoplePickerService.getMatchingUserData(
        filter,
        searchResultItemLimit,
        principalType
      );

      return matchingUsers.map(user => new SharePointUserPersona(user));
    }

    return [];
  }

  @autobind
  private _onChange(items: SharePointUserPersona[]): void {
    if (this.props.onChange) {
      this.props.onChange(items);
    }
  }

  private _getPrincipalType(): PrincipalType {
    let principalType: PrincipalType = PrincipalType.None;
    principalType += this.props.allowUsers ? PrincipalType.User : 0;
    principalType += this.props.allowDistributionGroups ? PrincipalType.DistributionList : 0;
    principalType += this.props.allowSecurityGroups ? PrincipalType.SecurityGroup : 0;
    principalType += this.props.allowSharePointGroups ? PrincipalType.SharePointGroup : 0;

    return principalType;
  }
}
