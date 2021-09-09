import {Location} from "~/app/locatedphotos/location";

export class PhotoFile {
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

export class PhotoCapturedAtLocation {
    private readonly _location: Location
    private readonly _photo: PhotoFile

    constructor(location: Location, photo: PhotoFile) {
        this._location = location;
        this._photo = photo;
    }

    get photo(): PhotoFile {
        return this._photo;
    }

    get location(): Location {
        return this._location;
    }
}
