import { Instance, STRING } from 'sequelize';
import sequelize from '../database-connection';
import Video from './video-model';

export interface ActorAttributes {
    id?: number;
    name: string;
}

export type ActorInstance = Instance<ActorAttributes> & ActorAttributes;

const Actor = sequelize.define<ActorInstance, ActorAttributes>('actor', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true
    }
});

export const VideoActors = sequelize.define('videoActors', {});

Actor.belongsToMany(Video, { through: VideoActors });
Video.belongsToMany(Actor, { through: VideoActors });

export default Actor;
