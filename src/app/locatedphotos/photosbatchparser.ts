import {Location} from "./location";
import {PhotosBatch} from "./batch";
import {Photo, PhotoAtLocation} from "./photos";

export class PhotosBatchParser {
    static parse(data: any): PhotosBatch {
        let index = 0;
        return new PhotosBatch(data.results.map((value) => {
            return new PhotoAtLocation(
                new Location(value.latitude, value.longitude, value.timestamp),
                new Photo(value.name, value.image), index++);
        }), data.next);
    }
}
