import {SecureStorage} from "nativescript-secure-storage";
import * as _ from "lodash";

export class Auth {
  private _token: string
  private _storage = new SecureStorage()

  constructor() {
    this._storage = new SecureStorage();
    this._token = null;
  }

  get token() {
    return this._token;
  }

  isAuthenticated() {
    return this._token !== null && !_.isEmpty(this._token);
  }

  loadAuthentication() {
    let token = this._storage.getSync({
      key: "token"
    });
    if (token !== null) {
      this._token = token;
    }
  }

  authenticate(token: string) {
    this._storage.setSync({
      key: "token",
      value: token
    })
    this._token = token;
  }
}
