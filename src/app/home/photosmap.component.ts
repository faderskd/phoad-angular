import {AfterViewInit, Component, ViewChild} from "@angular/core";
import {ServerClient} from "~/app/common/http";
import {RouterExtensions} from "@nativescript/angular";
import {RadSideDrawerComponent} from "nativescript-ui-sidedrawer/angular";
import {RadSideDrawer} from "nativescript-ui-sidedrawer";
import {TNSFontIconService} from "nativescript-ngx-fonticon";

@Component({
    templateUrl: "./photosmap.component.html",
    styleUrls: ["../styles/common.style.scss", '../styles/sidemenu.style.scss']
})
export class PhotosMapComponent implements AfterViewInit {
    client: ServerClient
    routerExtensions: RouterExtensions

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

    public toggleDrawer() {
        if (this.drawer.getIsOpen()) {
            this.drawer.closeDrawer();
        } else {
            this.drawer.showDrawer();
        }
    }
}
