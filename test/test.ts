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
    // @ts-ignore
    var paths = await videoLibrary.getPaths();

    var videos = await Promise.all(videoService.findByPath(paths[0].path));
    await Promise.all(_.map(videos, async video => {
        // @ts-ignore
        video.libraryId = videoLibrary.id;
        await videoService.generateScreenshots(video.completePath);
        return videoService.create(video);
    }));

    t.pass();

});