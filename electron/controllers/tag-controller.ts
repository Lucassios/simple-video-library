import { ipcMain } from 'electron';
import { VideoInstance } from '../data/models/video-model';
import { TagAttributes, TagInstance } from '../data/models/tag-model';
import { tagService } from '../services/tag-service';
import { FindOptions } from 'sequelize';

export default function() {

    ipcMain.on('tags:findAll', async (event, options: FindOptions<TagInstance>) => {
        event.returnValue = await tagService.findAll(options);
    });

    ipcMain.on('tags:findAllAndCountVideos', async (event) => {
        event.returnValue = await tagService.findAllAndCountVideos();
    });

    ipcMain.on('tags:createOrUpdate', async (event, tag: TagAttributes, video: VideoInstance) => {
        try {
            event.returnValue = await tagService.createOrUpdate(tag, video);
        } catch (ex) {
            console.log(ex);
            event.returnValue = null;
        }
    });

    ipcMain.on('tags:remove', async (event, tag: TagInstance, video: VideoInstance) => {
        try {
            event.returnValue = await tagService.remove(tag, video);
        } catch (ex) {
            console.log(ex);
            event.returnValue = null;
        }
    });

}
