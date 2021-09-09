import {AfterViewInit, Component, ElementRef, ViewChild} from "@angular/core";
import {ModalDialogParams} from "@nativescript/angular";
import {SwipeDirection} from "@nativescript/core/ui/gestures/gestures-common";
import {Animation, ContentView, Image} from "@nativescript/core";
import {Screen} from "@nativescript/core/platform";
import {AnimationDefinition} from "@nativescript/core/ui/animation/animation-interfaces";
import {PhotoAtLocation} from "~/app/locatedphotos/photos";

@Component({
    selector: "phoad-modal",
    templateUrl: "gallery.modal.html"
})
export class GalleryModalComponent implements AfterViewInit {
    currentGalleryImage: PhotoAtLocation

    private currentModalContent: number = 1
    private readonly screenWidth: number
    @ViewChild('galleryModalContent1', {static: false}) contentElement1: ElementRef;
    @ViewChild('galleryModalContent2', {static: false}) contentElement2: ElementRef;
    @ViewChild('galleryModalImage1', {static: false}) contentImageElement1: ElementRef;
    @ViewChild('galleryModalImage2', {static: false}) contentImageElement2: ElementRef;
    private modalContent1: ModalContent
    private modalContent2: ModalContent

    constructor(private params: ModalDialogParams) {
        this.currentGalleryImage = params.context.gallery.photos.getItem(params.context.currentPhotoIndex);
        this.screenWidth = Screen.mainScreen.widthDIPs;
    }

    ngAfterViewInit(): void {
        this.modalContent1 = new ModalContent(this.contentElement1.nativeElement, this.contentImageElement1.nativeElement);
        this.modalContent2 = new ModalContent(this.contentElement2.nativeElement, this.contentImageElement2.nativeElement);
        this.modalContent1.image.src = this.currentGalleryImage.photo.imageUrl;
    }

    swipeDispatch(event) {
        let currentModal: ModalContent;
        let nextModal: ModalContent;

        let newImage = this.getNewImage(event.direction);
        if (this.currentGalleryImage.index == newImage.index) {
            return;
        }

        if (this.currentModalContent == 1) {
            currentModal = this.modalContent1;
            nextModal = this.modalContent2;
            this.currentModalContent = 2;
        } else {
            currentModal = this.modalContent2;
            nextModal = this.modalContent1;
            this.currentModalContent = 1;
        }
        this.animate(currentModal, nextModal, event.direction);
    }

    private animate(currentModal: ModalContent, nextModal: ModalContent, direction: SwipeDirection) {
        this.currentGalleryImage = this.getNewImage(direction);
        nextModal.image.src = this.currentGalleryImage.photo.imageUrl;

        if (direction == SwipeDirection.left) {
            nextModal.contentView.translateX = this.screenWidth;
        } else if (direction == SwipeDirection.right) {
            nextModal.contentView.translateX = -this.screenWidth;
        }

        this.buildAndPlayAnimation(currentModal, direction, nextModal);
    }

    private buildAndPlayAnimation(currentModal: ModalContent, direction: SwipeDirection, nextModal: ModalContent) {
        let definitions = new Array<AnimationDefinition>();
        definitions.push({
            target: currentModal.contentView,
            translate: {x: direction == SwipeDirection.left ? -this.screenWidth : this.screenWidth, y: 0},
            duration: 500
        })
        definitions.push({
            target: nextModal.contentView,
            translate: {x: 0, y: 0},
            duration: 500
        });
        let animationSet = new Animation(definitions);
        animationSet.play()
            .catch(e => {
                console.error(e.toString())
            });
    }

    private getNewImage(direction: SwipeDirection) {
        if (direction == SwipeDirection.left) {
            return this.params.context.gallery.takeNextPhoto(this.currentGalleryImage);
        } else if (direction == SwipeDirection.right) {
            return this.params.context.gallery.takePrevPhoto(this.currentGalleryImage);
        } else {
            return this.currentGalleryImage;
        }
    }
}

class ModalContent {
    constructor(private _contentView: ContentView, private _image: Image) {
    }

    get contentView(): ContentView {
        return this._contentView;
    }

    get image(): Image {
        return this._image;
    }
}
