"use strict";
exports.__esModule = true;
var video_library_model_1 = require("../data/model/video-library-model");
var VideoLibraryService = /** @class */ (function () {
    function VideoLibraryService() {
    }
    VideoLibraryService.prototype.create = function (videoLibrary) {
        return video_library_model_1["default"].create(videoLibrary);
    };
    return VideoLibraryService;
}());
exports.VideoLibraryService = VideoLibraryService;
exports.videoLibraryService = new VideoLibraryService();
