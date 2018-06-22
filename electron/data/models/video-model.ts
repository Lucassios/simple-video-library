import { Instance, STRING, INTEGER, DECIMAL } from "sequelize";
import sequelize from "../database-connection";
import VideoLibrary from "./video-library-model";

export interface VideoAttributes {

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
        allowNull: false,
        unique: true
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
    }
});

Video.belongsTo(VideoLibrary, { as: 'library', foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

export default Video;
