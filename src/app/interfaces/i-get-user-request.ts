import { Page } from "../class/page";
import { IUser } from "./i-user";

export interface IGetUserListRequest {

  page: Page;
  data: IUser;
}
