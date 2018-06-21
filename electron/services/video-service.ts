import { IMAGES_PATH } from '../config';
import Video, { VideoInstance, VideoAttributes } from "../data/models/video-model";
import * as fs from 'fs';
import * as path from 'path';
import { CreateOptions } from "sequelize";
import * as Bluebird from "bluebird";
import * as Ffmpeg from "fluent-ffmpeg";
import * as uuid from "uuid";
import * as _ from 'lodash';
import { VideoLibraryInstance } from '../data/models/video-library-model';
import { videoLibraryPathService } from './video-library-path-service';

const VIDEO_FILE_FILTER = /^.*\.(avi|AVI|wmv|WMV|flv|FLV|mpg|MPG|mp4|MP4|mkv|MKV|mov|MOV)$/;
const SCREENSHOT_SIZE = '240x135';

export class VideoService {

    create(video: VideoAttributes, options?: CreateOptions): Bluebird<VideoInstance> {
        return Video.create(video, options);
    }

    async findByLibrary(library: VideoLibraryInstance): Promise<VideoAttributes[]> {
        let videos = new Array<VideoAttributes>();
        let paths = await videoLibraryPathService.findAll({where: {videolibraryid: library.id}});
        for (let path of paths) {
            videos.push(...this.findByPath(path.path));
        }
        _.each(videos, video => video.libraryId = library.id);
        return videos;
    }

    findByPath(filesPath: string): VideoAttributes[] {

        let videos = new Array<VideoAttributes>();
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

    generateScreenshot(file: string): Promise<string> {
        var imageName = uuid.v1() + ".png";
        return new Promise<string>((resolve, reject) => {
            Ffmpeg(file).outputOptions('-qscale:v 2')
                .screenshots({
                    count: 1,
                    size: SCREENSHOT_SIZE,
                    folder: IMAGES_PATH,
                    filename: imageName
                })
                .on('end', () => resolve(path.join(IMAGES_PATH, imageName)))
                .on('error', (error) => reject(error));
        });
    }

    getMetadata(video: VideoAttributes): Promise<VideoAttributes> {
        return new Promise<VideoAttributes>((resolve, reject) => {
            Ffmpeg.ffprobe(video.completePath, (err: any, metadata: Ffmpeg.FfprobeData) => {
                if (err) {
                    reject(err);
                }
                resolve({
                    ...video,
                    duration: metadata['format']['size'],
                    size: metadata['format']['size'],
                    width: metadata['streams'][0]['width'],
                    height: metadata['streams'][0]['height']
                });
            });
        });
    }

    private buildVideo(completePath: string): VideoAttributes {
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