import {LocationWithTime} from "./location";


export class PhotoAtLocation {
    private readonly _locationWithTime: LocationWithTime;
    private readonly _photo: Photo;
    private readonly _index: number

    constructor(location: LocationWithTime, photo: Photo, index: number) {
        this._locationWithTime = location;
        this._photo = photo;
        this._index = index;
    }

    get photo(): Photo {
        return this._photo;
    }

    get locationWithTime(): LocationWithTime {
        return this._locationWithTime;
    }

    get index(): number {
        return this._index;
    }
}

export class Photo {
    private readonly _name: string;
    private readonly _imageUrl: string;

    constructor(name: string, imageUrl: string) {
        this._name = name;
        this._imageUrl = imageUrl;
    }

    get imageUrl(): string {
        return this._imageUrl;
    }

    get name(): string {
        return this._name;
    }
}
