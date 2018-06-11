import Video, { VideoInstance, VideoAttributes } from "../data/models/video-model";
import * as fs from 'fs';
import * as path from 'path';

const videoFilesFilter = /^.*\.(avi|AVI|wmv|WMV|flv|FLV|mpg|MPG|mp4|MP4|mkv|MKV|mov|MOV)$/;

export class VideoService {

    bulkCreate(videos: VideoAttributes[], options?): VideoInstance {
        return Video.bulkCreate(videos, options);
    }

    create(video: VideoAttributes, options?): Promise<VideoInstance> {
        return Video.create(video, options);
    }

    findByPath(filesPath: string): VideoAttributes[] {

        let videos = new Array<VideoAttributes>();
        let files = fs.readdirSync(filesPath);
        for (let fileName of files) {

            var completePath = path.join(filesPath, fileName);
            var stat = fs.lstatSync(completePath);
            if (stat.isDirectory()) {
                videos.push(...this.findByPath(completePath));
            } else if (fileName.charAt(0) != '.' && videoFilesFilter.test(fileName)) {
                // TODO: check if video already exists?
                videos.push(this.createVideo(completePath));
            }

        }

        return videos;

    }

    private createVideo(completePath: string): VideoAttributes {
        var parsedPath = path.parse(completePath);
        return {
            name: parsedPath.name,
            extension: parsedPath.ext,
            fileName: parsedPath.base,
            path: parsedPath.dir,
            completePath
        };
    }

}

export const videoService = new VideoService();