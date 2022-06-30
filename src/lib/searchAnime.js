import axios from 'axios';
import cheerio from 'cheerio';
import { BASEURL } from '../../config.js';
import { mapGenres } from './utils/utils.js';

const createSearchUrl = (keyword) => {
  return `${BASEURL}/?s=${(keyword
    .split(' ')
    .map(word => word+'+')
    .join('').slice(0, keyword
      .split(' ')
      .map(word => word+'+')
      .join('').length - 1))}&post_type=anime`;
}

const createAnimeData = (html) => {
  let result = [];

  const $ = cheerio.load(html);
  const animeElements = $('.chivsrc')
  .children('li')
  .toString()
  .split('</li>')
  .filter(item => item.trim() !== '')
  .map(item => `${item}</li>`);

  for (const element of animeElements) {
    const $ = cheerio.load(element);

    const judul = $('h2').text();
    const slug = $('h2 a').attr('href').replace('https://otakudesu.watch/anime/', '').replace('/', '');
    const url = $('h2 a').attr('href');
    const poster = $('img').attr('src');
    const genres = mapGenres($('.set:first a').toString());
    const status = $('.set:nth-child(4)').text().replace('Status : ', '');
    const rating = $('.set:last').text().replace('Rating : ', '');

    result.push({
      judul,
      slug,
      url,
      poster,
      genres,
      status,
      rating
    });
  }

  return result;
}

const searchAnime = async (keyword) => {
  const res = await axios.get(createSearchUrl(keyword));
  const result = createAnimeData(res.data);
  return result;
};

export default searchAnime;
