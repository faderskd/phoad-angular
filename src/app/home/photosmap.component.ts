import {AfterViewInit, Component, ViewChild} from "@angular/core";
import {ServerClient} from "~/app/common/http";
import {RouterExtensions} from "@nativescript/angular";
import {RadSideDrawerComponent} from "nativescript-ui-sidedrawer/angular";
import {RadSideDrawer} from "nativescript-ui-sidedrawer";
import {TNSFontIconService} from "nativescript-ngx-fonticon";
import * as geolocation from "@nativescript/geolocation";
import * as camera from "@nativescript/camera";
import {Accuracy} from "@nativescript/core/ui/enums";
import {Image} from "@nativescript/core/ui";


@Component({
    templateUrl: "./photosmap.component.html",
    styleUrls: ["../styles/common.style.scss", '../styles/sidemenu.style.scss']
})
export class PhotosMapComponent implements AfterViewInit {
    client: ServerClient
    routerExtensions: RouterExtensions
    GEOLOCATION_TIMEOUT = 20000
    GEOLOCATION_MAX_AGE = 5000
    PHOTO_WIDTH = 200
    PHOTO_HEIGHT = 200

    constructor(client: ServerClient, routerExtensions: RouterExtensions,
                fontIconService: TNSFontIconService) {
        this.client = client;
        this.routerExtensions = routerExtensions;
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
                    desiredAccuracy: Accuracy.high,
                    maximumAge: this.GEOLOCATION_MAX_AGE,
                    timeout: this.GEOLOCATION_TIMEOUT
                });
            let asset = await camera.takePicture(
                {saveToGallery: true, width: this.PHOTO_WIDTH, height: this.PHOTO_HEIGHT, keepAspectRatio: true});
            let image = new Image();
            console.log(asset)
            // image.src = asset;
            // send image to server
        } catch (err) {
            console.dir(err);
            alert("Sorry, something gone wrong :( Try again")
        }
    }
}
