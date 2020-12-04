export class PhotoLocation {
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

export class Photo {
    private readonly _filePath: string
    private readonly _name: string

    constructor(filePath: string, name: string) {
        this._filePath = filePath;
        this._name = name;
    }

    get name(): string {
        return this._name;
    }

    get filePath(): string {
        return this._filePath;
    }
}

export class PhotoAtLocation {
    private _location: PhotoLocation
    private _photo: Photo

    constructor(location: PhotoLocation, photo: Photo) {
        this._location = location;
        this._photo = photo;
    }


    get photo(): Photo {
        return this._photo;
    }

    get location(): PhotoLocation {
        return this._location;
    }
}
