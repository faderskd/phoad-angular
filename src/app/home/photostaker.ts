import * as camera from "@nativescript/camera";
import * as geolocation from "@nativescript/geolocation";
import {Accuracy} from "@nativescript/core/ui/enums";
import {Photo, PhotoAtLocation, PhotoLocation} from "./photos";
import {ImageAsset} from "@nativescript/core";
import {path} from "@nativescript/core/file-system";
import {ImageSource} from "@nativescript/core/image-source";

export class PhotosTaker {
    private _settings: PhotosTakerSettings

    constructor(settings: PhotosTakerSettings) {
        this._settings = settings;
    }

    async takePhotoAtLocation(): Promise<PhotoAtLocation> {
        let location = await this.getLocation();
        let asset = await this.takePhoto();
        let photo = await this.saveToFile(location, asset);
        return new PhotoAtLocation(location, photo);
    }

    private async getLocation(): Promise<PhotoLocation> {
        let location = await geolocation.getCurrentLocation(
            {
                desiredAccuracy: Accuracy.any,
                maximumAge: this._settings.geolocationMaxAge,
                timeout: this._settings.geolocationTimeout
            });
        return new PhotoLocation(location.latitude, location.longitude, new Date().toISOString());
    }

    private async takePhoto(): Promise<ImageAsset> {
        return await camera.takePicture(
            {
                saveToGallery: false,
                width: this._settings.photoWidth,
                height: this._settings.photoHeight,
                keepAspectRatio: true
            }
        );
    }

    private async saveToFile(location: PhotoLocation, imageAsset: ImageAsset): Promise<Photo> {
        let filename = 'img_' + location.timestamp.split(':').join('_')
        filename = filename.split('.').join('_') + ".jpg";
        let filepath = path.join(this._settings.photosSavePath, filename);
        let imageSource = await ImageSource.fromAsset(imageAsset);
        imageSource.saveToFile(filepath, "jpg");
        return new Photo(filepath, filename);
    }
}

export class PhotosTakerSettings {
    private _photoWidth: number
    private _photoHeight: number
    private _geolocationMaxAge: number
    private _geolocationTimeout: number
    private _photosSavePath: string

    constructor(photoWidth: number, photoHeight: number, geolocationMaxAge: number,
                geolocationTimeout: number, photosSavePath: string) {
        this._photoWidth = photoWidth;
        this._photoHeight = photoHeight;
        this._geolocationMaxAge = geolocationMaxAge;
        this._geolocationTimeout = geolocationTimeout;
        this._photosSavePath = photosSavePath;
    }

    get geolocationTimeout(): number {
        return this._geolocationTimeout;
    }

    get geolocationMaxAge(): number {
        return this._geolocationMaxAge;
    }

    get photoHeight(): number {
        return this._photoHeight;
    }

    get photoWidth(): number {
        return this._photoWidth;
    }

    get photosSavePath(): string {
        return this._photosSavePath;
    }
}
