import {Location} from "~/app/locatedphotos/location";
import {PhotosBatchParser} from "~/app/locatedphotos/photosbatchparser";
import {alert} from "@nativescript/core/ui/dialogs";
import {MapboxMarker, MapboxView} from "@nativescript-community/ui-mapbox";
import {LatLng} from "@nativescript-community/ui-mapbox/mapbox.common";
import {PhotosBatch} from "~/app/locatedphotos/batch";
import {ServerClient} from "~/app/common/http/httpclient";
import {Configuration} from "~/app/config/Configuration";
import * as _ from "lodash";
import {AuthenticationEnsurer} from "~/app/common/auth/responsehandlers";
import {ModalDialogService} from "@nativescript/angular";
import {ViewContainerRef} from "@angular/core";
import {MarkersCleaner} from "./markerscleaner";
import {LocationAwarePhotosBatch} from "../photos/locationawarephotosbatch";
import {SlidingGallery} from "~/app/gallery/js/gallery";
import {HttpResponse} from "@nativescript/core/http";
import {MarkerModalComponent} from "../markersmodal/marker-modal.component";

export class MapboxManager {
    private readonly _client: ServerClient;
    private readonly _config: Configuration;
    private readonly _mapboxView: MapboxView;
    private readonly _currentMarkersNames: Set<String>;
    private readonly _authenticationEnsurer: AuthenticationEnsurer;
    private readonly _modalDialogService: ModalDialogService;
    private readonly _vcRef: ViewContainerRef;
    private readonly _markersCleaner: MarkersCleaner;

    private _photosBatch: LocationAwarePhotosBatch;

    constructor(client: ServerClient, config: Configuration, mapboxView: MapboxView,
                authenticationEnsurer: AuthenticationEnsurer, modalDialogService: ModalDialogService,
                vcRef: ViewContainerRef) {
        this._client = client;
        this._config = config;
        this._mapboxView = mapboxView;
        this._currentMarkersNames = new Set<String>();
        this._authenticationEnsurer = authenticationEnsurer;
        this._modalDialogService = modalDialogService;
        this._vcRef = vcRef;
        this._markersCleaner = new MarkersCleaner(config);
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
        await this._mapboxView.setOnScrollListener(_.debounce(async (data?: LatLng) => {
            await this.locationChangedListener(data);
        }, this._config.mapLocationChangedDebounce));
    }

    private async locationChangedListener(data?: LatLng) {
        let locationAfterMapMoved = {
            latitude: data.lat,
            longitude: data.lng
        };
        let location = new Location(locationAfterMapMoved.latitude, locationAfterMapMoved.longitude);

        try {
            let response = await this.getPhotosBasedOnLocation(location);
            let photosBatch = PhotosBatchParser.parse(response.content.toJSON());
            this._photosBatch.update(photosBatch);

            await this.addMarkers(photosBatch);
            await this.collectGarbagePhotosIfNeeded(location);
        } catch (err) {
            console.log(err);
            await alert("Sorry something gone wrong while fetching photos:( Please try again...");
        }
    }

    private async setLocatedPhotosOnMap(currentLocation: Location) {
        try {
            let response = await this.getPhotosBasedOnLocation(currentLocation);
            let photosBatch = PhotosBatchParser.parse(response.content.toJSON());
            this._photosBatch = LocationAwarePhotosBatch.fromBasicBatch(photosBatch);
            await this.addMarkers(photosBatch);
        } catch (err) {
            console.log(err);
            await alert("Sorry something gone wrong while fetching photos:( Please try again...");
        }
    }

    private async getPhotosBasedOnLocation(location: Location): Promise<HttpResponse> {
        let response = await this._client.getPhotosBasedOnLocation(location);
        await this._authenticationEnsurer.ensureAuthenticated(response);
        return response;
    }

    private async collectGarbagePhotosIfNeeded(location: Location) {
        if (this._currentMarkersNames.size > this._config.mapMarkersLimit) {
            await this.removeOutermostLocatedPhotos(location);
        }
    }

    private async removeOutermostLocatedPhotos(location: Location) {
        let garbageCollectedBatches = this._markersCleaner.extractSurvivorAndDeleteBatches(location, this._photosBatch);
        this._photosBatch = LocationAwarePhotosBatch.fromBasicBatch(garbageCollectedBatches.survivedBatch);
        let removedMarkersNames = garbageCollectedBatches.deletedBatch.photos.map(locatedPhoto => locatedPhoto.photo.name);
        removedMarkersNames.forEach(id => this._currentMarkersNames.delete(id));
        await this._mapboxView.removeMarkers(removedMarkersNames);
    }

    private async addMarkers(photosBatch: PhotosBatch) {
        let markers = photosBatch.photos
            .filter(value => !this._currentMarkersNames.has(value.photo.name))
            .map(value => {
                return {
                    id: value.photo.name,
                    lat: value.locationWithTime.location.latitude,
                    lng: value.locationWithTime.location.longitude,
                    onTap: async (marker: MapboxMarker) => {
                        await this.markerClickedCallback(marker);
                    }
                }
            });
        markers.forEach(value => this._currentMarkersNames.add(value.id));
        await this._mapboxView.addMarkers(markers);
    }

    private async markerClickedCallback(marker: MapboxMarker) {
        let location = new Location(marker.lat, marker.lng);
        await this.showModal(this._photosBatch.findByLocation(location));
    }

    private async showModal(gallery: SlidingGallery) {
        let options = {
            context: {
                currentPhotoIndex: 0,
                gallery: gallery
            },
            fullscreen: false,
            viewContainerRef: this._vcRef
        };
        await this._modalDialogService.showModal(MarkerModalComponent, options);
    }
}


export class MapboxManagerBuilder {
    private _client: ServerClient;
    private _config: Configuration;
    private _mapboxView: MapboxView;
    private _authenticationEnsurer: AuthenticationEnsurer;
    private _modalDialogService: ModalDialogService;
    private _vcRef: ViewContainerRef;

    withClient(client: ServerClient) {
        this._client = client;
        return this;
    }

    withConfig(config: Configuration) {
        this._config = config;
        return this;
    }

    withMapBoxView(mapboxView: MapboxView) {
        this._mapboxView = mapboxView;
        return this;
    }

    withAuthenticationEnsurer(authenticationEnsurer: AuthenticationEnsurer) {
        this._authenticationEnsurer = authenticationEnsurer;
        return this;
    }

    withModalDialogService(modalDialogService: ModalDialogService) {
        this._modalDialogService = modalDialogService;
        return this;
    }

    withViewContainer(vcRef: ViewContainerRef) {
        this._vcRef = vcRef;
        return this;
    }

    build() {
        return new MapboxManager(this._client, this._config, this._mapboxView, this._authenticationEnsurer,
            this._modalDialogService, this._vcRef);
    }
}
