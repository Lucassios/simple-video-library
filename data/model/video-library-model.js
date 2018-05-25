"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var sequelize_1 = require("sequelize");
var database_connection_1 = require("../database-connection");
var VideoLibrary = /** @class */ (function (_super) {
    __extends(VideoLibrary, _super);
    function VideoLibrary() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return VideoLibrary;
}(sequelize_1.Model));
VideoLibrary.init({
    name: sequelize_1.STRING
}, { sequelize: database_connection_1["default"] });
exports["default"] = VideoLibrary;
