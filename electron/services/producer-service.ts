import Producer, { ProducerAttributes, ProducerInstance, VideoProducers } from '../data/models/producer-model';
import { VideoAttributes, VideoInstance } from '../data/models/video-model';
import Bluebird = require('bluebird');
import { FindOptions } from 'sequelize';

export class ProducerService {

    async createOrUpdate(producerAttr: ProducerAttributes, video: VideoAttributes): Bluebird<ProducerInstance> {
        let producer = await this.findByName(producerAttr.name);
        if (!producer) {
            producer = await Producer.create(producerAttr);
        }
        // @ts-ignore
        producer.addVideo(video.id);
        return producer;
    }

    findByName(name: string) {
        return Producer.findOne({ where: { name } });
    }

    async remove(producer: ProducerInstance, video: VideoInstance): Bluebird<number> {
        const result = await VideoProducers.destroy({ where: { producerId: producer.id, videoId: video.id } });
        const count = await VideoProducers.count({ where: { producerId: producer.id } });
        if (count === 0) {
            return Producer.destroy({ where: { id: producer.id } });
        }
        return result;
    }

    findAll(options?: FindOptions<ProducerInstance>): Bluebird<ProducerInstance[]> {
        return Producer.findAll(options);
    }

}

export const producerService = new ProducerService();
