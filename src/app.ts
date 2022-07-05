import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { artistRouter } from './routers/artist.router.js';
import { comicRouter } from './routers/comic.router.js';

export const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.use('/artist', artistRouter);
app.use('/comic', comicRouter);
