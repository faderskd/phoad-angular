import {ServerClient} from "../../common/http/httpclient";
import {ModalDialogService, RouterExtensions} from "@nativescript/angular";
import {TNSFontIconService} from "nativescript-ngx-fonticon";
import {AfterViewInit, Component, ViewChild, ViewContainerRef} from "@angular/core";
import {LoadOnDemandListViewEventData, RadListView} from "nativescript-ui-listview";
import {RadListViewComponent} from "nativescript-ui-listview/angular";
import {alert} from "@nativescript/core/ui/dialogs";
import {GalleryModalComponent} from "./gallery.modal";
import {SlidingGallery} from "./gallery";
import {PhotosBatchParser} from "../../locatedphotos/photosbatchparser";
import {Authentication} from "../../common/auth/authentication";
import {AuthenticationEnsurer} from "../../common/auth/responsehandlers";


@Component({
    templateUrl: "../templates/gallery.component.html",
    styleUrls: ["../../styles/common.style.scss", "../templates/gallery.component.css"]
})
export class GalleryComponent implements AfterViewInit {
    private readonly _client: ServerClient;
    private readonly _modalDialogService: ModalDialogService;
    private readonly _vcRef: ViewContainerRef;

    private _initialized: boolean = false;
    private _radListView: RadListView;
    private _authenticationEnsurer: AuthenticationEnsurer;

    @ViewChild(RadListViewComponent, {static: false})
    private radListViewComponent: RadListViewComponent;

    gallery: SlidingGallery;

    constructor(client: ServerClient, routerExtensions: RouterExtensions,
                fontIconService: TNSFontIconService, modalDialogService: ModalDialogService,
                vcRef: ViewContainerRef, authentication: Authentication) {
        this._modalDialogService = modalDialogService;
        this._vcRef = vcRef;
        this._client = client;
        this.gallery = SlidingGallery.empty();
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
            this.stopLoadingMorePhotos(event);
        }
    }

    private async initComponent(event: LoadOnDemandListViewEventData) {
        await this.initGallery();
        this._initialized = true;
        let loadMoreItemsEnabled = this.gallery.nextUrl != null;
        event.returnValue = loadMoreItemsEnabled;
        this._radListView.notifyLoadOnDemandFinished(!loadMoreItemsEnabled);
    }

    private async initGallery(): Promise<void> {
        try {
            let response = await this._client.getChronologicalGallery();
            await this._authenticationEnsurer.ensureAuthenticated(response);
            this.gallery = SlidingGallery.fromPhotosBatch(PhotosBatchParser.parse(response.content.toJSON()));
        } catch (err) {
            console.dir(err);
            await alert("Sorry something gone wrong :( Please try again...")
        }
    }

    private async loadMorePhotos(event: LoadOnDemandListViewEventData) {
        let response = await this._client.getChronologicalGalleryViaUrl(this.gallery.nextUrl);
        await this._authenticationEnsurer.ensureAuthenticated(response);
        let nextGallery = SlidingGallery.fromPhotosBatch(PhotosBatchParser.parse(response.content.toJSON()));
        this.gallery.update(nextGallery);
        this.continueLoadingPhotos(event);
    }

    private stopLoadingMorePhotos(event: LoadOnDemandListViewEventData) {
        event.returnValue = false;
        this._radListView.notifyLoadOnDemandFinished(true);
    }

    private continueLoadingPhotos(event: LoadOnDemandListViewEventData) {
        event.returnValue = true;
        this._radListView.notifyLoadOnDemandFinished(false);
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
}
