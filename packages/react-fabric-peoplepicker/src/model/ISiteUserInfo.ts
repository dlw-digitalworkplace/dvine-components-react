import { IUserPicture } from "./IUserPicture";

export interface ISiteUserInfo {
  Id: number;
  Title: string;
  Name: string;
  EMail: string;
  SipAddress: string;
  IsSiteAdmin: boolean;
  Picture?: IUserPicture;
  Department?: string;
  JobTitle?: string;
  FirstName?: string;
  LastName?: string;
  WorkPhone?: string;
  UserName: string;
  Office?: string;
}
