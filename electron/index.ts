import VideoLibrary from "./data/models/video-library-model";
import VideoLibraryPath from "./data/models/video-library-path-model";
import Video from "./data/models/video-model";
import { videoLibraryService } from "./services/video-library-service";
import { videoService } from "./services/video-service";

export async function initDB() {
  
  await VideoLibrary.sync();
  await Video.sync();
  await VideoLibraryPath.sync();

  test().then().catch(err => console.log(err));
  
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
  var videos = videoService.findByPath(paths[0].path);
  videoService.bulkCreate(videos);
  
}