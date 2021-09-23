import {PhotosBatch} from "~/app/locatedphotos/batch";
import {Location} from "~/app/locatedphotos/location";
import {SlidingGallery} from "~/app/gallery/js/gallery";
import {ObservableArray} from "@nativescript/core";
import {PhotoAtLocation} from "~/app/locatedphotos/photos";

export class LocationAwarePhotosBatch extends PhotosBatch {
    findByLocation(location: Location): SlidingGallery {
        let photosAtGivenLocation = this.photos.filter(value => {
            return value.locationWithTime.location.latitude == location.latitude &&
                value.locationWithTime.location.longitude == location.longitude;
        });
        return new SlidingGallery(new ObservableArray<PhotoAtLocation>(photosAtGivenLocation), null);
    }

    static fromBasicBatch(photosBatch: PhotosBatch) {
        return new LocationAwarePhotosBatch(photosBatch.photos, photosBatch.nextUrl);
    }
}
