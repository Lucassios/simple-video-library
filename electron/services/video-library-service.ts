import VideoLibrary, { VideoLibraryInstance, VideoLibraryAttributes } from "../data/models/video-library-model";
import * as Bluebird from "bluebird";
import { CreateOptions, FindOptions } from "sequelize";

export class VideoLibraryService {

    create(videoLibrary: VideoLibraryAttributes, options?: CreateOptions): Bluebird<VideoLibraryInstance> {
        return VideoLibrary.create(videoLibrary, options);
    }

    remove(videoLibrary: VideoLibraryAttributes): Bluebird<void> {
        return VideoLibrary.build(videoLibrary).destroy();
    }

    findAll(options?: FindOptions<VideoLibraryAttributes>): Bluebird<VideoLibraryInstance[]> {
        return VideoLibrary.findAll(options);
    }
      
}

export const videoLibraryService = new VideoLibraryService();