import {SecureStorage} from "nativescript-secure-storage";
import * as _ from "lodash";
import {Injectable} from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class Authentication {
    private _token: string
    private _storage = new SecureStorage()

    constructor() {
        this._storage = new SecureStorage();
        this._token = null;
        this.loadAuthentication();
    }

    get token(): string {
        return this._token;
    }

    isAuthenticated(): boolean {
        return this._token !== null && !_.isEmpty(this._token);
    }

    loadAuthentication(): void {
        let token = this._storage.getSync({
            key: "token"
        });
        if (token !== null) {
            this._token = token;
        }
    }

    authenticate(token: string): void {
        this._storage.setSync({
            key: "token",
            value: token
        })
        this._token = token;
    }

    async clearAuthentication() {
        await this._storage.remove({
            key: "token"
        });
        this._token = null;
    }
}
