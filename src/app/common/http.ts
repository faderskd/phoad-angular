import {HttpResponse, request} from "@nativescript/core/http";
import {Injectable} from "@angular/core";
import {Configuration} from "../config/Configuration";
import {Authentication} from "~/app/common/authentication";

@Injectable({
    providedIn: "root"
})
export class ServerClient {
    private _serverUrl: string;
    private _auth: Authentication

    private USERS_ENDPOINT = "/api/v1/users/";
    private AUTHENTICATION_ENDPOINT = "/api-token-auth/";
    private PHOTOS_ENDPOINT = "/api/v1/photos/";


    public constructor(config: Configuration, auth: Authentication) {
        this._serverUrl = config.getServerUrl();
        this._auth = auth;
    }

    async registerUser(newUser: any) {
        return await request({
            url: this._serverUrl + this.USERS_ENDPOINT,
            method: "POST",
            headers: {"Content-Type": "application/json"},
            content: JSON.stringify({
                "username": newUser.email,
                "password": newUser.password
            })
        });
    }

    async loginUser(user: any) {
        return await request({
            url: this._serverUrl + this.AUTHENTICATION_ENDPOINT,
            method: "POST",
            headers: {"Content-Type": "application/json"},
            content: JSON.stringify({
                "username": user.email,
                "password": user.password
            })
        })
    }

    async getChronologicalGallery(): Promise<HttpResponse> {
        return await this.getChronologicalGalleryViaUrl(this._serverUrl + this.PHOTOS_ENDPOINT);
    }

    async getChronologicalGalleryViaUrl(url: string): Promise<HttpResponse> {
        return await request({
            url: url,
            headers: {
                "Authorization": `Token ${this._auth.token}`
            },
            method: "GET"
        });
    }
}
