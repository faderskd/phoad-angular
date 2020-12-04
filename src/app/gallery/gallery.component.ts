import {ServerClient} from "~/app/common/http";
import {RouterExtensions} from "@nativescript/angular";
import {TNSFontIconService} from "nativescript-ngx-fonticon";
import {Configuration} from "~/app/config/Configuration";
import {Authentication} from "~/app/common/authentication";
import {AfterViewInit, Component, OnInit, ViewChild} from "@angular/core";
import {Folder, knownFolders, ObservableArray} from "@nativescript/core";
import {PhotoAtLocation} from "~/app/home/photos";
import {RadListView} from "nativescript-ui-listview";
import {RadListViewComponent} from "nativescript-ui-listview/angular";


@Component({
    templateUrl: "./gallery.component.html",
    styleUrls: ["../styles/common.style.scss", "gallery.component.css"]
})
export class GalleryComponent implements OnInit, AfterViewInit {
    client: ServerClient;
    auth: Authentication;
    radListView: RadListView;
    photoReadUrl: string;
    PHOTO_SAVE_DIR = "saved_images";
    PHOTO_READ_PATH = knownFolders.currentApp().path + `/${this.PHOTO_SAVE_DIR}`;
    PHOTO_READ_URL = "/api/v1/photos/";
    photosList: ObservableArray<PhotoAtLocation>;

    @ViewChild(RadListViewComponent, {static: false})
    radListViewComponent: RadListViewComponent;

    constructor(client: ServerClient, routerExtensions: RouterExtensions,
                fontIconService: TNSFontIconService, config: Configuration,
                auth: Authentication) {
        this.client = client;
        this.photoReadUrl = config.getServerUrl() + this.PHOTO_READ_URL;
        this.auth = auth;
        Folder.fromPath(knownFolders.currentApp().path).getFolder(this.PHOTO_SAVE_DIR);
    }

    ngAfterViewInit(): void {
        this.radListView = this.radListViewComponent.listView;
    }

    ngOnInit(): void {
        this.photosList = new ObservableArray<PhotoAtLocation>([
            new PhotoAtLocation(null, null),
            new PhotoAtLocation(null, null),
            new PhotoAtLocation(null, null),
            new PhotoAtLocation(null, null),
            new PhotoAtLocation(null, null),
            new PhotoAtLocation(null, null),
            new PhotoAtLocation(null, null),
            new PhotoAtLocation(null, null),
        ]);
    }
}
