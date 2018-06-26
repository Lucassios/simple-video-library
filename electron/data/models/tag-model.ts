import { Instance, STRING } from 'sequelize';
import sequelize from '../database-connection';
import Video from './video-model';

export interface TagAttributes {
    id?: number;
    name: string;
}

export type TagInstance = Instance<TagAttributes> & TagAttributes;

const Tag = sequelize.define<TagInstance, TagAttributes>('tag', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true
    }
});

export const VideoTags = sequelize.define('videoTags', {});

Tag.belongsToMany(Video, { through: VideoTags });
Video.belongsToMany(Tag, { through: VideoTags });

export default Tag;
