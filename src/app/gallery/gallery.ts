import {Location} from "../home/photos";
import {ObservableArray} from "@nativescript/core";

export class Gallery {
    private _photos: ObservableArray<GalleryPhotoAtLocation>
    private _nextUrl: string

    constructor(photos: ObservableArray<GalleryPhotoAtLocation>, nextUrl: string) {
        this._photos = photos;
        this._nextUrl = nextUrl;
    }

    update(other: Gallery) {
        this.nextUrl = other.nextUrl
        let index = this.photos.length;
        other.photos.forEach((value => {
            this.photos.push(
                new GalleryPhotoAtLocation(value.location, value.photo, index++))
        }));
    }

    get photos(): ObservableArray<GalleryPhotoAtLocation> {
        return this._photos;
    }

    get nextUrl(): string {
        return this._nextUrl;
    }

    set photos(value: ObservableArray<GalleryPhotoAtLocation>) {
        this._photos = value;
    }

    set nextUrl(value: string) {
        this._nextUrl = value;
    }

    takeNextPhoto(photo: GalleryPhotoAtLocation): GalleryPhotoAtLocation {
        if (this.photos.length== 0) {
            return null;
        }
        if (this.photos.length > photo.index + 1) {
            return this.photos[photo.index + 1];
        }
        return this.photos[this.photos.length - 1];
    }

    static empty() {
        return new Gallery(new ObservableArray<GalleryPhotoAtLocation>([]), null);
    }
}

export class GalleryPhotoAtLocation {
    private readonly _location: Location;
    private readonly _photo: GalleryPhoto;
    private readonly _index: number

    constructor(location: Location, photo: GalleryPhoto, index: number) {
        this._location = location;
        this._photo = photo;
        this._index = index;
    }

    get photo(): GalleryPhoto {
        return this._photo;
    }

    get location(): Location {
        return this._location;
    }

    get index(): number {
        return this._index;
    }
}

export class GalleryPhoto {
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
