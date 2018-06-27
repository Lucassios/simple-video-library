import { ipcMain } from 'electron';
import { VideoInstance } from '../data/models/video-model';
import { ProducerAttributes, ProducerInstance } from '../data/models/producer-model';
import { producerService } from '../services/producer-service';
import { FindOptions } from 'sequelize';

export default function() {

    ipcMain.on('producers:findAll', async (event, options: FindOptions<ProducerInstance>) => {
        event.returnValue = await producerService.findAll(options);
    });

    ipcMain.on('producers:createOrUpdate', async (event, producer: ProducerAttributes, video: VideoInstance) => {
        try {
            event.returnValue = await producerService.createOrUpdate(producer, video);
        } catch (ex) {
            console.log(ex);
            event.returnValue = null;
        }
    });

    ipcMain.on('producers:remove', async (event, producer: ProducerInstance, video: VideoInstance) => {
        try {
            event.returnValue = await producerService.remove(producer, video);
        } catch (ex) {
            console.log(ex);
            event.returnValue = null;
        }
    });

}
