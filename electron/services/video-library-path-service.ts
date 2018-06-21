import VideoLibraryPath, { VideoLibraryPathInstance, VideoLibraryPathAttributes } from "../data/models/video-library-path-model";
import { FindOptions } from "sequelize";
import * as Bluebird from "bluebird";

export class VideoLibraryPathService {

    create(videoLibraryPath: VideoLibraryPathAttributes): Bluebird<VideoLibraryPathInstance> {
        return VideoLibraryPath.create(videoLibraryPath);
    }

    remove(videoLibraryPath: VideoLibraryPathInstance): Bluebird<number> {
        return VideoLibraryPath.destroy({where: { id: videoLibraryPath.id }});
    }

    findAll(options?: FindOptions<VideoLibraryPathInstance>): Bluebird<VideoLibraryPathInstance[]> {
        return VideoLibraryPath.findAll(options);
    }

}

export const videoLibraryPathService = new VideoLibraryPathService();