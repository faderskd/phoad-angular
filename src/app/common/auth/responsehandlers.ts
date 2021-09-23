import {HttpResponse} from "@nativescript/core/http";
import {Authentication} from "./authentication";
import {RouterExtensions} from "@nativescript/angular";

export class AuthenticationEnsurer {
    constructor(private readonly _authentication: Authentication,
                private readonly _routerExtensions: RouterExtensions) {
    }

    async ensureAuthenticated(response: HttpResponse) {
        if (response.statusCode == 401) {
            if (response.content.toJSON()["detail"].includes("Invalid token")) {
                await this._authentication.clearAuthentication();
                await this._routerExtensions.navigateByUrl("/login");
            }
        }
    }
}
