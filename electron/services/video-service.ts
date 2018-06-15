import { app } from 'electron';
import Video, { VideoInstance, VideoAttributes } from "../data/models/video-model";
import * as fs from 'fs';
import * as path from 'path';
import { CreateOptions } from "sequelize";
import * as PromiseBB from "bluebird";
import * as Ffmpeg from "fluent-ffmpeg";
import * as uuid from "uuid";

const VIDEO_FILE_FILTER = /^.*\.(avi|AVI|wmv|WMV|flv|FLV|mpg|MPG|mp4|MP4|mkv|MKV|mov|MOV)$/;
const IMAGES_PATH = process.env.NODE_ENV == 'test'
    ? 'C:/Users/Lucas_Marques/AppData/Roaming/angular-electron/images'
    : path.join(app.getPath('userData'), 'images');
const SCREENSHOT_SIZE = '240x135';

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
            } else if (fileName.charAt(0) != '.' && VIDEO_FILE_FILTER.test(fileName)) {
                // TODO: check if video already exists?
                videos.push(this.buildVideo(completePath));
            }

        }

        return videos;

    }

    getMetadata(file: string): Promise<Ffmpeg.FfprobeData> {
        return new Promise<Ffmpeg.FfprobeData>((resolve, reject) => {
            Ffmpeg.ffprobe(file, (err: any, metadata: Ffmpeg.FfprobeData) => err? reject(err) : resolve(metadata));
        });
    }

    generateScreenshots(file: string): Promise<string> {
        var imageName = uuid.v1();
        return new Promise<string>((resolve, reject) => {
            Ffmpeg(file).outputOptions('-qscale:v 2')
                .screenshots({
                    count: 1,
                    size: SCREENSHOT_SIZE,
                    folder: IMAGES_PATH,
                    filename: imageName
                })
                .on('end', () => resolve(imageName))
                .on('error', (error) => reject(error));
        });
    }

    private async buildVideo(completePath: string): Promise<VideoAttributes> {
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