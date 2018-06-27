import videoLibraryController from "./video-library-controller";
import videoController from "./video-controller";
import videoLibraryPathController from "./video-library-path-controller";
import actorController from "./actor-controller";
import optionController from "./option-controller";
import tagController from "./tag-controller";

export default function initControllers() {

    videoLibraryController();
    videoController();
    videoLibraryPathController();
    actorController();
    optionController();
    tagController();

}