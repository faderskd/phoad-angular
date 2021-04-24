import {PhotoLocation} from "../home/photos";
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
        other.photos.forEach((value => {
            this.photos.push(value)
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
}

export class GalleryPhotoAtLocation {
    private readonly _location: PhotoLocation;
    private readonly _photo: GalleryPhoto;

    constructor(location: PhotoLocation, photo: GalleryPhoto) {
        this._location = location;
        this._photo = photo;
    }

    get photo(): GalleryPhoto {
        return this._photo;
    }

    get location(): PhotoLocation {
        return this._location;
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
