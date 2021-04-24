import {ServerClient} from "~/app/common/http";
import {RouterExtensions} from "@nativescript/angular";
import {TNSFontIconService} from "nativescript-ngx-fonticon";
import {AfterViewInit, Component, OnInit, ViewChild} from "@angular/core";
import {LoadOnDemandListViewEventData, RadListView} from "nativescript-ui-listview";
import {RadListViewComponent} from "nativescript-ui-listview/angular";
import {GalleryParser} from "~/app/gallery/galleryparser";
import {alert} from "@nativescript/core/ui/dialogs";
import {Gallery} from "~/app/gallery/gallery";


@Component({
    templateUrl: "./gallery.component.html",
    styleUrls: ["../styles/common.style.scss", "gallery.component.css"]
})
export class GalleryComponent implements OnInit, AfterViewInit {
    private readonly _client: ServerClient;

    gallery: Gallery;
    radListView: RadListView;
    @ViewChild(RadListViewComponent, {static: false})
    radListViewComponent: RadListViewComponent;

    constructor(client: ServerClient, routerExtensions: RouterExtensions,
                fontIconService: TNSFontIconService) {
        this._client = client;
    }

    ngAfterViewInit(): void {
        this.radListView = this.radListViewComponent.listView;
    }

    async ngOnInit(): Promise<void> {
        try {
            let response = await this._client.getChronologicalGallery();
            this.gallery = GalleryParser.parseGallery(response.content.toJSON());
        } catch (err) {
            console.dir(err);
            await alert("Sorry something gone wrong :( Please try again...")
        }
    }

    async onLoadMoreItemsRequested(event: LoadOnDemandListViewEventData) {
        let response = await this._client.getChronologicalGalleryViaUrl(this.gallery.nextUrl);
        let nextGallery = GalleryParser.parseGallery(response.content.toJSON());
        this.gallery.update(nextGallery);
    }
}
