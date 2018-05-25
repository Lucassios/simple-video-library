import { Model, STRING } from "sequelize";
import sequelize from "../database-connection";

class VideoLibrary extends Model {

    name: string

}

VideoLibrary.init(
    {
        name: STRING
    },
    { sequelize }
)

export default VideoLibrary;