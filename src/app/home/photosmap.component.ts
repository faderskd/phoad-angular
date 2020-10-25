import {Component} from "@angular/core";
import {ServerClient} from "~/app/common/http";
import {Page} from "@nativescript/core";
import {RouterExtensions} from "@nativescript/angular";

@Component({
    templateUrl: "./photosmap.component.html",
    styleUrls: ["../styles/common.style.css"]
})
export class PhotosMapComponent {
    client: ServerClient
    routerExtensions: RouterExtensions

    constructor(client: ServerClient, routerExtensions: RouterExtensions, page: Page) {
        this.client = client;
        this.routerExtensions = routerExtensions;
        page.actionBarHidden = true;
    }
}
