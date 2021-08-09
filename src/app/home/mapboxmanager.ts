import {Location} from "../locatedphotos/location";
import {PhotosBatchParser} from "../locatedphotos/photosbatchparser";
import {alert} from "@nativescript/core/ui/dialogs";
import {MapboxView} from "@nativescript-community/ui-mapbox";
import {LatLng} from "@nativescript-community/ui-mapbox/mapbox.common";
import {PhotoAtLocation} from "../locatedphotos/photos";
import {PhotosBatch} from "../locatedphotos/batch";
import {ObservableArray} from "@nativescript/core";
import {ServerClient} from "../common/http";
import {Configuration} from "~/app/config/Configuration";

export class MapboxManager {
    private readonly _client: ServerClient;
    private _photosBatch: PhotosBatch;
    private _config: Configuration;
    private _mapboxView: MapboxView;
    private _currentMarkersNames: Set<String>;

    constructor(client: ServerClient, config: Configuration, mapboxView: MapboxView) {
        this._client = client;
        this._config = config;
        this._mapboxView = mapboxView;
        this._currentMarkersNames = new Set<String>();
    }

    async initMapbox(currentLocation: Location) {
        await this._mapboxView.setCenter({
            lat: currentLocation.latitude,
            lng: currentLocation.longitude,
            animated: true
        });
        await this.addMapMovedListener();
        await this.setLocatedPhotosOnMap(currentLocation);
    }

    private async addMapMovedListener() {
        await this._mapboxView.setOnMoveBeginListener(async (data?: LatLng) => {
            let locationAfterMapMoved = {
                latitude: data.lat,
                longitude: data.lng
            };
            try {
                let response = await this._client.getPhotosBasedOnLocation(locationAfterMapMoved);
                let photosBatch = PhotosBatchParser.parse(response.content.toJSON());
                this._photosBatch.update(photosBatch);
                await this.addMarkers(photosBatch);
                await this.collectGarbagePhotosIfNeeded(
                    new Location(locationAfterMapMoved.latitude,
                        locationAfterMapMoved.longitude,
                        new Date().toISOString()));
            } catch (err) {
                console.log(err);
                await alert("Sorry something gone wrong while fetching photos:( Please try again...");
            }
        });
    }

    async setLocatedPhotosOnMap(currentLocation: Location) {
        try {
            let response = await this._client.getPhotosBasedOnLocation(currentLocation);
            let photosBatch = PhotosBatchParser.parse(response.content.toJSON());
            this._photosBatch = photosBatch;
            await this.addMarkers(photosBatch);
        } catch (err) {
            console.log(err);
            await alert("Sorry something gone wrong while fetching photos:( Please try again...");
        }
    }

    private async collectGarbagePhotosIfNeeded(location: Location) {
        if (this._currentMarkersNames.size > this._config.mapMarkersLimit) {
            await this.removeOutermostLocatedPhotos(location);
        }
    }

    private async removeOutermostLocatedPhotos(location: Location) {
        let garbageCollectedBatches = this.extractSurvivorAndDeleteBatches(location);
        this._photosBatch = garbageCollectedBatches.survivedBatch;
        let removedMarkersNames = garbageCollectedBatches.deleteBatch.photos.map(locatedPhoto => locatedPhoto.photo.name);
        removedMarkersNames.forEach(id => this._currentMarkersNames.delete(id));
        await this._mapboxView.removeMarkers(removedMarkersNames);
    }

    private extractSurvivorAndDeleteBatches(location: Location): GarbageCollectedBatches {
        let photosWithDistance = this.photosSortedByDistance(location);
        let deletedPhotos = photosWithDistance.splice(this._config.mapMarkersLimit)
            .map((photoWithDistance, index) =>
                new PhotoAtLocation(
                    photoWithDistance.photoAtLocation.location,
                    photoWithDistance.photoAtLocation.photo,
                    index));
        let survivedPhotos = photosWithDistance.map((photoWithDistance, index) =>
            new PhotoAtLocation(
                photoWithDistance.photoAtLocation.location,
                photoWithDistance.photoAtLocation.photo,
                index));

        return new GarbageCollectedBatches(
            new PhotosBatch(new ObservableArray<PhotoAtLocation>(survivedPhotos), null),
            new PhotosBatch(new ObservableArray<PhotoAtLocation>(deletedPhotos), null));
    }

    private photosSortedByDistance(location: Location) {
        return this._photosBatch.photos.map(locatedPhoto => {
            let longDiff = locatedPhoto.location.longitude - location.longitude;
            let latDiff = locatedPhoto.location.latitude - location.latitude;
            let distance = Math.sqrt(Math.pow(longDiff, 2) + Math.pow(latDiff, 2));
            return new LocatedPhotoWithDistance(distance, locatedPhoto);
        })
            .sort(((a: LocatedPhotoWithDistance, b: LocatedPhotoWithDistance) => a.distance - b.distance));
    }

    private async addMarkers(photosBatch: PhotosBatch) {
        let markers = photosBatch.photos
            .filter(value => !this._currentMarkersNames.has(value.photo.name))
            .map(value => {
                return {
                    id: value.photo.name,
                    lat: value.location.latitude,
                    lng: value.location.longitude,
                    title: value.photo.name
                }
            });
        markers.forEach(value => this._currentMarkersNames.add(value.id));
        await this._mapboxView.addMarkers(markers);
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
    private readonly _deleteBatch;

    constructor(survivedBatch: PhotosBatch, deletedBatch: PhotosBatch) {
        this._survivedBatch = survivedBatch;
        this._deleteBatch = deletedBatch;
    }

    get survivedBatch(): PhotosBatch {
        return this._survivedBatch;
    }

    get deleteBatch(): PhotosBatch {
        return this._deleteBatch;
    }
}
