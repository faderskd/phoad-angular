import {request} from "@nativescript/core/http";
import {Injectable} from "@angular/core";
import {Configuration} from "../config/Configuration";

@Injectable({
    providedIn: "root"
})
export class ServerClient {
    serverUrl: string;
    USERS_ENDPOINT = "/api/v1/users/";
    AUTHENTICATION_ENDPOINT = "/api-token-auth/";

    public constructor(config: Configuration) {
        this.serverUrl = config.getServerUrl();
    }

    async registerUser(newUser) {
        return await request({
            url: this.serverUrl + this.USERS_ENDPOINT,
            method: "POST",
            headers: {"Content-Type": "application/json"},
            content: JSON.stringify({
                "username": newUser.email,
                "password": newUser.password
            })
        });
    }

    async loginUser(user) {
        return await request({
            url: this.serverUrl + this.AUTHENTICATION_ENDPOINT,
            method: "POST",
            headers: {"Content-Type": "application/json"},
            content: JSON.stringify({
                "username": user.email,
                "password": user.password
            })
        })
    }
}
