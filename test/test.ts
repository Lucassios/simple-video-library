import test from 'ava';
import { initDB } from '../electron/data';
import VideoLibraryPath from "../electron/data/models/video-library-path-model";
import { videoLibraryService } from "../electron/services/video-library-service";

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

test('refreshLibrary', async t => {

    await initDB();

    var videoLibrary = await findOrCreateLibraryTest();
    var videos = await videoLibraryService.refreshLibrary(videoLibrary);
    console.log(videos);

    t.pass();

});