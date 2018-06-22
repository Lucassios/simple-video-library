import Actor, { ActorAttributes } from "../data/models/actor";
import { VideoAttributes } from "../data/models/video-model";

export class ActorService {

    async createOrUpdate(actorAttr: ActorAttributes, video: VideoAttributes) {
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

}

export const actorService = new ActorService();