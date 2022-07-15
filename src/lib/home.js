import axios from 'axios';
import cheerio from 'cheerio';
import { BASEURL } from '../../config.js';
import { scrapeAnimeData, splitAnimeEls } from './utils/utils.js';

const getAnimeData = async () => {
  const res = await axios.get(BASEURL);
  const $ = cheerio.load(res.data);
  const data = $('.venutama .rseries .rapi .venz')
  .toString()
  .split('<div class="venz">')
  .filter(item => item.trim() !== '')
  .map(item => `<div class="venz">${item}`);

  const ongoingAnime = scrapeOngoingAnime(data[0]);
  const completeAnime = scrapeCompleteAnime(data[1]);

  return {
    ongoingAnime,
    completeAnime
  };
};

const scrapeOngoingAnime = (html) => {
  const animes = splitAnimeEls(html);
  const data = scrapeAnimeData(animes);
  return data;
};

const scrapeCompleteAnime = (html) => {
  const animes = splitAnimeEls(html);
  const data = scrapeAnimeData(animes, 'complete');
  return data;
};

export default getAnimeData;