import { ipcMain } from 'electron';
import { videoLibraryService } from '../services/video-library-service';
import { VideoLibraryInstance, VideoLibraryAttributes } from '../data/models/video-library-model';
import { FindOptions } from 'sequelize';
import * as log from 'electron-log';

export default function() {

    ipcMain.on('videoLibraries:refreshLibraries', async (event, videoLibrary: VideoLibraryInstance) => {

        console.log('videoLibraries:refreshLibraries...');
        videoLibraryService.refreshLibraries((error, video, percentage) => {
            if (error) {
                log.error(error);
            } else {
                event.sender.send('videoLibraries:refreshLibrary:next', video, percentage);
            }
        })
        .then(() => event.sender.send('videoLibraries:refreshLibrary:end'));

    });

    ipcMain.on('videoLibraries:insert', async (event, videoLibrary: VideoLibraryAttributes) => {
        event.returnValue = await videoLibraryService.create(videoLibrary);
    });

    ipcMain.on('videoLibraries:update', async (event, videoLibrary: VideoLibraryInstance) => {
        event.returnValue = await videoLibraryService.update(videoLibrary);
    });

    ipcMain.on('videoLibraries:findAll', async (event, options?: FindOptions<VideoLibraryInstance>) => {
        event.returnValue = await videoLibraryService.findAll(options);
    });

    ipcMain.on('videoLibraries:remove', async (event, videoLibraryId) => {
        event.returnValue = await videoLibraryService.remove(videoLibraryId);
    });

}
