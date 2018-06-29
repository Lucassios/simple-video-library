import { IMAGES_PATH } from '../config';
import Video, { VideoInstance, VideoAttributes } from '../data/models/video-model';
import * as fs from 'fs';
import * as path from 'path';
import {and, col, CreateOptions, FindOptions, fn, literal, Op, or, where, WhereOptions, IncludeOptions, Model} from 'sequelize';
import * as Bluebird from 'bluebird';
import * as Ffmpeg from 'fluent-ffmpeg';
import * as uuid from 'uuid';
import * as _ from 'lodash';
import { VideoLibraryInstance } from '../data/models/video-library-model';
import { videoLibraryPathService } from './video-library-path-service';
import Actor from '../data/models/actor-model';
import * as log from 'electron-log';
import Filter from '../data/models/filter-model';
import Tag from '../data/models/tag-model';
import Producer from '../data/models/producer-model';

const VIDEO_FILE_FILTER = /^.*\.(avi|AVI|wmv|WMV|flv|FLV|mpg|MPG|mp4|MP4|mkv|MKV|mov|MOV)$/;
const SCREENSHOT_SIZE = '280x180';

Ffmpeg().setFfmpegPath(require('ffmpeg-static').path);
Ffmpeg().setFfprobePath(require('ffprobe-static').path);

export class VideoService {

    create(video: VideoAttributes, options?: CreateOptions): Bluebird<VideoInstance> {
        return Video.create(video, options);
    }

    async update(videoAttributes: VideoAttributes) {
        const video = await Video.findOne({ where: { id: videoAttributes.id } });
        return video.update(videoAttributes);
    }

    findAll(options?: FindOptions<VideoInstance>): Bluebird<VideoInstance[]> {
        if (!options) {
            options = { };
        }
        if (!options.order) {
            options.order = literal('random()');
        }
        log.info(options);
        return Video.findAll(options);
    }

    findByFilter(filter: Filter): Bluebird<VideoInstance[]> {

        const options: FindOptions<VideoInstance> = {};
        // noinspection TsLint
        const where: WhereOptions<VideoInstance> | where | fn | Array<col | and | or | string> = {};
        const include: Array<Model<any, any> | IncludeOptions> = [];

        if (filter.order === 'random') {
            options.order = literal('random()');
        } else if (filter.order === 'most-recent') {
            options.order = [[ 'createdAt', 'DESC' ]];
        }

        if (filter.libraryId) {
            where.libraryId = filter.libraryId;
        }

        if (filter.ratingRange) {
            where.rating = { [Op.between]: filter.ratingRange };
        }

        if (filter.actors && filter.actors.length > 0) {
            include.push({
                model: Actor,
                required: true,
                where: {
                    name: { [Op.in]: filter.actors }
                }
            });
        }

        if (filter.tags && filter.tags.length > 0) {
            include.push({
                model: Tag,
                required: true,
                where: {
                    name: { [Op.in]: filter.tags }
                }
            });
        }

        if (filter.producers && filter.producers.length > 0) {
            include.push({
                model: Producer,
                required: true,
                where: {
                    name: { [Op.in]: filter.producers }
                }
            });
        }

        if (filter.search) {
            where.name = { [Op.like]: '%' + filter.search + '%' };
        }

        options.where = where;
        options.include = include;
        // options.limit = 52;

        return Video.findAll(options);

    }

    findOne(options?: FindOptions<VideoInstance>): Bluebird<VideoInstance> {
        return Video.findOne(options);
    }

    findByIdFetch(id: number): Bluebird<VideoInstance> {
        const options = { include: [ Actor, Tag, Producer ] };
        return Video.findById(id, options);
    }

    private findByLibrary(library: VideoLibraryInstance): Bluebird<VideoInstance[]> {
        return this.findAll({ where: { libraryId: library.id } });
    }

    async findNewFilesByLibrary(library: VideoLibraryInstance): Promise<VideoAttributes[]> {
        const videos = new Array<VideoAttributes>();
        const paths = await videoLibraryPathService.findAll({ where: { videoLibraryId: library.id } });
        const existingVideos = await this.findByLibrary(library);
        const existingFiles = _.map(existingVideos, video => video.completePath);
        for (const _path of paths) {
            videos.push(...await this.findNewFilesByPath(_path.path, existingFiles));
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
        const imageName = uuid.v1() + '.jpeg';
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

    async delete(videoAttributes: VideoInstance) {
        const video = await Video.findOne({ where: { id: videoAttributes.id } });
        fs.unlinkSync(video.completePath);
        return video.destroy();
    }

}

export const videoService = new VideoService();
