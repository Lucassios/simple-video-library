import { Injectable } from '@angular/core';
import { ElectronService } from '../providers/electron.service';
import { Video } from '../models/video';
import { Producer } from '../models/producer';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProducerService {

    private producersSource = new Subject<Producer[]>();
    producers$ = this.producersSource.asObservable();

    constructor(public electronService: ElectronService) { }

    createOrUpdate(producer: Producer, video: Video): Producer {
        const result = this.electronService.ipcRenderer.sendSync('producers:createOrUpdate', producer, video);
        this.refreshProducers();
        return result;
    }

    remove(producer: Producer, video: Video): number {
        const result = this.electronService.ipcRenderer.sendSync('producers:remove', producer, video);
        this.refreshProducers();
        return result;
    }

    findAll(options?): Producer[] {
        if (options === undefined) {
            return this.electronService.ipcRenderer.sendSync('producers:findAll');
        } else {
            return this.electronService.ipcRenderer.sendSync('producers:findAll', options);
        }
    }

    findAllAndCountVideos(): Producer[] {
        return this.electronService.ipcRenderer.sendSync('producers:findAllAndCountVideos');
    }

    refreshProducers() {
        this.producersSource.next(this.findAllAndCountVideos());
    }

}
