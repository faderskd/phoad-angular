import * as geolocation from "@nativescript/geolocation";
import {Accuracy} from "@nativescript/core/ui/enums";
import {Injectable} from "@angular/core";
import {Configuration} from "~/app/config/Configuration";
import {Location, LocationWithTime} from "~/app/locatedphotos/location";

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
        return new Location(location.latitude, location.longitude);
    }

    async getLocationWithTime(): Promise<LocationWithTime> {
        let location = await this.getLocation();
        return new LocationWithTime(location, new Date().toISOString());
    }
}
