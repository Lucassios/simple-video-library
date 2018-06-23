import { ipcMain } from 'electron';
import { VideoInstance } from '../data/models/video-model';
import {ActorAttributes, ActorInstance} from '../data/models/actor';
import { actorService } from '../services/actor-service';

export default function() {

    ipcMain.on('actors:createOrUpdate', async (event, actor: ActorAttributes, video: VideoInstance) => {
        try {
            event.returnValue = await actorService.createOrUpdate(actor, video);
        } catch (ex) {
            console.log(ex);
            event.returnValue = null;
        }
    });

    ipcMain.on('actors:remove', async (event, actor: ActorInstance, video: VideoInstance) => {
        try {
            event.returnValue = await actorService.remove(actor, video);
        } catch (ex) {
            console.log(ex);
            event.returnValue = null;
        }
    });

}
