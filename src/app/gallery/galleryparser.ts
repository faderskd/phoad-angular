import {Gallery, GalleryPhoto, GalleryPhotoAtLocation} from "./gallery";
import {Location} from "../home/photos";

export class GalleryParser {
    static parseGallery(data: any): Gallery {
        let index = 0;
        return new Gallery(data.results.map((value) => {
            return new GalleryPhotoAtLocation(
                new Location(value.latitude, value.longitude, value.timestamp),
                new GalleryPhoto(value.name, value.image),
                index++);
        }), data.next);
    }
}
