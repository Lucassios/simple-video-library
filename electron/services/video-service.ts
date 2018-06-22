import { IMAGES_PATH } from '../config';
import Video, { VideoInstance, VideoAttributes } from "../data/models/video-model";
import * as fs from 'fs';
import * as path from 'path';
import { CreateOptions, FindOptions } from "sequelize";
import * as Bluebird from "bluebird";
import * as Ffmpeg from "fluent-ffmpeg";
import * as uuid from "uuid";
import * as _ from 'lodash';
import { VideoLibraryInstance } from '../data/models/video-library-model';
import { videoLibraryPathService } from './video-library-path-service';

const VIDEO_FILE_FILTER = /^.*\.(avi|AVI|wmv|WMV|flv|FLV|mpg|MPG|mp4|MP4|mkv|MKV|mov|MOV)$/;
const SCREENSHOT_SIZE = '280x180';

export class VideoService {

    create(video: VideoAttributes, options?: CreateOptions): Bluebird<VideoInstance> {
        return Video.create(video, options);
    }

    async update(videoAttributes: VideoAttributes) {
        let video = await Video.findOne({ where: { id: videoAttributes.id } });
        return video.update(videoAttributes);
    }

    findAll(options?: FindOptions<VideoInstance>): Bluebird<VideoInstance[]> {
        return Video.findAll(options);
    }

    findOne(options?: FindOptions<VideoInstance>): Bluebird<VideoInstance> {
        return Video.findOne(options);
    }

    private findByLibrary(library: VideoLibraryInstance): Bluebird<VideoInstance[]> {
      return this.findAll({ where: { libraryId: library.id } });
    }

    async findNewFilesByLibrary(library: VideoLibraryInstance): Promise<VideoAttributes[]> {
        const videos = new Array<VideoAttributes>();
        const paths = await videoLibraryPathService.findAll({where: {videolibraryid: library.id}});
        const existingVideos = await this.findByLibrary(library);
        const existingFiles = _.map(existingVideos, video => video.completePath);
        for (const path of paths) {
            videos.push(...await this.findNewFilesByPath(path.path, existingFiles));
        }
        _.each(videos, video => video.libraryId = library.id);
        return videos;
    }

    async findNewFilesByPath(filesPath: string, existingFiles: string[]): Promise<VideoAttributes[]> {

        const videos = new Array<VideoAttributes>();
        const files = fs.readdirSync(filesPath);
        for (const fileName of files) {

            try {

              const completePath = path.join(filesPath, fileName);
              if (existingFiles.indexOf(completePath) >= 0) {
                continue;
              }

              const stat = fs.lstatSync(completePath);
              if (stat.isDirectory()) {
                videos.push(...await this.findNewFilesByPath(completePath, existingFiles));
              } else if (fileName.charAt(0) !== '.' && VIDEO_FILE_FILTER.test(fileName)) {
                videos.push(this.buildVideo(completePath));
              }

            } catch (ex) {
              console.log(ex);
            }

        }

        return videos;

    }

    generateScreenshot(file: string): Promise<string> {
        const imageName = uuid.v1() + '.png';
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
                } else {
                    resolve({
                        ...video,
                        duration: metadata['format']['duration'],
                        size: metadata['format']['size'],
                        width: metadata['streams'][0]['width'],
                        height: metadata['streams'][0]['height']
                    });
                }
            });
        });
    }

    private buildVideo(completePath: string): VideoAttributes {
        const parsedPath = path.parse(completePath);
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
