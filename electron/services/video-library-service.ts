
import VideoLibrary, { VideoLibraryInstance } from "../data/model/video-library-model";
import { Promise } from "sequelize";

export class VideoLibraryService {

    create(videoLibrary): Promise<VideoLibraryInstance> {
        return VideoLibrary.create(videoLibrary);
    }

    findAll(): Promise<VideoLibraryInstance[]> {
        return VideoLibrary.findAll();
    }
      
}

export const videoLibraryService = new VideoLibraryService();