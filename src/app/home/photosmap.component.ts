import {AfterViewInit, Component, ViewChild} from "@angular/core";
import {ServerClient} from "~/app/common/http";
import {RouterExtensions} from "@nativescript/angular";
import {RadSideDrawerComponent} from "nativescript-ui-sidedrawer/angular";
import {RadSideDrawer} from "nativescript-ui-sidedrawer";
import {TNSFontIconService} from "nativescript-ngx-fonticon";
import * as geolocation from "@nativescript/geolocation";
import * as camera from "@nativescript/camera";
import {knownFolders, Folder} from "@nativescript/core/file-system";
import {Configuration} from "~/app/config/Configuration";
import {Authentication} from "~/app/common/authentication";
import {PhotosTaker, PhotosTakerSettings} from "~/app/home/photostaker";
import {PhotosUploader} from "~/app/home/photosuploader";


@Component({
    templateUrl: "./photosmap.component.html",
    styleUrls: ["../styles/common.style.scss", '../styles/sidemenu.style.scss']
})
export class PhotosMapComponent implements AfterViewInit {
    private _client: ServerClient;
    private _routerExtensions: RouterExtensions;
    private _drawer: RadSideDrawer;

    private GEOLOCATION_TIMEOUT = 20000;
    private GEOLOCATION_MAX_AGE = 5000;

    private PHOTO_WIDTH = 200;
    private PHOTO_HEIGHT = 200;
    private PHOTO_SAVE_DIR = "saved_images";
    private PHOTO_SAVE_PATH = knownFolders.currentApp().path + `/${this.PHOTO_SAVE_DIR}`;
    private PHOTO_UPLOAD_URL = "/api/v1/photos/";

    private _photosTaker = new PhotosTaker(
        new PhotosTakerSettings(
            this.PHOTO_WIDTH,
            this.PHOTO_HEIGHT,
            this.GEOLOCATION_MAX_AGE,
            this.GEOLOCATION_TIMEOUT,
            this.PHOTO_SAVE_PATH
        ))
    private _photosUploader: PhotosUploader

    processing: boolean = false

    @ViewChild(RadSideDrawerComponent, {static: false})
    drawerComponent: RadSideDrawerComponent;

    constructor(client: ServerClient, routerExtensions: RouterExtensions,
                fontIconService: TNSFontIconService, config: Configuration,
                auth: Authentication) {
        this._client = client;
        this._routerExtensions = routerExtensions;
        this._photosUploader = new PhotosUploader(config.getServerUrl() + this.PHOTO_UPLOAD_URL, auth);
        Folder.fromPath(knownFolders.currentApp().path).getFolder(this.PHOTO_SAVE_DIR);
    }

    async ngAfterViewInit() {
        this._drawer = this.drawerComponent.sideDrawer;
        await geolocation.enableLocationRequest();
        await camera.requestPermissions();
    }

    toggleDrawer() {
        if (this._drawer.getIsOpen()) {
            this._drawer.closeDrawer();
        } else {
            this._drawer.showDrawer();
        }
    }

    async takePhotoAtLocation() {
        try {
            let photoAtLocation = await this._photosTaker.takePhotoAtLocation();
            this.processing = true;
            let task = this._photosUploader.uploadPhoto(photoAtLocation);
            task.on("complete", () => {
                this.processing = false;
            });
        } catch (err) {
            console.dir(err);
            alert("Sorry, something gone wrong :( Try again")
        }
    }
}
