import { Injectable } from '@angular/core';
import { ElectronService } from '../providers/electron.service';
import { Video } from '../models/video';
import { Actor } from '../models/actor';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ActorService {

    private actorsSource = new Subject<Actor[]>();
    actors$ = this.actorsSource.asObservable();

    constructor(public electronService: ElectronService) { }

    createOrUpdate(actor: Actor, video: Video): Actor {
        return this.electronService.ipcRenderer.sendSync('actors:createOrUpdate', actor, video);
    }

    remove(actor: Actor, video: Video): number {
        return this.electronService.ipcRenderer.sendSync('actors:remove', actor, video);
    }

    findAll(options?): Actor[] {
        if (options === undefined) {
            return this.electronService.ipcRenderer.sendSync('actors:findAll');
        } else {
            return this.electronService.ipcRenderer.sendSync('actors:findAll', options);
        }
    }

    findAllAndCountVideos(): Actor[] {
        return this.electronService.ipcRenderer.sendSync('actors:findAllAndCountVideos');
    }

    refreshActors() {
        this.actorsSource.next(this.findAll());
    }

}
