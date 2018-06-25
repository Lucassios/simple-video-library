import { app } from 'electron';
import * as path from 'path';

export const IMAGES_PATH = process.env.NODE_ENV == 'test'
    ? 'C:/Users/Lucas_Marques/AppData/Roaming/simple-video-library/images'
    : path.join(app.getPath('userData'), 'images');

// @ts-ignore
global.IMAGES_PATH = IMAGES_PATH;
