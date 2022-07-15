import axios from 'axios';
import cheerio from 'cheerio';
import { splitAnimeEls, scrapeAnimeData } from './utils/utils.js';
import { BASEURL } from '../../config.js';

const getOngoingAnimeData = async (page = undefined) => {
  const { data } = await axios.get(`${BASEURL}/ongoing-anime${page ? '/page/'+page : ''}`);
  const $ = cheerio.load(data);
  const animes = splitAnimeEls($('.venz').toString());
  return scrapeAnimeData(animes);
}

export default getOngoingAnimeData;
