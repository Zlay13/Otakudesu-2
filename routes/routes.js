import { Router } from 'express';
import handler from '../handler/handler.js';

const router = Router();

router.get('/', (_, res) => {
  return res.status(200).json({
    status: 'Ok',
    message: 'Otakudesu unofficial API. Made by rzkfyn with <3',
  });
});

router.get('/api', (_, res) => {
  return res.status(200).json({
    status: 'Ok',
    message: 'Otakudesu unofficial API. Made by rzkfyn with <3',
  });
});

router.get('/api/search/:keyword', handler.searchAnimeHandler);

router.get('/api/anime/:slug', handler.singleAnimeHandler);

router.get('/api/episode/:slug', handler.episodeHandler);

router.use('/', (_, res) => {
  return res.status(404).json({
    status: 'Error',
    message: 'There\'s nothing here ;_;'
  });
});

export default router;
