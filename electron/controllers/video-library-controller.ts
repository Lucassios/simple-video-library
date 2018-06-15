import { app, ipcMain } from "electron";
import { videoLibraryService } from "../services/video-library-service";

ipcMain.on('videoLibraries:insert', async (event, videoLibrary) => {
    event.returnValue = await videoLibraryService.create(videoLibrary);
});

ipcMain.on('videoLibraries:update', async (event, videoLibrary) => {
    //event.returnValue = await videoLibraryService.update(videoLibrary);
});
  
ipcMain.on('videoLibraries:remove', async (event, videoLibraryId) => {
    event.returnValue = await videoLibraryService.remove(videoLibraryId);
});