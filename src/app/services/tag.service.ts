import { Injectable } from '@angular/core';
import { ElectronService } from '../providers/electron.service';
import { Video } from '../models/video';
import { Tag } from '../models/tag';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TagService {

    private tagsSource = new Subject<Tag[]>();
    tags$ = this.tagsSource.asObservable();

    constructor(public electronService: ElectronService) { }

    createOrUpdate(tag: Tag, video: Video): Tag {
        return this.electronService.ipcRenderer.sendSync('tags:createOrUpdate', tag, video);
    }

    remove(tag: Tag, video: Video): number {
        return this.electronService.ipcRenderer.sendSync('tags:remove', tag, video);
    }

    findAll(options?): Tag[] {
        if (options === undefined) {
            return this.electronService.ipcRenderer.sendSync('tags:findAll');
        } else {
            return this.electronService.ipcRenderer.sendSync('tags:findAll', options);
        }
    }

    findAllAndCountVideos(): Tag[] {
        return this.electronService.ipcRenderer.sendSync('tags:findAllAndCountVideos');
    }

    refreshTags() {
        this.tagsSource.next(this.findAll());
    }

}
