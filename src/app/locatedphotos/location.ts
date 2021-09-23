export class Location {
    private readonly _latitude: number;
    private readonly _longitude: number;

    constructor(latitude: number, longitude: number) {
        this._latitude = latitude;
        this._longitude = longitude;
    }

    get longitude(): number {
        return this._longitude;
    }


    get latitude(): number {
        return this._latitude;
    }
}

export class LocationWithTime {
    private readonly _location: Location;
    private readonly _timestamp: string;

    constructor(location: Location, timestamp: string) {
        this._location = location;
        this._timestamp = timestamp;
    }

    get location(): Location {
        return this._location;
    }

    get timestamp(): string {
        return this._timestamp;
    }

    getHumanReadableTimestamp(): string {
        return this.timestamp.substring(0, 10);
    }
}
