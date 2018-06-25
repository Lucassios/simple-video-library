import { ipcMain } from 'electron';
import { optionService } from '../services/option-service';
import { OptionAttributes } from '../data/models/option-model';

export default function() {

    ipcMain.on('options:createOrUpdate', async (event, optionAttr: OptionAttributes) => {
        event.returnValue = await optionService.createOrUpdate(optionAttr);
    });

    ipcMain.on('options:findByName', async (event, name: string) => {
        event.returnValue = await optionService.findByName(name);
    });

}
