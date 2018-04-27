import { assign } from "@microsoft/sp-lodash-subset";
import { PrincipalInfo, PrincipalSource, PrincipalType, SiteUserProps, sp } from "@pnp/sp";
import { SPBatch } from "@pnp/sp/src/batch";

import { ISiteUserInfo } from "../model/ISiteUserInfo";
import { UserInfo } from "../model/SharePointUserPersona";

export interface IPeoplePickerApi {
  getPrincipalInfo(userId: number): Promise<UserInfo>;
  getMatchingUserData(
    filter: string,
    numberOfItems?: number,
    principalType?: PrincipalType,
    sources?: PrincipalSource,
    groupName?: string
  ): Promise<UserInfo[]>;
}

export class PeoplePickerApi implements IPeoplePickerApi {
  public async getPrincipalInfo(userId: number, principalType: number = 15): Promise<UserInfo> {
    const userInfo: ISiteUserInfo = await sp.web.siteUserInfoList.items.getById(userId).get();

    let principalInfo: PrincipalInfo;
    let ensuredUser: SiteUserProps;

    const batch: SPBatch = sp.createBatch();
    sp.utility
      .inBatch(batch)
      .resolvePrincipal(userInfo.EMail, principalType, 15, true, true)
      .then(result => {
        principalInfo = result;
      });
    sp.web
      .inBatch(batch)
      .ensureUser(userInfo.Name)
      .then(result => {
        ensuredUser = result.data;
      });

    await batch.execute();

    const combinedUserInfo: UserInfo = assign({}, ensuredUser!, principalInfo!);

    return combinedUserInfo;
  }

  public async getMatchingUserData(
    filter: string,
    numberOfItems: number = 10,
    principalType: PrincipalType = PrincipalType.All,
    sources: PrincipalSource = PrincipalSource.All,
    groupName: string = ""
  ): Promise<UserInfo[]> {
    const matchingPrincipals: PrincipalInfo[] = await sp.utility.searchPrincipals(
      filter,
      principalType,
      sources,
      groupName,
      numberOfItems
    );

    const batch: SPBatch = sp.createBatch();

    const combinedResults: (PrincipalInfo & SiteUserProps)[] = [];

    matchingPrincipals.map(match => {
      sp.web
        .inBatch(batch)
        .ensureUser(match.LoginName)
        .then(ensuredUser => {
          const combinedUserData: PrincipalInfo & SiteUserProps = assign(
            {},
            match,
            ensuredUser.data
          );
          combinedResults.push(combinedUserData);
        });
    });

    await batch.execute();

    return combinedResults;
  }
}
