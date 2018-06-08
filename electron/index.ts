import VideoLibrary from "./data/models/video-library-model";
import VideoLibraryPath from "./data/models/video-library-path-model";
import Video from "./data/models/video-model";
import { videoLibraryService } from "./services/video-library-service";
import { videoService } from "./services/video-service";

export async function initDB() {
  
  await VideoLibrary.sync();
  console.log('VideoLibrary created');
  await Video.sync();
  console.log('Video created');
  await VideoLibraryPath.sync();
  console.log('VideoLibraryPath created');

  await sleep(2000);
  test().then().catch(err => console.log(err));
  
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function test() {
  
  console.log('testing...');
  var videoLibraries = await videoLibraryService.findAll();
  
  if (videoLibraries.length == 0) {

    var videoLibrary = await videoLibraryService.create({
      name: 'VideoLibraryTest',
      paths: [
        { path: 'C:/Users/Lucas_Marques/Videos' }
      ]
    }, {
      include: [{ model: VideoLibraryPath, as: 'paths'}]
    });

  } else {
    var videoLibrary = videoLibraries[0];
  }
  
  var paths = await videoLibrary.getPaths();
  console.log(videoService.findByPath(paths[0].path));
  
}