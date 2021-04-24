import {Gallery, GalleryPhoto, GalleryPhotoAtLocation} from "./gallery";
import {PhotoLocation} from "../home/photos";

export class GalleryParser {
    static parseGallery(data: any): Gallery {
        return new Gallery(data.results.map((value) => {
            return new GalleryPhotoAtLocation(
                new PhotoLocation(value.latitude, value.longitude, value.timestamp),
                new GalleryPhoto(value.name, value.image));
        }), data.next);
    }
}
