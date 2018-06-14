
import VideoLibrary, { VideoLibraryInstance } from "../data/models/video-library-model";
import * as Promise from "bluebird";
import { VideoAttributes } from "../data/models/video-model";
import { CreateOptions, FindOptions } from "sequelize";

export class VideoLibraryService {

    create(videoLibrary: VideoAttributes, options?: CreateOptions): Promise<VideoLibraryInstance> {
        return VideoLibrary.create(videoLibrary, options);
    }

    remove(videoLibrary: VideoAttributes): Promise<void> {
        return VideoLibrary.build(videoLibrary).destroy();
    }

    findAll(options?: FindOptions<VideoAttributes>): Promise<VideoLibraryInstance[]> {
        return VideoLibrary.findAll(options);
    }
      
}

export const videoLibraryService = new VideoLibraryService();