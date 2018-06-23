import Actor, {ActorAttributes, ActorInstance, VideoActors} from '../data/models/actor';
import {VideoAttributes, VideoInstance} from '../data/models/video-model';
import Bluebird = require('bluebird');

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

}

export const actorService = new ActorService();
