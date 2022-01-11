/* eslint-disable no-console */

import mongoose from 'mongoose';

import dotenv from 'dotenv'

dotenv.config()

const DB_URL = process.env.DB_URL

try {
  mongoose.connect(DB_URL);
} catch (err) {
  mongoose.createConnection(DB_URL);
}

mongoose.connection
  .once('open', () => print('connected to mongodb'))
  .on('error', e => {
    print(`couldn't connect to mongodb`)
    throw e;
  });