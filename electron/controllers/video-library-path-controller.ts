import { ipcMain } from "electron";
import { VideoLibraryPathAttributes, VideoLibraryPathInstance } from "../data/models/video-library-path-model";
import { videoLibraryPathService } from "../services/video-library-path-service";

export default function() {

    ipcMain.on('videoLibraryPaths:insert', async (event, videoLibraryPath: VideoLibraryPathAttributes) => {
        try {
            event.returnValue = await videoLibraryPathService.create(videoLibraryPath);
        } catch (ex) {
            event.returnValue = null;
        }
    });

    ipcMain.on('videoLibraryPaths:remove', async (event, videoLibraryPath: VideoLibraryPathInstance) => {
        event.returnValue = await videoLibraryPathService.remove(videoLibraryPath);
    });

}