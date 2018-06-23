import VideoLibrary, { VideoLibraryInstance, VideoLibraryAttributes } from '../data/models/video-library-model';
import * as Bluebird from 'bluebird';
import { CreateOptions, FindOptions } from 'sequelize';
import VideoLibraryPath from '../data/models/video-library-path-model';

export class VideoLibraryService {

    create(videoLibrary: VideoLibraryAttributes, options?: CreateOptions): Bluebird<VideoLibraryInstance> {
        return VideoLibrary.create(videoLibrary, options);
    }

    update(videoLibrary: VideoLibraryInstance) {
        return videoLibrary.update(videoLibrary);
    }

    remove(videoLibrary: VideoLibraryInstance): Bluebird<number> {
        return VideoLibrary.destroy({where: { id: videoLibrary.id }});
    }

    findAll(options?: FindOptions<VideoLibraryAttributes>): Bluebird<VideoLibraryInstance[]> {
        if (options === undefined) {
            options = {};
        }
        options.include = [{ model: VideoLibraryPath, as: 'paths'}];
        return VideoLibrary.findAll(options && { include: [{ model: VideoLibraryPath, as: 'paths'}] });
    }

}

export const videoLibraryService = new VideoLibraryService();
