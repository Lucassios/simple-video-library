import { ipcMain, EventEmitter } from "electron";
import { videoService } from "../services/video-service";
import { FindOptions } from "sequelize";
import { VideoInstance } from "../data/models/video-model";

export default function() {

    ipcMain.on('videos:find', async (event, options: FindOptions<VideoInstance>) => {
        event.returnValue = await videoService.findAll(options);
    });

}