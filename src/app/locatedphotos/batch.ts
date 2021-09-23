import {ObservableArray} from "@nativescript/core";
import {PhotoAtLocation} from "~/app/locatedphotos/photos";

export class PhotosBatch {
    protected _photos: ObservableArray<PhotoAtLocation>;
    protected _nextUrl: string;
    protected _currentNames: Set<String>;

    constructor(photos: ObservableArray<PhotoAtLocation>, nextUrl: string) {
        this._photos = new ObservableArray<PhotoAtLocation>();
        this._currentNames = new Set<String>();
        this.updatePhotos(photos, nextUrl);
    }

    update(other: PhotosBatch) {
        this.updatePhotos(other.photos, other.nextUrl);
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

    private updatePhotos(photos: ObservableArray<PhotoAtLocation>, nextUrl: string) {
        this.nextUrl = nextUrl;
        let index = this.photos.length;
        photos
            .filter(value => !this._currentNames.has(value.photo.name))
            .forEach((value => {
                this._currentNames.add(value.photo.name);
                this.photos.push(
                    new PhotoAtLocation(value.locationWithTime, value.photo, index++))
            }));
    }
}
