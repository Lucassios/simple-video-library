import { Instance, STRING } from 'sequelize';
import sequelize from '../database-connection';
import VideoLibrary from './video-library-model';

export interface VideoLibraryPathAttributes {
    path: string
}

export type VideoLibraryPathInstance = Instance<VideoLibraryPathAttributes> & VideoLibraryPathAttributes & {
    id: number
    videoLibraryId: number
};

const VideoLibraryPath = sequelize.define<VideoLibraryPathInstance, VideoLibraryPathAttributes>('videoLibraryPath', {
    path: {
        type: STRING,
        allowNull: false
    }
}, {
    indexes: [{
        unique: true,
        fields: ['path', 'videoLibraryId']
    }]
});

VideoLibrary.hasMany(VideoLibraryPath, { as: 'paths', foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

export default VideoLibraryPath;
