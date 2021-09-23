import * as camera from "@nativescript/camera";
import {PhotoFile, PhotoCapturedAtLocation} from "./photos";
import {File, ImageAsset} from "@nativescript/core";
import {path} from "@nativescript/core/file-system";
import {ImageSource} from "@nativescript/core/image-source";
import {Configuration} from "~/app/config/Configuration";
import {LocationService} from "../../locationservice";
import {LocationWithTime} from "~/app/locatedphotos/location";

export class PhotosManager {
    constructor(private readonly _config: Configuration, private readonly _locationService: LocationService) {
    }

    async takePhotoAtLocation(): Promise<PhotoCapturedAtLocation> {
        let location = await this._locationService.getLocationWithTime();
        let asset = await this.takePhoto();
        let photo = await this.saveToFile(location, asset);
        return new PhotoCapturedAtLocation(location, photo);
    }

    async removePhotoFile(photoAtLocation: PhotoCapturedAtLocation) {
        return await File.fromPath(photoAtLocation.photo.filePath).remove();
    }

    private async takePhoto(): Promise<ImageAsset> {
        return await camera.takePicture(
            {
                saveToGallery: false,
                width: this._config.photoWidth,
                height: this._config.photoHeight,
                keepAspectRatio: true
            }
        );
    }

    private async saveToFile(location: LocationWithTime, imageAsset: ImageAsset): Promise<PhotoFile> {
        let filename = 'img_' + location.timestamp.split(':').join('_')
        filename = filename.split('.').join('_') + ".jpg";
        let filepath = path.join(this._config.photosSavePath, filename);
        let imageSource = await ImageSource.fromAsset(imageAsset);
        imageSource.saveToFile(filepath, "jpg");
        return new PhotoFile(filepath, filename);
    }
}
