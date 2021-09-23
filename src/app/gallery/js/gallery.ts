import {ObservableArray} from "@nativescript/core";
import {PhotoAtLocation} from "../../locatedphotos/photos";
import {PhotosBatch} from "../../locatedphotos/batch";

export class SlidingGallery extends PhotosBatch {
    takeNextPhoto(photo: PhotoAtLocation): PhotoAtLocation {
        if (this.photos.length == 0) {
            return null;
        }
        if (this.photos.length > photo.index + 1) {
            return this.photos.getItem(photo.index + 1);
        }
        return this.photos.getItem(this.photos.length - 1);
    }

    takePrevPhoto(photo: PhotoAtLocation): PhotoAtLocation {
        if (this.photos.length == 0) {
            return null;
        }
        if (photo.index - 1 >= 0) {
            return this.photos.getItem(photo.index - 1);
        }
        return this.photos.getItem(0);
    }

    static fromPhotosBatch(photosBatch: PhotosBatch) {
        return new SlidingGallery(photosBatch.photos, photosBatch.nextUrl);
    }

    static empty() {
        return new SlidingGallery(new ObservableArray<PhotoAtLocation>([]), null);
    }
}
