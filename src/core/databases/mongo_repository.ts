/* eslint-disable @typescript-eslint/no-explicit-any */

import { Model, Document, QueryCursor } from 'mongoose';
import { Repository } from '../interfaces/mongo_repository';
import { RepositoryQuery } from '../interfaces/repository_query';

export class MongoRepository<T> implements Repository<T> {
  model: Model<Document>;

  populateFields: string[];

  constructor(model: Model<Document>, populateFields: string[]) {
    this.model = model;
    this.populateFields = populateFields;
  }

  async create(entity: Partial<T>): Promise<T> {
    const newRecord = await this.model.create(entity);
    return this.findById(newRecord._id) as any;
  }

  async update(entity: { _id: string } & Partial<T>): Promise<T> {
    const { _id, ...updateOjbect } = entity;
    const newRecord = await this.model
      .findByIdAndUpdate(_id, { $set: updateOjbect }, { new: true })
      .populate(this.populateFields)
      .lean();
    return newRecord as any;
  }

  async upsert(entity: { _id: string } & Partial<T>): Promise<T> {
    const { _id, ...updateOjbect } = entity;
    const newRecord = await this.model
      .findByIdAndUpdate(
        _id,
        { $set: updateOjbect },
        {
          new: true,
          upsert: true,
        },
      )
      .populate(this.populateFields)
      .lean();
    return newRecord as any;
  }

  async del(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }

  async findById(id: string): Promise<T | undefined> {
    const result = await this.model
      .findById(id)
      .populate(this.populateFields)
      .lean();
    return result || undefined;
  }

  async findOne(filters: any): Promise<T | undefined> {
    return this.model
      .findOne(filters)
      .populate(this.populateFields)
      .lean();
  }

  async findAll(filters: any): Promise<T[]> {
    return this.model
      .find(filters)
      .populate(this.populateFields)
      .lean();
  }

  async findAllCursor(filters: any): Promise<QueryCursor<Document>> {
    return this.model
      .find(filters)
      .populate(this.populateFields)
      .cursor();
  }

  async find(query: RepositoryQuery): Promise<T[]> {
    return this.model
      .find(query.filters)
      .sort(query.sortBy)
      .populate(this.populateFields)
      .skip((Number(query.pageNumber) - 1) * Number(query.pageSize))
      .limit(Number(query.pageSize)) as any;
  }

  async count(filters: any): Promise<number> {
    return this.model.find(filters).countDocuments();
  }
}
