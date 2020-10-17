import config from './config.js';
import {Injectable} from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class Configuration {
    getServerUrl(): string {
        return config.SERVER_URL;
    }
}
