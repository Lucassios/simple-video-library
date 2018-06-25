import { ipcMain, shell } from 'electron';
import { videoService } from '../services/video-service';
import { FindOptions } from 'sequelize';
import { VideoInstance } from '../data/models/video-model';
import Filter from '../data/models/filter-model';

export default function() {

    ipcMain.on('videos:find', async (event, options: FindOptions<VideoInstance>) => {
        event.returnValue = await videoService.findAll(options);
    });

    ipcMain.on('videos:findByFilter', async (event, filter: Filter) => {
        event.returnValue = await videoService.findByFilter(filter);
    });

    ipcMain.on('videos:findByIdFetch', async (event, id: number) => {
        event.returnValue = await videoService.findByIdFetch(id);
    });

    ipcMain.on('videos:update', async (event, video: VideoInstance) => {
        try {
            event.returnValue = await videoService.update(video);
        } catch (ex) {
            console.log(ex);
            event.returnValue = null;
        }
    });

    ipcMain.on('videos:open', (event, video: VideoInstance) => {
        shell.openItem(video.completePath);
    });

}
