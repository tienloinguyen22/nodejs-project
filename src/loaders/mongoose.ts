import mongoose from 'mongoose';
import { Db } from 'mongodb';
import { configs } from '../configs';

export const mongooseLoader = async (): Promise<Db> => {
  const connection = await mongoose.connect(configs.databaseURL, {
    useNewUrlParser: true,
    autoIndex: process.env.NODE_ENV === 'development',
    useFindAndModify: false,
  });
  return connection.connection.db;
};
