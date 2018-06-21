import { ipcMain } from "electron";
import { videoLibraryService } from "../services/video-library-service";
import { VideoLibraryInstance } from "../data/models/video-library-model";
import { videoService } from "../services/video-service";

export default function() {

    ipcMain.on('videoLibraries:refreshLibrary', async (event, videoLibrary: VideoLibraryInstance) => {

        try {
            let videos = await videoService.findByLibrary(videoLibrary);
            for (let video of videos) {
                video = await videoService.getMetadata(video);
                video.cover = await videoService.generateScreenshot(video.completePath);
                await videoService.create(video);
                event.sender.send('videoLibraries:refreshLibrary:next', video);
            }
        } catch (ex) {
            console.log(ex);
            event.sender.send('videoLibraries:refreshLibrary:end');
        }

        event.sender.send('videoLibraries:refreshLibrary:end');

    });

    ipcMain.on('videoLibraries:insert', async (event, videoLibrary) => {
        event.returnValue = await videoLibraryService.create(videoLibrary);
    });
    
    ipcMain.on('videoLibraries:update', async (event, videoLibrary) => {
        //event.returnValue = await videoLibraryService.update(videoLibrary);
    });
      
    ipcMain.on('videoLibraries:remove', async (event, videoLibraryId) => {
        event.returnValue = await videoLibraryService.remove(videoLibraryId);
    });

}