import {Location, LocationWithTime} from "./location";
import {PhotosBatch} from "./batch";
import {Photo, PhotoAtLocation} from "./photos";

export class PhotosBatchParser {
    static parse(data: any): PhotosBatch {
        let index = 0;
        return new PhotosBatch(data.results.map((value) => {
            let location = new Location(value.latitude, value.longitude);
            return new PhotoAtLocation(
                new LocationWithTime(location, value.timestamp),
                new Photo(value.name, value.image), index++);
        }), data.next);
    }
}
