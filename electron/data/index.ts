import VideoLibrary from "./models/video-library-model";
import VideoLibraryPath from "./models/video-library-path-model";
import Video from "./models/video-model";
import { videoLibraryService } from "../services/video-library-service";
import Actor, { VideoActors } from "./models/actor";

export async function initDB() {
  
  await VideoLibrary.sync();
  await Video.sync();
  await VideoLibraryPath.sync();
  await Actor.sync();
  await VideoActors.sync();

  await initLibraryTest(); // TODO: remove when the settings page is ready
  
}

async function initLibraryTest() {
    
  var videoLibraries = await videoLibraryService.findAll();

  if (videoLibraries.length == 0) {
      videoLibraryService.create({
          name: 'VideoLibraryTest',
          paths: [{ path: 'C:/Users/Lucas_Marques/Videos' }]
      }, {
          include: [{ model: VideoLibraryPath, as: 'paths'}]
      });
  }

}