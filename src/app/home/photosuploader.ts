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
            {name: "latitude", value: photoAtLocation.location.latitude},
            {name: "longitude", value: photoAtLocation.location.longitude},
            {name: "timestamp", value: photoAtLocation.location.timestamp},
        ];
        return imageUploadSession.multipartUpload(params, request);
        // task.on("progress", this.progressHandler);
        // task.on("error", this.errorHandler);
        // task.on("responded", this.respondedHandler);
        // task.on("complete", this.completeHandler);
    }

    // private progressHandler(e: ProgressEventData) {
    //     console.log("progress -> uploaded " + e.currentBytes + " / " + e.totalBytes);
    // }
    //
    // private errorHandler(e: ErrorEventData) {
    //     alert("error -> received " + e.responseCode + " code.");
    // }
    //
    // private respondedHandler(e: ResultEventData) {
    //     console.log("responsed -> received " + e.responseCode + " code. Server sent: " + e.data);
    // }
    //
    // private completeHandler(e: CompleteEventData) {
    //     console.log("complete -> received " + e.responseCode + " code");
    // }
}
