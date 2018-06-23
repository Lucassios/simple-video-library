import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { VideoLibrary } from '../models/video-library';
import { VideoLibraryPath } from '../models/video-library-path';
import { ElectronService } from '../providers/electron.service';

@Injectable({
    providedIn: 'root'
})
export class VideoLibraryPathService {

    constructor(public electronService: ElectronService) { }

    create(videoLibraryPath: VideoLibraryPath): VideoLibraryPath {
        return this.electronService.ipcRenderer.sendSync('videoLibraryPaths:insert', videoLibraryPath);
    }

    createAll(paths: string[], videoLibrary: VideoLibrary): VideoLibraryPath[] {
        const videoLibraryPaths = _.map(paths, path => this.create({ path, videoLibraryId: videoLibrary.id }) );
        return _.compact(videoLibraryPaths);
    }

    remove(videoLibraryPath: VideoLibraryPath): number {
        return this.electronService.ipcRenderer.sendSync('videoLibraryPaths:remove', videoLibraryPath);
    }

}
