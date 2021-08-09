import config from './config.js';
import {Injectable} from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class Configuration {
    getServerUrl(): string {
        return config.SERVER_URL;
    }

    get photoHeight(): number {
        return config.TAKE_PHOTO_HEIGHT;
    }

    get photoWidth(): number {
        return config.TAKE_PHOTO_WIDTH;
    }

    get photosSavePath(): string {
        return config.TAKE_PHOTO_SAVE_PATH;
    }

    get geolocationMaxAge(): number {
        return config.GEOLOCATION_MAX_AGE;
    }

    get geolocationTimeout(): number {
        return config.GEOLOCATION_TIMEOUT;
    }

    get mapMarkersLimit(): number {
        return config.MAP_MARKERS_LIMIT;
    }
}
