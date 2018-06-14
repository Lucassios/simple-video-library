import * as _ from "lodash";
import test from 'ava';
import { initDB } from '../electron';
import VideoLibrary from "../electron/data/models/video-library-model";
import VideoLibraryPath from "../electron/data/models/video-library-path-model";
import Video from "../electron/data/models/video-model";
import { videoLibraryService } from "../electron/services/video-library-service";
import { videoService } from "../electron/services/video-service";

async function findOrCreateLibraryTest() {

    var videoLibraries = await videoLibraryService.findAll();

    if (videoLibraries.length == 0) {
        console.log('inserting...');
        return videoLibraryService.create({
            name: 'VideoLibraryTest',
            paths: [{ path: 'C:/Users/Lucas_Marques/Videos' }]
        }, {
            include: [{ model: VideoLibraryPath, as: 'paths'}]
        });
    } else {
        return videoLibraries[0];
    }

}

test('createVideo', async t => {

    await initDB();

    var videoLibrary = await findOrCreateLibraryTest();
    console.log(videoLibrary);
    var paths = await videoLibrary.getPaths();

    var videos = videoService.findByPath(paths[0].path);
    await _.map(videos, video => {
        video.libraryId = videoLibrary.id;
        return videoService.create(video);
    });

    t.pass();

});