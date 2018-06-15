import Video, { VideoInstance, VideoAttributes } from "../data/models/video-model";
import * as fs from 'fs';
import * as path from 'path';
import { CreateOptions } from "sequelize";
import * as PromiseBB from "bluebird";
import * as Ffmpeg from "fluent-ffmpeg";

const videoFilesFilter = /^.*\.(avi|AVI|wmv|WMV|flv|FLV|mpg|MPG|mp4|MP4|mkv|MKV|mov|MOV)$/;

export class VideoService {

    create(video: VideoAttributes, options?: CreateOptions): PromiseBB<VideoInstance> {
        return Video.create(video, options);
    }

    findByPath(filesPath: string): Promise<VideoAttributes>[] {

        let videos = new Array<Promise<VideoAttributes>>();
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

    getMetadata(file: string): Promise<Ffmpeg.FfprobeData> {
        return new Promise<Ffmpeg.FfprobeData>((resolve, reject) => {
            Ffmpeg.ffprobe(file, (err: any, metadata: Ffmpeg.FfprobeData) => err? reject(err) : resolve(metadata));
        });
    }

    private async createVideo(completePath: string): Promise<VideoAttributes> {
        var parsedPath = path.parse(completePath);
        var metadata = await this.getMetadata(completePath);
        return {
            name: parsedPath.name,
            extension: parsedPath.ext,
            fileName: parsedPath.base,
            path: parsedPath.dir,
            completePath,
            duration: metadata['format']['size'],
            size: metadata['format']['size'],
            width: metadata['streams'][0]['width'],
            height: metadata['streams'][0]['height']
        };
    }

}

export const videoService = new VideoService();