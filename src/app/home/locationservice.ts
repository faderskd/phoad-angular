import * as geolocation from "@nativescript/geolocation";
import {Accuracy} from "@nativescript/core/ui/enums";
import {Injectable} from "@angular/core";
import {Configuration} from "~/app/config/Configuration";
import {Location} from "~/app/locatedphotos/location";

@Injectable({
    providedIn: "root"
})
export class LocationService {
    constructor(private _config: Configuration) {
    }

    async getLocation(): Promise<Location> {
        let location = await geolocation.getCurrentLocation(
            {
                desiredAccuracy: Accuracy.any,
                maximumAge: this._config.geolocationMaxAge,
                timeout: this._config.geolocationTimeout
            });
        return new Location(location.latitude, location.longitude, new Date().toISOString());
    }
}
