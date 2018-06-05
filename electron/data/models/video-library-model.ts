import { Instance, STRING, DATE, ARRAY } from "sequelize";
import sequelize from "../database-connection";

export interface VideoLibraryAttributes {
    name: string
}

export type VideoLibraryInstance = Instance<VideoLibraryAttributes> & VideoLibraryAttributes;

const VideoLibrary = sequelize.define<VideoLibraryInstance, VideoLibraryAttributes>('videolibrary', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true
    }
});

VideoLibrary.sync();

export default VideoLibrary;