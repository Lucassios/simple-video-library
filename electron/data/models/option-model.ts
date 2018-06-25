import sequelize from "../database-connection";
import { Instance, STRING, JSON } from "sequelize";

export interface OptionAttributes {
    id?: number,
    name: string,
    value: string
}

export type OptionInstance = Instance<OptionAttributes> & OptionAttributes;

const Option = sequelize.define<OptionInstance, OptionAttributes>('options', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true
    },
    value: {
        type: JSON,
        allowNull: false
    }
});

export default Option;