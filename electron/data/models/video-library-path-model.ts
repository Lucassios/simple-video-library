import { Instance, STRING } from "sequelize";
import sequelize from "../database-connection";
import VideoLibrary from "./video-library-model";

export interface VideoLibraryPathAttributes {
    path: string
}

export type VideoLibraryPathInstance = Instance<VideoLibraryPathAttributes> & VideoLibraryPathAttributes & {
    id: number
    videolibraryid: number
};

const VideoLibraryPath = sequelize.define<VideoLibraryPathInstance, VideoLibraryPathAttributes>('video_library_path', {
    path: {
        type: STRING,
        allowNull: false,
        unique: true
    }
});

VideoLibrary.hasMany(VideoLibraryPath, { as: 'paths', foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

export default VideoLibraryPath;