import {ServerClient} from "~/app/common/http";
import {ModalDialogService, RouterExtensions} from "@nativescript/angular";
import {TNSFontIconService} from "nativescript-ngx-fonticon";
import {AfterViewInit, Component, ViewChild, ViewContainerRef} from "@angular/core";
import {LoadOnDemandListViewEventData, RadListView} from "nativescript-ui-listview";
import {RadListViewComponent} from "nativescript-ui-listview/angular";
import {alert} from "@nativescript/core/ui/dialogs";
import {GalleryModalComponent} from "~/app/gallery/gallery.modal";
import {ScrolledGallery} from "~/app/gallery/gallery";
import {PhotosBatchParser} from "~/app/locatedphotos/photosbatchparser";
import {Authentication} from "~/app/common/authentication";
import {AuthenticationEnsurer} from "~/app/common/responsehandlers";


@Component({
    templateUrl: "./gallery.component.html",
    styleUrls: ["../styles/common.style.scss", "gallery.component.css"]
})
export class GalleryComponent implements AfterViewInit {
    private readonly _client: ServerClient;
    private _initialized: boolean = false;
    private _modalDialogService: ModalDialogService;
    private _vcRef: ViewContainerRef
    private _radListView: RadListView;
    private _authenticationEnsurer: AuthenticationEnsurer;

    gallery: ScrolledGallery;
    @ViewChild(RadListViewComponent, {static: false})
    radListViewComponent: RadListViewComponent;

    constructor(client: ServerClient, routerExtensions: RouterExtensions,
                fontIconService: TNSFontIconService, modalDialogService: ModalDialogService,
                vcRef: ViewContainerRef, authentication: Authentication) {
        this._modalDialogService = modalDialogService;
        this._vcRef = vcRef;
        this._client = client;
        this.gallery = ScrolledGallery.empty();
        this._authenticationEnsurer = new AuthenticationEnsurer(authentication, routerExtensions);
    }

    ngAfterViewInit(): void {
        this._radListView = this.radListViewComponent.listView;
    }

    async imageClicked(index: number) {
        await this.showModal(index);
    }

    async onLoadMoreItemsRequested(event: LoadOnDemandListViewEventData) {
        if (!this._initialized) {
            await this.initComponent(event);
        } else if (this.gallery.nextUrl) {
            await this.loadMorePhotos(event);
        } else {
            this.photosLoadingFinished(event);
        }
    }

    private photosLoadingFinished(event: LoadOnDemandListViewEventData) {
        event.returnValue = false;
        this._radListView.notifyLoadOnDemandFinished(true);
    }

    private async loadMorePhotos(event: LoadOnDemandListViewEventData) {
        let response = await this._client.getChronologicalGalleryViaUrl(this.gallery.nextUrl);
        await this._authenticationEnsurer.ensureAuthenticated(response);
        let nextGallery = ScrolledGallery.fromPhotosBatch(PhotosBatchParser.parse(response.content.toJSON()));
        this.gallery.update(nextGallery);
        event.returnValue = true;
        this._radListView.notifyLoadOnDemandFinished(false);
    }

    private async initComponent(event: LoadOnDemandListViewEventData) {
        await this.initGallery();
        this._initialized = true;
        event.returnValue = this.gallery.nextUrl != null;
        this._radListView.notifyLoadOnDemandFinished(this.gallery.nextUrl == null);
    }

    private async showModal(index: number) {
        let options = {
            context: {
                currentPhotoIndex: index,
                gallery: this.gallery
            },
            fullscreen: false,
            viewContainerRef: this._vcRef
        };
        await this._modalDialogService.showModal(GalleryModalComponent, options);
    }

    private async initGallery(): Promise<void> {
        try {
            let response = await this._client.getChronologicalGallery();
            await this._authenticationEnsurer.ensureAuthenticated(response);
            this.gallery = ScrolledGallery.fromPhotosBatch(PhotosBatchParser.parse(response.content.toJSON()));
        } catch (err) {
            console.dir(err);
            await alert("Sorry something gone wrong :( Please try again...")
        }
    }
}
