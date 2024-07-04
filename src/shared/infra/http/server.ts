import { config } from 'dotenv';
import 'reflect-metadata';
import { app } from './app';
import { dataSource } from '../typeorm';

config();

const PORT = process.env.PORT;

/* eslint-disable no-console */
dataSource.initialize().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
  });
});
