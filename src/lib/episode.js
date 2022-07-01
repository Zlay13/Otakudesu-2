import axios from 'axios';
import cheerio from 'cheerio';
import { BASEURL } from '../../config.js';

const getEpisodeData = async (slug) => {
  const res = await axios.get(`${BASEURL}/episode/${slug}`);
  const $ = cheerio.load(res.data);
  const episode = getEpisodeTitle($);
  const streamUrl = getStreamUrl($);
  const downloadUrls = createDownloadData($);
  const previousEpisode = getPrevEpisode($);
  const nextEpisode = getNextEpisode($);
  const anime = getAnimeData($);
  
  if (!episode) return undefined;

  return {
    episode,
    anime,
    previousEpisode,
    nextEpisode,
    streamUrl,
    downloadUrls,
  };
};

const getEpisodeTitle = ($) => {
  return $('.venutama .posttl').text();
};

const getStreamUrl = ($) => {
  return $('#pembed iframe').attr('src');
};

const createDownloadData = ($) => {
  const mp4 = getMp4DownloadUrls($);
  const mkv = getMkvDownloadUrls($);
  return {
    mp4,
    mkv,
  };
};

const getMp4DownloadUrls = ($) => {
  const result = [];
  const mp4DownloadEls = $('.download ul:first li')
    .toString()
    .split('</li>')
    .filter((item) => item.trim() !== '')
    .map((item) => `${item}</li>`);

  for (const el of mp4DownloadEls) {
    const $ = cheerio.load(el);
    const urls = $('a')
      .toString('')
      .split('</a>')
      .filter((item) => item.trim() !== '')
      .map((item) => `${item}</a>`);
    const links = [];

    for (const url of urls) {
      const $ = cheerio.load(url);
      links.push({
        provider: $('a').text(),
        url: $('a').attr('href'),
      });
    }
    result.push({
      resolusi: $('strong').text()?.replace('Mp4 ', ''),
      links,
    });
  }

  return result;
};

const getMkvDownloadUrls = ($) => {
  const result = [];
  const mp4DownloadEls = $('.download ul:last li')
    .toString()
    .split('</li>')
    .filter((item) => item.trim() !== '')
    .map((item) => `${item}</li>`);

  for (const el of mp4DownloadEls) {
    const $ = cheerio.load(el);
    const urls = $('a')
      .toString('')
      .split('</a>')
      .filter((item) => item.trim() !== '')
      .map((item) => `${item}</a>`);
    const links = [];

    for (const url of urls) {
      const $ = cheerio.load(url);
      links.push({
        provider: $('a').text(),
        url: $('a').attr('href'),
      });
    }
    result.push({
      resolusi: $('strong').text()?.replace('Mkv ', ''),
      links,
    });
  }

  return result;
};

const getPrevEpisode = ($) => {
  if (!$('.flir a:first').attr('href')?.startsWith('https://otakudesu.watch/episode/')) return null;

  return {
    slug: $('.flir a:first').attr('href')?.replace('https://otakudesu.watch/episode/', '')?.replace('/', ''),
    url: $('.flir a:first').attr('href'),
  };
};

const getNextEpisode = ($) => {
  if (!$('.flir a:last').attr('href')?.startsWith('https://otakudesu.watch/episode/')) return null;

  return {
    slug: $('.flir a:last').attr('href')?.replace('https://otakudesu.watch/episode/', '')?.replace('/', ''),
    url: $('.flir a:last').attr('href'),
  };
};

const getAnimeData = ($) => {
  if ($('.flir a:nth-child(3)').text().trim() === '' || $('.flir a:nth-child(3)').text() === undefined) {
    return {
      slug: $('.flir a:first').attr('href')?.replace('https://otakudesu.watch/anime/', '')?.replace('/', ''),
      url: $('.flir a:first').attr('href'),
    };
  }

  return {
    slug: $('.flir a:nth-child(2)').attr('href')?.replace('https://otakudesu.watch/anime/', '')?.replace('/', ''),
    url: $('.flir a:nth-child(2)').attr('href'),
  };
};

export default getEpisodeData;
