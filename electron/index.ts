import * as _ from "lodash";
import VideoLibrary from "./data/models/video-library-model";
import VideoLibraryPath from "./data/models/video-library-path-model";
import Video from "./data/models/video-model";
import { videoLibraryService } from "./services/video-library-service";
import { videoService } from "./services/video-service";

export async function initDB() {
  
  await VideoLibrary.sync();
  await Video.sync();
  await VideoLibraryPath.sync();
  
}