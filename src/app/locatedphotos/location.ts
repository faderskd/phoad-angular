export class Location {
    private readonly _latitude: number
    private readonly _longitude: number
    private readonly _timestamp: string

    constructor(latitude: number, longitude: number, timestamp: string) {
        this._latitude = latitude;
        this._longitude = longitude;
        this._timestamp = timestamp
    }

    get longitude(): number {
        return this._longitude;
    }

    get timestamp(): string {
        return this._timestamp;
    }

    get latitude(): number {
        return this._latitude;
    }
}
