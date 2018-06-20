
import VideoLibrary, { VideoLibraryInstance, VideoLibraryAttributes } from "../data/models/video-library-model";
import * as Bluebird from "bluebird";
import { VideoInstance } from "../data/models/video-model";
import { CreateOptions, FindOptions } from "sequelize";
import { videoService } from "./video-service";

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

    async refreshLibrary(library: VideoLibraryInstance): Bluebird<VideoInstance[]> {
        let videosPromises = await videoService.findByLibrary(library);
        return Bluebird.map(videosPromises, async videoPromise => {
            let video = await videoPromise;
            // @ts-ignore
            video.libraryId = library.id;
            await videoService.generateScreenshots(video.completePath);
            return videoService.create(video);
        });
    }
      
}

export const videoLibraryService = new VideoLibraryService();