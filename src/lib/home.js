import axios from 'axios';
import cheerio from 'cheerio';
import { BASEURL } from '../../config.js';

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

const splitAnimeEl = (html) => {
  const $ = cheerio.load(html);

  const animes = $('.detpost')
  .toString()
  .split('<div class="detpost">')
  .filter(item => item.trim() !== '')
  .map(item => `<div class="detpost">${item}`);

  return  animes;
};

const scrapeOngoingAnime = (html) => {
  const animes = splitAnimeEl(html)
  let res = [];

  for (const anime of animes) {
    const $ = cheerio.load(anime);

    const judul = $('.thumb .thumbz .jdlflm').text().trim();
    const slug = $('.thumb a').attr('href').replace('https://otakudesu.watch/anime/', '').replace('/', '');
    const poster = $('.thumb .thumbz img').attr('src');
    const url = $('.thumb a').attr('href');
    const episodeTerbaru = $('.epz').text().trim();
    const hariUpload = $('.epztipe').text().trim();
    const tanggalTerakhirUpload = $('.newnime').text().trim();

    res.push({
      judul, slug, poster, url, episodeTerbaru, hariUpload, tanggalTerakhirUpload
    });
  }

  return res;
};

const scrapeCompleteAnime = (html) => {
  const animes = splitAnimeEl(html)
  let res = [];

  for (const anime of animes) {
    const $ = cheerio.load(anime);

    const judul = $('.thumb .thumbz .jdlflm').text().trim();
    const slug = $('.thumb a').attr('href').replace('https://otakudesu.watch/anime/', '').replace('/', '');
    const poster = $('.thumb .thumbz img').attr('src');
    const url = $('.thumb a').attr('href');
    const jumlahEpisode = $('.epz').text().trim();
    const rating = $('.epztipe').text().trim();
    const tanggalTerakhirUpload = $('.newnime').text().trim();

    res.push({
      judul, slug, poster, url, jumlahEpisode, rating, tanggalTerakhirUpload
    });
  }

  return res;
};

export default getAnimeData;