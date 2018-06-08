import { Instance, STRING } from "sequelize";
import sequelize from "../database-connection";
import VideoLibrary from "./video-library-model";

export interface VideoAttributes {

    name: string
    extension: string
    fileName: string
    path: string
    completePath: string

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
    }
});

Video.belongsTo(VideoLibrary);

export default Video;