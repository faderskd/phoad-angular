import {PhotoAtLocation} from "./photos";
import {
    session,
    Task
} from "@nativescript/background-http";
import {Authentication} from "../common/authentication";

export class PhotosUploader {
    private _photoUploadUrl: string
    private _auth: Authentication

    constructor(photoUpdateUrl: string, auth: Authentication) {
        this._photoUploadUrl = photoUpdateUrl;
        this._auth = auth;
    }

    uploadPhoto(photoAtLocation: PhotoAtLocation): Task {
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
            {name: "latitude", value: photoAtLocation.location.latitude},
            {name: "longitude", value: photoAtLocation.location.longitude},
            {name: "timestamp", value: photoAtLocation.location.timestamp},
        ];
        return imageUploadSession.multipartUpload(params, request);
        // task.on("complete", this.completeHandler);
    }

    // private completeHandler(e: CompleteEventData) {
    //     console.log("complete -> received " + e.responseCode + " code");
    // }
}
