import {PhotosBatch} from "../locatedphotos/batch";
import {Location} from "../locatedphotos/location";
import {SlidingGallery} from "../gallery/gallery";
import {ObservableArray} from "@nativescript/core";
import {PhotoAtLocation} from "../locatedphotos/photos";

export class LocationAwarePhotosBatch extends PhotosBatch {
    findByLocation(location: Location): SlidingGallery {
        let photosAtGivenLocation = this.photos.filter(value => {
            return value.location.latitude == location.latitude &&
                value.location.longitude == location.longitude;
        });
        return new SlidingGallery(new ObservableArray<PhotoAtLocation>(photosAtGivenLocation), null);
    }

    static fromBasicBatch(photosBatch: PhotosBatch) {
        return new LocationAwarePhotosBatch(photosBatch.photos, photosBatch.nextUrl);
    }
}
