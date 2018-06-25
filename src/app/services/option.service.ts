import { Injectable } from '@angular/core';
import { ElectronService } from '../providers/electron.service';

@Injectable({
    providedIn: 'root'
})
export class OptionService {

    constructor(private electronService: ElectronService) {
        
    }

    findByName(name: string) {
        let option = this.electronService.ipcRenderer.sendSync('options:findByName', name);
        if (option) {
            return option.value;
        } else {
            return null;
        }
    }

    createOrUpdate(name: string, value: any) {
        return this.electronService.ipcRenderer.sendSync('options:createOrUpdate', { name, value });
    }

}
