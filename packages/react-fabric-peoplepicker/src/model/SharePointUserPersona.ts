import { PrincipalInfo, SiteUserProps } from "@pnp/sp";
import { IPersona } from "office-ui-fabric-react/lib/Persona";

export type UserInfo = PrincipalInfo & SiteUserProps;

export class SharePointUserPersona implements IPersona {
  public primaryText: string;
  public secondaryText: string;
  public tertiaryText: string;
  public imageUrl: string;
  public imageShouldFadeIn: boolean;

  private _user: UserInfo;

  constructor(user: UserInfo) {
    this.User = user;
  }

  public get User(): UserInfo {
    return this._user;
  }

  public set User(user: UserInfo) {
    this._user = user;
    this.primaryText = user.DisplayName;
    this.secondaryText = user.Email || user.LoginName;
    this.tertiaryText = user.Department;
    this.imageShouldFadeIn = true;
    this.imageUrl = `/_layouts/15/userphoto.aspx?size=S&accountname=${user.LoginName}`;
  }
}
