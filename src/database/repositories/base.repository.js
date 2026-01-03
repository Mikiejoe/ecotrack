import mongoose, { Model, Document } from 'mongoose';
export class BaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async create(item) {
        const createdItem = new this.model(item);
        return await createdItem.save();
    }
    async findOne(filter, options) {
        return await this.model.findOne(filter, null, options).lean().exec();
    }
    async findAll(filter = {}) {
        return await this.model.find(filter).lean().exec();
    }
    async update(id, item) {
        return await this.model.findByIdAndUpdate(id, item, {
            new: true,
            runValidators: true
        }).exec();
    }
    async delete(id) {
        const result = await this.model.findByIdAndDelete(id).exec();
        return result !== null;
    }
}