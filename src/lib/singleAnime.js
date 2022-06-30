import axios from 'axios';
import cheerio from 'cheerio';
import { mapGenres } from './utils/utils.js';
import { BASEURL } from '../../config.js'

const createAnimeData = (html, poster, sinopsis, episodeList) => {
  const $ = cheerio.load(html);

  const judul = $('p:first span').text()?.replace('Judul: ', '');
  const japanese = $('p:nth-child(2) span').text()?.replace('Japanese: ', '');
  const rating = $('p:nth-child(3) span').text()?.replace('Skor: ', '');
  const produser = $('p:nth-child(4) span').text()?.replace('Produser: ', '');
  const tipe = $('p:nth-child(5) span').text()?.replace('Tipe: ', '');
  const status = $('p:nth-child(6) span').text()?.replace('Status: ', '');
  const totalepisode = $('p:nth-child(7) span').text()?.replace('Total Episode: ', '');
  const durasi = $('p:nth-child(8) span').text()?.replace('Durasi: ', '');
  const tanggalliris = $('p:nth-child(9) span').text()?.replace('Tanggal Rilis: ', '');
  const studio = $('p:nth-child(10) span').text()?.replace('Studio: ', '');
  const genres = mapGenres($('p:last span a').toString());  

  if(!episodeList) return undefined;

  return {
    judul,
    japanese,
    poster,
    rating,
    produser,
    tipe,
    status,
    "total-episode": totalepisode,
    durasi,
    "tanggal-liris": tanggalliris,
    studio,
    genres,
    sinopsis,
    episodeList
  };
}

const getSinopsis = (html) => {
  const $ = cheerio.load(html);
  const sinopsis = $('.sinopc').text().split('<p>').map(item => item.replace('</p>', '\n').replace('&nbsp', '')).join('');
  return sinopsis;
}

const getPoster = (html) => {
  const $ = cheerio.load(html);
  const poster = $('.fotoanime img').attr('src');
  return poster;
}

const getEpisodeList = (html) => {
  let result = [];
  let $ = cheerio.load(html);
  $ = cheerio.load(`<div> ${$('.episodelist').toString()}</div>`);
  const episodeList = $('.episodelist:nth-child(2) ul').html()?.split('</li>').filter(item => item.trim() !== '').map(item => `${item}</li>`);
  if (!episodeList) return undefined;
  for (const episode of episodeList) {
    const $ = cheerio.load(episode);
    result.unshift({
      episode: $('li span:first a')?.text(),
      slug: $('li span:first a')?.attr('href').replace(`${BASEURL}/episode/`, '').replace('/', ''),
      url: $('li span:first a')?.attr('href')
    });
  }
  return result;
}

const singleAnime = async (slug) => {
  const res = await axios.get(`${BASEURL}/anime/${slug}`);
  const $ = cheerio.load(res.data);
  const result = createAnimeData($('.infozin .infozingle').toString(), getPoster(res.data), getSinopsis(res.data), getEpisodeList(res.data));
  return result;
}

export default singleAnime;
