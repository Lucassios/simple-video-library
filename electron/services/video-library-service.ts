import VideoLibrary, { VideoLibraryInstance, VideoLibraryAttributes } from '../data/models/video-library-model';
import * as Bluebird from 'bluebird';
import { CreateOptions, FindOptions } from 'sequelize';
import VideoLibraryPath from '../data/models/video-library-path-model';
import { videoService } from './video-service';

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

    async refreshLibraries(callback: (error, video, percentage) => void) {

        const libraries = await this.findAll();
        for (let library of libraries) {
            try {
                await this.refreshLibrary(library, callback);
            } catch (ex) {
                callback(ex, null, null);
            }
        }

    }

    async refreshLibrary(library: VideoLibraryInstance, callback: (error, video, percentage) => void): Promise<void> {

        const videos = await videoService.findNewFilesByLibrary(library);
        console.log('videos: ' + videos.length);

        for (let i = 0; i < videos.length; i++) {
            try {
                let video = videos[i];
                video = await videoService.getMetadata(video);
                video.cover = await videoService.generateScreenshot(video.completePath);
                await videoService.create(video);
                const percentage = (i + 1) * 100 / videos.length;
                callback(null, video, percentage);
            } catch (ex) {
                callback(ex, null, null);
            }
        }


    }

}

export const videoLibraryService = new VideoLibraryService();
