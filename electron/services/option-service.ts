import Bluebird = require('bluebird');
import { FindOptions } from 'sequelize';
import Option, { OptionInstance, OptionAttributes } from '../data/models/option-model';

export class OptionService {

    async createOrUpdate(optionAttr: OptionAttributes) {
        let option = await this.findByName(optionAttr.name);
        if (!option) {
            return Option.create(optionAttr);
        } else {
            return option.update(optionAttr);
        }
    }

    findByName(name: string) {
        return Option.findOne({ where: { name } });
    }

    findAll(options?: FindOptions<OptionInstance>): Bluebird<OptionInstance[]> {
        return Option.findAll(options);
    }

}

export const optionService = new OptionService();
