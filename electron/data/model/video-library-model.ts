import { Instance, STRING, DATE } from "sequelize";
import sequelize from "../database-connection";

export interface VideoLibraryAttributes {
    name: string
}

export type VideoLibraryInstance = Instance<VideoLibraryAttributes> & VideoLibraryAttributes;

const VideoLibrary = sequelize.define<VideoLibraryInstance, VideoLibraryAttributes>('videolibrary', {
    name: STRING
});

VideoLibrary.sync();

export default VideoLibrary;