import { VideoLibraryPath } from './video-library-path';

export class VideoLibrary {

    id: number;
    name: string;
    paths: VideoLibraryPath[];
    videosCount?: number;

}
