import {ServerClient} from "~/app/common/http";
import {ModalDialogService, RouterExtensions} from "@nativescript/angular";
import {TNSFontIconService} from "nativescript-ngx-fonticon";
import {AfterViewInit, Component, ViewChild, ViewContainerRef} from "@angular/core";
import {LoadOnDemandListViewEventData, RadListView} from "nativescript-ui-listview";
import {RadListViewComponent} from "nativescript-ui-listview/angular";
import {GalleryParser} from "~/app/gallery/galleryparser";
import {alert} from "@nativescript/core/ui/dialogs";
import {Gallery} from "~/app/gallery/gallery";
import {GalleryModalComponent} from "~/app/gallery/gallery.modal";


@Component({
    templateUrl: "./gallery.component.html",
    styleUrls: ["../styles/common.style.scss", "gallery.component.css"]
})
export class GalleryComponent implements AfterViewInit {
    private readonly _client: ServerClient;
    private _initialized: boolean = false;
    private _modalDialogService: ModalDialogService;
    private _vcRef: ViewContainerRef

    gallery: Gallery;
    radListView: RadListView;
    @ViewChild(RadListViewComponent, {static: false})
    radListViewComponent: RadListViewComponent;


    constructor(client: ServerClient, routerExtensions: RouterExtensions,
                fontIconService: TNSFontIconService, modalDialogService: ModalDialogService,
                vcRef: ViewContainerRef) {
        this._modalDialogService = modalDialogService;
        this._vcRef = vcRef;
        this._client = client;
        this.gallery = Gallery.empty();
    }

    ngAfterViewInit(): void {
        this.radListView = this.radListViewComponent.listView;
    }

    private async initGallery(): Promise<void> {
        try {
            let response = await this._client.getChronologicalGallery();
            this.gallery = GalleryParser.parseGallery(response.content.toJSON());
        } catch (err) {
            console.dir(err);
            await alert("Sorry something gone wrong :( Please try again...")
        }
    }

    async onLoadMoreItemsRequested(event: LoadOnDemandListViewEventData) {
        if (!this._initialized) {
            await this.initGallery();
            this._initialized = true;
            event.returnValue = this.gallery.nextUrl != null;
            this.radListView.notifyLoadOnDemandFinished(this.gallery.nextUrl == null);
        } else if (this.gallery.nextUrl) {
            let response = await this._client.getChronologicalGalleryViaUrl(this.gallery.nextUrl);
            let nextGallery = GalleryParser.parseGallery(response.content.toJSON());
            this.gallery.update(nextGallery);
            event.returnValue = true;
            this.radListView.notifyLoadOnDemandFinished(false);
        } else {
            event.returnValue = false;
            this.radListView.notifyLoadOnDemandFinished(true);
        }
    }

    imageClicked(index: number) {
        this.showModal(index);
    }

    showModal(index: number) {
        let options = {
            context: {
                currentPhotoIndex: index,
                gallery: this.gallery
            },
            fullscreen: false,
            viewContainerRef: this._vcRef
        };
        this._modalDialogService.showModal(GalleryModalComponent, options).then(response => {
            console.log(response);
        });
    }
}
