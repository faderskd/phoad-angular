import {Component, OnInit} from "@angular/core";
import {ModalDialogParams} from "@nativescript/angular";
import {GalleryPhotoAtLocation} from "./gallery";
import {SwipeDirection} from "@nativescript/core/ui/gestures/gestures-common";


@Component({
    selector: "phoad-modal",
    templateUrl: "gallery.modal.html",
    styleUrls: ["../styles/common.style.scss", "gallery.modal.css"]
})
export class GalleryModalComponent implements OnInit {
    currentGalleryImage: GalleryPhotoAtLocation

    constructor(private params: ModalDialogParams) {
    }

    ngOnInit(): void {
        this.currentGalleryImage = this.params.context.gallery.photos[this.params.context.currentPhotoIndex];
    }

    swipeDispatch(event) {
        if (event.direction == SwipeDirection.left) {
            this.currentGalleryImage = this.params.context.gallery.takeNextPhoto(this.currentGalleryImage);
        }
    }

    public close() {
        this.params.closeCallback("modal closed");
    }
}
