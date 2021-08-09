import {ObservableArray} from "@nativescript/core";
import {PhotoAtLocation} from "~/app/locatedphotos/photos";
import {PhotosBatch} from "~/app/locatedphotos/batch";

export class ScrolledGallery extends PhotosBatch {
    takeNextPhoto(photo: PhotoAtLocation): PhotoAtLocation {
        if (this.photos.length == 0) {
            return null;
        }
        if (this.photos.length > photo.index + 1) {
            return this.photos[photo.index + 1];
        }
        return this.photos[this.photos.length - 1];
    }

    takePrevPhoto(photo: PhotoAtLocation): PhotoAtLocation {
        if (this.photos.length == 0) {
            return null;
        }
        if (photo.index - 1 >= 0) {
            return this.photos[photo.index - 1];
        }
        return this.photos[0];
    }

    static fromPhotosBatch(photosBatch: PhotosBatch) {
        return new ScrolledGallery(photosBatch.photos, photosBatch.nextUrl);
    }

    static empty() {
        return new ScrolledGallery(new ObservableArray<PhotoAtLocation>([]), null);
    }
}
