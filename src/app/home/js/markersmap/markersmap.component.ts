import {AfterViewInit, Component, ViewChild, ViewContainerRef} from "@angular/core";
import {ServerClient} from "~/app/common/http/httpclient";
import {RouterExtensions, registerElement, ModalDialogService} from "@nativescript/angular";
import {RadSideDrawerComponent} from "nativescript-ui-sidedrawer/angular";
import {RadSideDrawer} from "nativescript-ui-sidedrawer";
import {TNSFontIconService} from "nativescript-ngx-fonticon";
import * as geolocation from "@nativescript/geolocation";
import * as camera from "@nativescript/camera";
import {Configuration} from "~/app/config/Configuration";
import {Authentication} from "~/app/common/auth/authentication";
import {PhotosManager} from "../photos/photosmanager";
import {PhotosUploader} from "../photos/photosuploader";
import {ErrorEventData, ResultEventData} from "@nativescript/background-http";
import {alert} from "@nativescript/core/ui/dialogs";
import {LocationService} from "../../locationservice";
import {Location} from "~/app/locatedphotos/location";
import {MapboxManager, MapboxManagerBuilder} from "./mapboxmanager";
import {AuthenticationEnsurer} from "~/app/common/auth/responsehandlers";

registerElement("Mapbox", () => require("@nativescript-community/ui-mapbox").MapboxView);


@Component({
    templateUrl: "../../templates/markersmap/markersmap.component.html",
    styleUrls: ["../../../styles/common.style.scss", '../../templates/markersmap/sidemenu.style.scss']
})
export class MarkersMapComponent implements AfterViewInit {
    private static readonly PHOTO_UPLOAD_URL = "/api/v1/photos/";

    private readonly _mapboxManagerBuilder: MapboxManagerBuilder;
    private readonly _photosManager: PhotosManager
    private readonly _photosUploader: PhotosUploader;
    private readonly _locationService: LocationService;

    private _drawer: RadSideDrawer;
    private _currentLocation: Location;
    private _mapboxManager: MapboxManager;

    processing: boolean = false

    @ViewChild(RadSideDrawerComponent, {static: false})
    private _drawerComponent: RadSideDrawerComponent;

    constructor(client: ServerClient, routerExtensions: RouterExtensions,
                fontIconService: TNSFontIconService, config: Configuration,
                auth: Authentication, locationService: LocationService,
                modalDialogService: ModalDialogService, vcRef: ViewContainerRef) {
        this._mapboxManagerBuilder = new MapboxManagerBuilder()
            .withClient(client)
            .withAuthenticationEnsurer(new AuthenticationEnsurer(auth, routerExtensions))
            .withConfig(config)
            .withModalDialogService(modalDialogService)
            .withViewContainer(vcRef);
        this._locationService = locationService;
        this._photosUploader = new PhotosUploader(config.getServerUrl() + MarkersMapComponent.PHOTO_UPLOAD_URL, auth);
        this._photosManager = new PhotosManager(config, locationService);
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
        this._mapboxManager = this._mapboxManagerBuilder
            .withMapBoxView(mapboxView)
            .build();
        await this._mapboxManager.initMapbox(currentLocation);
    }
}