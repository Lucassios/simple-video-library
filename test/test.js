"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
exports.__esModule = true;
var ava_1 = require("ava");
var data_1 = require("../electron/data");
var video_library_path_model_1 = require("../electron/data/models/video-library-path-model");
var video_library_service_1 = require("../electron/services/video-library-service");
function findOrCreateLibraryTest() {
    return __awaiter(this, void 0, void 0, function () {
        var videoLibraries;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, video_library_service_1.videoLibraryService.findAll()];
                case 1:
                    videoLibraries = _a.sent();
                    if (videoLibraries.length == 0) {
                        return [2 /*return*/, video_library_service_1.videoLibraryService.create({
                                name: 'VideoLibraryTest',
                                paths: [{ path: 'C:/Users/Lucas_Marques/Videos' }]
                            }, {
                                include: [{ model: video_library_path_model_1["default"], as: 'paths' }]
                            })];
                    }
                    else {
                        return [2 /*return*/, videoLibraries[0]];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
ava_1["default"]('refreshLibrary', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var videoLibrary, videos;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, data_1.initDB()];
            case 1:
                _a.sent();
                return [4 /*yield*/, findOrCreateLibraryTest()];
            case 2:
                videoLibrary = _a.sent();
                return [4 /*yield*/, video_library_service_1.videoLibraryService.refreshLibrary(videoLibrary)];
            case 3:
                videos = _a.sent();
                console.log(videos);
                t.pass();
                return [2 /*return*/];
        }
    });
}); });
