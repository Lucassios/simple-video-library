import Tag, { TagAttributes, TagInstance, VideoTags } from '../data/models/tag-model';
import { VideoAttributes, VideoInstance } from '../data/models/video-model';
import Bluebird = require('bluebird');
import { FindOptions } from 'sequelize';

export class TagService {

    async createOrUpdate(tagAttr: TagAttributes, video: VideoAttributes): Bluebird<TagInstance> {
        let tag = await this.findByName(tagAttr.name);
        if (!tag) {
            tag = await Tag.create(tagAttr);
        }
        // @ts-ignore
        tag.addVideo(video.id);
        return tag;
    }

    findByName(name: string) {
        return Tag.findOne({ where: { name } });
    }

    async remove(tag: TagInstance, video: VideoInstance): Bluebird<number> {
        const result = await VideoTags.destroy({ where: { tagId: tag.id, videoId: video.id } });
        const count = await VideoTags.count({ where: { tagId: tag.id } });
        if (count === 0) {
            return Tag.destroy({ where: { id: tag.id } });
        }
        return result;
    }

    findAll(options?: FindOptions<TagInstance>): Bluebird<TagInstance[]> {
        if (!options) {
            options = { };
        }
        if (!options.order) {
            options.order = [[ 'name', 'ASC' ]];
        }
        return Tag.findAll(options);
    }

}

export const tagService = new TagService();
