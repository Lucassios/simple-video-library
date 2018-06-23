import { Actor } from './actor';

export class Video {

    id: number;
    name: string;
    extension: string;
    fileName: string;
    path: string;
    completePath: string;
    duration: number;
    width: number;
    height: number;
    size: number;
    cover: string;
    rating: number;
    libraryId: number;
    actors: Actor[];

    background: string;
    selected: boolean;

}
