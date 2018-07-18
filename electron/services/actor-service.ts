import Actor, { ActorAttributes, ActorInstance, VideoActors } from '../data/models/actor-model';
import Video, { VideoAttributes, VideoInstance } from '../data/models/video-model';
import Bluebird = require('bluebird');
import { FindOptions, fn } from 'sequelize';

export class ActorService {

    async createOrUpdate(actorAttr: ActorAttributes, video: VideoAttributes): Bluebird<ActorInstance> {
        let actor = await this.findByName(actorAttr.name);
        if (!actor) {
            actor = await Actor.create(actorAttr);
        }
        // @ts-ignore
        actor.addVideo(video.id);
        return actor;
    }

    findByName(name: string) {
        return Actor.findOne({ where: { name } });
    }

    async remove(actor: ActorInstance, video: VideoInstance): Bluebird<number> {
        const result = await VideoActors.destroy({ where: { actorId: actor.id, videoId: video.id } });
        const count = await VideoActors.count({ where: { actorId: actor.id } });
        if (count === 0) {
            return Actor.destroy({ where: { id: actor.id } });
        }
        return result;
    }

    findAll(options?: FindOptions<ActorInstance>): Bluebird<ActorInstance[]> {
        if (!options) {
            options = { };
        }
        if (!options.order) {
            options.order = [[ 'name', 'ASC' ]];
        }
        return Actor.findAll(options);
    }

    findAllAndCountVideos(): Bluebird<ActorInstance[]> {
        const options: FindOptions<ActorInstance> = {};
        options.order = [[ 'name', 'ASC' ]];
        options.group = ['actor.id'];
        options.include = [Video];
        options.attributes = ['name', [fn('COUNT', 'videos.id'), 'videosCount']];
        return Actor.findAll(options);
    }

}

export const actorService = new ActorService();
