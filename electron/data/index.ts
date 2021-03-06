import VideoLibrary from "./models/video-library-model";
import VideoLibraryPath from "./models/video-library-path-model";
import Video from "./models/video-model";
import Actor, { VideoActors } from "./models/actor-model";
import Option from "./models/option-model";
import Tag, { VideoTags } from "./models/tag-model";
import Producer, { VideoProducers } from "./models/producer-model";

export async function initDB() {
  
    await VideoLibrary.sync();
    await Video.sync();
    await VideoLibraryPath.sync();
    await Actor.sync();
    await VideoActors.sync();
    await Option.sync();
    await Tag.sync();
    await VideoTags.sync();
    await Producer.sync();
    await VideoProducers.sync();
  
}