import VideoLibraryPath, { VideoLibraryPathInstance } from "../data/models/video-library-path-model";
import { FindOptions } from "sequelize";
import * as Bluebird from "bluebird";

export class VideoLibraryPathService {

    findAll(options?: FindOptions<VideoLibraryPathInstance>): Bluebird<VideoLibraryPathInstance[]> {
        return VideoLibraryPath.findAll(options);
    }

}

export const videoLibraryPathService = new VideoLibraryPathService();