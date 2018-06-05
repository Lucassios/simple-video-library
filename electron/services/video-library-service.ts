
import VideoLibrary, { VideoLibraryInstance } from "../data/models/video-library-model";
import { Promise } from "sequelize";

export class VideoLibraryService {

    create(videoLibrary): Promise<VideoLibraryInstance> {
        return VideoLibrary.create(videoLibrary);
    }

    update(videoLibrary): Promise<VideoLibraryInstance> {
        return VideoLibrary.update(videoLibrary);
    }

    remove(videoLibrary): Promise<VideoLibraryInstance> {
        return VideoLibrary.remove(videoLibrary);
    }

    findAll(): Promise<VideoLibraryInstance[]> {
        return VideoLibrary.findAll();
    }
      
}

export const videoLibraryService = new VideoLibraryService();