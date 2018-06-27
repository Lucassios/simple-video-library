import { Actor } from './actor';
import { Tag } from './tag';
import { Producer } from './producer';

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
    tags: Tag[];
    producers: Producer[];
    new: boolean;

    background: string;
    selected: boolean;

}
