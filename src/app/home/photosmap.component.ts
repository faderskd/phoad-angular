import {AfterViewInit, Component, ViewChild} from "@angular/core";
import {ServerClient} from "~/app/common/http";
import {RouterExtensions} from "@nativescript/angular";
import {RadSideDrawerComponent} from "nativescript-ui-sidedrawer/angular";
import {RadSideDrawer} from "nativescript-ui-sidedrawer";
import {TNSFontIconService} from "nativescript-ngx-fonticon";
import * as geolocation from "@nativescript/geolocation";
import * as camera from "@nativescript/camera";
import {knownFolders} from "@nativescript/core/file-system";
import {Configuration} from "~/app/config/Configuration";
import {Authentication} from "~/app/common/authentication";
import {PhotosManager, PhotosManagerSettings} from "~/app/home/photosmanager";
import {PhotosUploader} from "~/app/home/photosuploader";
import {ErrorEventData, ResultEventData} from "@nativescript/background-http";
import {alert} from "@nativescript/core/ui/dialogs";


@Component({
    templateUrl: "./photosmap.component.html",
    styleUrls: ["../styles/common.style.scss", '../styles/sidemenu.style.scss']
})
export class PhotosMapComponent implements AfterViewInit {
    private _client: ServerClient;
    private _routerExtensions: RouterExtensions;
    private _drawer: RadSideDrawer;

    private GEOLOCATION_TIMEOUT = 20000;
    private GEOLOCATION_MAX_AGE = 1000;

    private PHOTO_WIDTH = 200;
    private PHOTO_HEIGHT = 200;
    private PHOTO_SAVE_DIR = "saved_images";
    private PHOTO_SAVE_PATH = knownFolders.currentApp().path + `/${this.PHOTO_SAVE_DIR}`;
    private PHOTO_UPLOAD_URL = "/api/v1/photos/";

    private _photosManager = new PhotosManager(
        new PhotosManagerSettings(
            this.PHOTO_WIDTH,
            this.PHOTO_HEIGHT,
            this.GEOLOCATION_MAX_AGE,
            this.GEOLOCATION_TIMEOUT,
            this.PHOTO_SAVE_PATH
        ))
    private _photosUploader: PhotosUploader

    processing: boolean = false

    @ViewChild(RadSideDrawerComponent, {static: false})
    private _drawerComponent: RadSideDrawerComponent;

    constructor(client: ServerClient, routerExtensions: RouterExtensions,
                fontIconService: TNSFontIconService, config: Configuration,
                auth: Authentication) {
        this._client = client;
        this._routerExtensions = routerExtensions;
        this._photosUploader = new PhotosUploader(config.getServerUrl() + this.PHOTO_UPLOAD_URL, auth);
    }

    async ngAfterViewInit() {
        this._drawer = this._drawerComponent.sideDrawer;
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
            let photoAtLocation = await this._photosManager.takePhotoAtLocation();
            this.processing = true;
            let task = this._photosUploader.uploadPhoto(photoAtLocation);
            task.on("complete", async () => {
                this.processing = false;
                await this._photosManager.removePhotoFile(photoAtLocation);
            });
            task.on("error", (e: ErrorEventData) => {
                alert("Something gone wrong :( Please try again...")
                console.dir(e);
            })
            task.on("responded", (r: ResultEventData) => {
                if (r.responseCode != 201) {
                    alert("Sorry something gone wrong :( Please try again...");
                    console.dir(r);
                }
            });
        } catch (err) {
            console.dir(err);
            await alert("Sorry something gone wrong :( Please try again...")
        }
    }
}
