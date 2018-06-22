import { Injectable } from '@angular/core';
import { ElectronService } from '../providers/electron.service';
import { Video } from '../models/video';
import { Actor } from '../models/actor';

@Injectable({
    providedIn: 'root'
})
export class ActorService {

    constructor(public electronService: ElectronService) { }

    createOrUpdate(actor: Actor, video: Video): Actor {
        return this.electronService.ipcRenderer.sendSync('actors:createOrUpdate', actor, video);
    }
    
}
