import { Instance, STRING } from 'sequelize';
import sequelize from '../database-connection';
import Video from './video-model';

export interface ProducerAttributes {
    id?: number;
    name: string;
}

export type ProducerInstance = Instance<ProducerAttributes> & ProducerAttributes;

const Producer = sequelize.define<ProducerInstance, ProducerAttributes>('producer', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true
    }
});

export const VideoProducers = sequelize.define('videoProducers', {}, { timestamps: false });

Producer.belongsToMany(Video, { through: VideoProducers });
Video.belongsToMany(Producer, { through: VideoProducers });

export default Producer;
