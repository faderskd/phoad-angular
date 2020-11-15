import {AfterViewInit, Component, ViewChild} from "@angular/core";
import {ServerClient} from "~/app/common/http";
import {RouterExtensions} from "@nativescript/angular";
import {RadSideDrawerComponent} from "nativescript-ui-sidedrawer/angular";
import {RadSideDrawer} from "nativescript-ui-sidedrawer";
import {TNSFontIconService} from "nativescript-ngx-fonticon";
import * as geolocation from "@nativescript/geolocation";
import * as camera from "@nativescript/camera";
import {Accuracy} from "@nativescript/core/ui/enums";
import {knownFolders, path, Folder} from "@nativescript/core/file-system";
import {ImageSource} from "@nativescript/core/image-source";
import {
    CompleteEventData,
    ErrorEventData,
    ProgressEventData,
    ResultEventData,
    session
} from "@nativescript/background-http";
import {Configuration} from "~/app/config/Configuration";


@Component({
    templateUrl: "./photosmap.component.html",
    styleUrls: ["../styles/common.style.scss", '../styles/sidemenu.style.scss']
})
export class PhotosMapComponent implements AfterViewInit {
    client: ServerClient
    routerExtensions: RouterExtensions
    photoUploadUrl: string
    GEOLOCATION_TIMEOUT = 20000
    GEOLOCATION_MAX_AGE = 5000
    PHOTO_WIDTH = 200
    PHOTO_HEIGHT = 200
    PHOTO_SAVE_DIR = "saved_images"
    PHOTO_SAVE_PATH = knownFolders.currentApp().path + `/${this.PHOTO_SAVE_DIR}`;
    PHOTO_UPLOAD_URL = "/photos/";

    constructor(client: ServerClient, routerExtensions: RouterExtensions,
                fontIconService: TNSFontIconService, config: Configuration) {
        this.client = client;
        this.routerExtensions = routerExtensions;
        this.photoUploadUrl = config.getServerUrl() + this.PHOTO_UPLOAD_URL
        Folder.fromPath(knownFolders.currentApp().path).getFolder(this.PHOTO_SAVE_DIR);
    }

    @ViewChild(RadSideDrawerComponent, {static: false}) public drawerComponent: RadSideDrawerComponent;
    private drawer: RadSideDrawer;

    async ngAfterViewInit() {
        this.drawer = this.drawerComponent.sideDrawer;
        await geolocation.enableLocationRequest();
        await camera.requestPermissions();
    }

    toggleDrawer() {
        if (this.drawer.getIsOpen()) {
            this.drawer.closeDrawer();
        } else {
            this.drawer.showDrawer();
        }
    }

    async takePhoto() {
        try {
            let location = await geolocation.getCurrentLocation(
                {
                    desiredAccuracy: Accuracy.any,
                    maximumAge: this.GEOLOCATION_MAX_AGE,
                    timeout: this.GEOLOCATION_TIMEOUT
                });
            console.log(location);
            let asset = await camera.takePicture(
                {saveToGallery: true, width: this.PHOTO_WIDTH, height: this.PHOTO_HEIGHT, keepAspectRatio: true});
            let filename = 'img_' + location.timestamp.toISOString().split(':').join('_')
            filename = filename.split('.').join('_') + ".jpg";
            let filepath = path.join(this.PHOTO_SAVE_PATH, filename);
            let imageSource = await ImageSource.fromAsset(asset);
            let imagesSaved = imageSource.saveToFile(filepath, "jpg");
            console.log(imagesSaved);
            console.log(filepath);
            // let imageUploadSession = session("phoad-image-upload");
            // let request = {
            //     url: this.photoUploadUrl,
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/octet-stream"
            //     },
            //     description: "Uploading " + filename
            // }
            // let params = [
            //     {name: "fileToUpload", filename: filename, mimeType: "image/jpg"}
            // ];
            // let task = imageUploadSession.multipartUpload(params, request);
            // task.on("progress", progressHandler);
            // task.on("error", errorHandler);
            // task.on("responded", respondedHandler);
            // task.on("complete", completeHandler);

        } catch (err) {
            console.dir(err);
            alert("Sorry, something gone wrong :( Try again")
        }

        function progressHandler(e: ProgressEventData) {
            console.log("progress -> uploaded " + e.currentBytes + " / " + e.totalBytes);
        }

        function errorHandler(e: ErrorEventData) {
            alert("error -> received " + e.responseCode + " code.");
        }

        function respondedHandler(e: ResultEventData) {
            console.log("responsed -> received " + e.responseCode + " code. Server sent: " + e.data);
        }

        function completeHandler(e: CompleteEventData) {
            console.log("complete -> received " + e.responseCode + " code");
        }
    }
}
