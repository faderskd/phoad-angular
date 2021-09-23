import {PhotoCapturedAtLocation} from "./photos";
import {
    session,
    Task
} from "@nativescript/background-http";
import {Authentication} from "~/app/common/auth/authentication";

export class PhotosUploader {
    private readonly _photoUploadUrl: string;
    private readonly _auth: Authentication;

    constructor(photoUpdateUrl: string, auth: Authentication) {
        this._photoUploadUrl = photoUpdateUrl;
        this._auth = auth;
    }

    uploadPhoto(photoAtLocation: PhotoCapturedAtLocation): Task {
        let imageUploadSession = session("phoad-image-upload");
        let request = {
            url: this._photoUploadUrl,
            method: "POST",
            headers: {
                "Content-Type": "application/form-data",
                "Authorization": `Token ${this._auth.token}`
            },
            description: "Uploading " + photoAtLocation.photo.name
        }
        let params = [
            {name: "image", filename: photoAtLocation.photo.filePath},
            {name: "name", value: photoAtLocation.photo.name},
            {name: "latitude", value: photoAtLocation.locationWithTime.location.latitude},
            {name: "longitude", value: photoAtLocation.locationWithTime.location.longitude},
            {name: "timestamp", value: photoAtLocation.locationWithTime.timestamp},
        ];
        return imageUploadSession.multipartUpload(params, request);
    }
}
