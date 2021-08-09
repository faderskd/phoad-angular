import {ObservableArray} from "@nativescript/core";
import {PhotoAtLocation} from "~/app/locatedphotos/photos";

export class PhotosBatch {
    protected _photos: ObservableArray<PhotoAtLocation>;
    protected _nextUrl: string;
    protected _currentNames: Set<String>;

    constructor(photos: ObservableArray<PhotoAtLocation>, nextUrl: string) {
        this._photos = photos;
        this._nextUrl = nextUrl;
        this._currentNames = new Set<String>();
        photos.forEach(value => this._currentNames.add(value.photo.name));
    }

    update(other: PhotosBatch) {
        this.nextUrl = other.nextUrl
        let index = this.photos.length;
        other.photos
            .filter(value => !this._currentNames.has(value.photo.name))
            .forEach((value => {
                this._currentNames.add(value.photo.name);
                this.photos.push(
                    new PhotoAtLocation(value.location, value.photo, index++))
            }));
    }

    get photos(): ObservableArray<PhotoAtLocation> {
        return this._photos;
    }

    get nextUrl(): string {
        return this._nextUrl;
    }

    set nextUrl(value: string) {
        this._nextUrl = value;
    }

    get length() {
        return this._photos.length;
    }
}
