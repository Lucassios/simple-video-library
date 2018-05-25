
import VideoLibrary from "../data/model/video-library-model";
import { Promise } from "sequelize";

export class VideoLibraryService {

    create(videoLibrary): Promise<VideoLibrary> {
        return VideoLibrary.create(videoLibrary);
    }
      
}

export const videoLibraryService = new VideoLibraryService();