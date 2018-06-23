import { Instance, STRING } from 'sequelize';
import sequelize from '../database-connection';
import { VideoLibraryPathAttributes } from './video-library-path-model';

export interface VideoLibraryAttributes {
    name: string,
    paths?: VideoLibraryPathAttributes[]
}

export type VideoLibraryInstance = Instance<VideoLibraryAttributes> & VideoLibraryAttributes & {
    id?: number
};

const VideoLibrary = sequelize.define<VideoLibraryInstance, VideoLibraryAttributes>('videoLibrary', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true
    }
});

export default VideoLibrary;
