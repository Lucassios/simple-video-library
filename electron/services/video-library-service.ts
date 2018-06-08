
import VideoLibrary, { VideoLibraryInstance } from "../data/models/video-library-model";
import { Promise } from "sequelize";

export class VideoLibraryService {

    create(videoLibrary, options?): Promise<VideoLibraryInstance> {
        return VideoLibrary.create(videoLibrary, options);
    }

    update(videoLibrary): Promise<VideoLibraryInstance> {
        return VideoLibrary.update(videoLibrary);
    }

    remove(videoLibrary): Promise<VideoLibraryInstance> {
        return VideoLibrary.remove(videoLibrary);
    }

    findAll(options?): Promise<VideoLibraryInstance[]> {
        return VideoLibrary.findAll(options);
    }
      
}

export const videoLibraryService = new VideoLibraryService();