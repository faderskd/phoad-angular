import {AfterViewInit, Component, ViewChild} from "@angular/core";
import {ServerClient} from "~/app/common/http";
import {RouterExtensions, registerElement} from "@nativescript/angular";
import {RadSideDrawerComponent} from "nativescript-ui-sidedrawer/angular";
import {RadSideDrawer} from "nativescript-ui-sidedrawer";
import {TNSFontIconService} from "nativescript-ngx-fonticon";
import * as geolocation from "@nativescript/geolocation";
import * as camera from "@nativescript/camera";
import {Configuration} from "~/app/config/Configuration";
import {Authentication} from "~/app/common/authentication";
import {PhotosManager} from "~/app/home/photosmanager";
import {PhotosUploader} from "~/app/home/photosuploader";
import {ErrorEventData, ResultEventData} from "@nativescript/background-http";
import {alert} from "@nativescript/core/ui/dialogs";
import {LocationService} from "~/app/home/locationservice";
import {Location} from "~/app/locatedphotos/location";
import {MapboxManager} from "~/app/home/mapboxmanager";
import {AuthenticationEnsurer} from "~/app/common/responsehandlers";

registerElement("Mapbox", () => require("@nativescript-community/ui-mapbox").MapboxView);


@Component({
    templateUrl: "./photosmap.component.html",
    styleUrls: ["../styles/common.style.scss", '../styles/sidemenu.style.scss']
})
export class PhotosMapComponent implements AfterViewInit {
    private PHOTO_UPLOAD_URL = "/api/v1/photos/";

    private _client: ServerClient;
    private _photosManager: PhotosManager
    private _routerExtensions: RouterExtensions;
    private _drawer: RadSideDrawer;
    private _photosUploader: PhotosUploader;
    private _locationService: LocationService;
    private _currentLocation: Location;
    private _config: Configuration;
    private _mapboxManager: MapboxManager;
    private _authenticationEnsurer: AuthenticationEnsurer;

    processing: boolean = false

    @ViewChild(RadSideDrawerComponent, {static: false})
    private _drawerComponent: RadSideDrawerComponent;

    constructor(client: ServerClient, routerExtensions: RouterExtensions,
                fontIconService: TNSFontIconService, config: Configuration,
                auth: Authentication, locationService: LocationService) {
        this._client = client;
        this._routerExtensions = routerExtensions;
        this._locationService = locationService;
        this._photosUploader = new PhotosUploader(config.getServerUrl() + this.PHOTO_UPLOAD_URL, auth);
        this._photosManager = new PhotosManager(config, locationService);
        this._config = config;
        this._authenticationEnsurer = new AuthenticationEnsurer(auth, routerExtensions);
    }

    async ngAfterViewInit() {
        this._drawer = this._drawerComponent.sideDrawer;
        await geolocation.enableLocationRequest();
        await camera.requestPermissions();
        this._currentLocation = await this._locationService.getLocation();
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

    async onMapReady($event: any) {
        let currentLocation = await this._locationService.getLocation();
        let mapboxView = $event.map;
        this._mapboxManager = new MapboxManager(this._client, this._config, mapboxView, this._authenticationEnsurer);
        await this._mapboxManager.initMapbox(currentLocation);
    }
}
