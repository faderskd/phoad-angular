import {Location} from "~/app/locatedphotos/location";
import {PhotoAtLocation} from "~/app/locatedphotos/photos";
import {PhotosBatch} from "~/app/locatedphotos/batch";
import {ObservableArray} from "@nativescript/core";
import {Configuration} from "~/app/config/Configuration";

export class MarkersCleaner {
    private readonly _config: Configuration;

    constructor(config: Configuration) {
        this._config = config;
    }

    extractSurvivorAndDeleteBatches(location: Location, photosBatch: PhotosBatch): GarbageCollectedBatches {
        let photosWithDistance = this.photosSortedByDistanceFromLocation(location, photosBatch);
        let deletedPhotos = photosWithDistance.splice(this._config.mapMarkersLimit)
            .map((photoWithDistance, index) =>
                new PhotoAtLocation(
                    photoWithDistance.photoAtLocation.locationWithTime,
                    photoWithDistance.photoAtLocation.photo,
                    index));
        let survivedPhotos = photosWithDistance.map((photoWithDistance, index) =>
            new PhotoAtLocation(
                photoWithDistance.photoAtLocation.locationWithTime,
                photoWithDistance.photoAtLocation.photo,
                index));

        return new GarbageCollectedBatches(
            new PhotosBatch(new ObservableArray<PhotoAtLocation>(survivedPhotos), null),
            new PhotosBatch(new ObservableArray<PhotoAtLocation>(deletedPhotos), null));
    }

    private photosSortedByDistanceFromLocation(location: Location, photosBatch: PhotosBatch) {
        return photosBatch.photos.map(locatedPhoto => {
            let longDiff = locatedPhoto.locationWithTime.location.longitude - location.longitude;
            let latDiff = locatedPhoto.locationWithTime.location.latitude - location.latitude;
            let distance = Math.sqrt(Math.pow(longDiff, 2) + Math.pow(latDiff, 2));
            return new LocatedPhotoWithDistance(distance, locatedPhoto);
        })
            .sort(((a: LocatedPhotoWithDistance, b: LocatedPhotoWithDistance) => a.distance - b.distance));
    }
}


class LocatedPhotoWithDistance {
    private readonly _distance: number;
    private readonly _photoAtLocation: PhotoAtLocation;

    constructor(distance: number, photoAtLocation: PhotoAtLocation) {
        this._distance = distance;
        this._photoAtLocation = photoAtLocation;
    }

    get photoAtLocation(): PhotoAtLocation {
        return this._photoAtLocation;
    }

    get distance(): number {
        return this._distance;
    }
}

class GarbageCollectedBatches {
    private readonly _survivedBatch;
    private readonly _deletedBatch;

    constructor(survivedBatch: PhotosBatch, deletedBatch: PhotosBatch) {
        this._survivedBatch = survivedBatch;
        this._deletedBatch = deletedBatch;
    }

    get survivedBatch(): PhotosBatch {
        return this._survivedBatch;
    }

    get deletedBatch(): PhotosBatch {
        return this._deletedBatch;
    }
}
