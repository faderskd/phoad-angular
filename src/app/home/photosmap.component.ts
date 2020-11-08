import {AfterViewInit, Component, ViewChild} from "@angular/core";
import {ServerClient} from "~/app/common/http";
import {RouterExtensions} from "@nativescript/angular";
import {RadSideDrawerComponent} from "nativescript-ui-sidedrawer/angular";
import {RadSideDrawer} from "nativescript-ui-sidedrawer";
import {TNSFontIconService} from "nativescript-ngx-fonticon";
import * as geolocation from "@nativescript/geolocation";
import {Accuracy} from "@nativescript/core/ui/enums";

@Component({
    templateUrl: "./photosmap.component.html",
    styleUrls: ["../styles/common.style.scss", '../styles/sidemenu.style.scss']
})
export class PhotosMapComponent implements AfterViewInit {
    client: ServerClient
    routerExtensions: RouterExtensions
    GEOLOCATION_TIMEOUT = 20000
    GEOLOCATION_MAX_AGE = 5000

    constructor(client: ServerClient, routerExtensions: RouterExtensions,
                fontIconService: TNSFontIconService) {
        this.client = client;
        this.routerExtensions = routerExtensions;
    }

    @ViewChild(RadSideDrawerComponent, {static: false}) public drawerComponent: RadSideDrawerComponent;
    private drawer: RadSideDrawer;

    ngAfterViewInit() {
        this.drawer = this.drawerComponent.sideDrawer;
    }

    toggleDrawer() {
        if (this.drawer.getIsOpen()) {
            this.drawer.closeDrawer();
        } else {
            this.drawer.showDrawer();
        }
    }

    async takePhoto() {
        await geolocation.enableLocationRequest();
        let location = await geolocation.getCurrentLocation(
            {desiredAccuracy: Accuracy.high, maximumAge: this.GEOLOCATION_MAX_AGE, timeout: this.GEOLOCATION_TIMEOUT});

    }
}
