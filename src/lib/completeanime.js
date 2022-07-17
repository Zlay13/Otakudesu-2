import axios from 'axios';
import cheerio from 'cheerio';
import { splitAnimeEls, scrapeAnimeData } from './utils/utils.js';
import { BASEURL } from '../../config.js';

const getCompleteAnimeData = async (page = undefined) => {
  const { data } = await axios.get(`${BASEURL}/complete-anime${page ? '/page/'+page : ''}`);
  const $ = cheerio.load(data);
  const animes = splitAnimeEls($('.venz').toString());
  return scrapeAnimeData(animes, 'complete');
}

export default getCompleteAnimeData;
