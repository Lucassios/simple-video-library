import { ipcMain } from "electron";
import { VideoInstance } from "../data/models/video-model";
import { ActorAttributes } from "../data/models/actor";
import { actorService } from "../services/actor";

export default function() {

    ipcMain.on('actors:createOrUpdate', async (event, actor: ActorAttributes, video: VideoInstance) => {
        try {
            event.returnValue = await actorService.createOrUpdate(actor, video);
        } catch (ex) {
            console.log(ex);
            event.returnValue = null;
        }
    });

}