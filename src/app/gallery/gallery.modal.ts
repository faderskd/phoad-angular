import {Component} from "@angular/core";
import {ModalDialogParams} from "@nativescript/angular";
import {Gallery, GalleryPhotoAtLocation} from "./gallery";


@Component({
    selector: "phoad-modal",
    templateUrl: "gallery.modal.html",
    styleUrls: ["../styles/common.style.scss", "gallery.modal.css"]
})
export class GalleryModalComponent {
    currentGalleryImage: GalleryPhotoAtLocation
    private _gallery: Gallery
    private _galleryStartIndex: number

    constructor(private modalDialogParams: ModalDialogParams) {
        // this.currentGalleryImage = this.gallery.photos.getItem(galleryStartIndex);
    }

    // public close(response: String) {
    //     this.params.closeCallback(response);
    // }
}
