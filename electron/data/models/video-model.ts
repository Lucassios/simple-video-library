import { Instance, STRING, INTEGER, DECIMAL, BOOLEAN } from 'sequelize';
import sequelize from '../database-connection';
import VideoLibrary from './video-library-model';

export interface VideoAttributes {

    id?: number;
    name: string;
    extension: string;
    fileName: string;
    path: string;
    completePath: string;
    duration?: number;
    width?: number;
    height?: number;
    size?: number;
    cover?: string;
    libraryId?: number;
    rating?: number;
    new?: boolean;

}

export type VideoInstance = Instance<VideoAttributes> & VideoAttributes;

const Video = sequelize.define<VideoInstance, VideoAttributes>('video', {
    name: {
        type: STRING,
        allowNull: false
    },
    extension: {
        type: STRING,
        allowNull: false
    },
    fileName: {
        type: STRING,
        allowNull: false
    },
    path: {
        type: STRING,
        allowNull: false
    },
    completePath: {
        type: STRING,
        allowNull: false
    },
    duration: {
        type: INTEGER
    },
    width: {
        type: INTEGER
    },
    height: {
        type: INTEGER
    },
    size: {
        type: DECIMAL,
        allowNull: false
    },
    cover: {
        type: STRING
    },
    rating: {
        type: INTEGER,
        defaultValue: 0
    },
    new: {
        type: BOOLEAN,
        defaultValue: true
    }
}, {
    indexes: [{
        unique: true,
        fields: ['completePath', 'libraryId']
    }]
});

Video.belongsTo(VideoLibrary, { as: 'library', foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

export default Video;
