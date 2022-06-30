import axios from 'axios';
import cheerio from 'cheerio';
import getFileUrl from './zippyshare.js';
import { BASEURL } from '../../config.js';

const getEpisode = async (slug) => {
  const res = await axios.get(`${BASEURL}/episode/${slug}`);
  const result = await getDownloadUrl(res.data);
  return result;
}

const getDownloadUrl = async (html) => {
  let result = [];
  const $ = cheerio.load(html);
  const downloadUrlEls = $('.download ul li')?.toString()
  .split('</li>')
  .filter(item => item.trim() !== '')
  .map(item => `${item}</li>`);

  if (!downloadUrlEls) return undefined;
  
  const mp4 = [];
  const mkv = [];
  for (const el of downloadUrlEls) {
    const $ = cheerio.load(el);
    const resolusi = $('strong').text();
    if ($('a:first').text()?.trim() !== 'ZippyShare') {
      result.push({
        resolusi,
        downloadUrl: 'Tidak tersedia'
      });
    } else {
      const downloadUrl = await getFileUrl($('a:first').attr('href'));
      if (resolusi.startsWith('Mp4')) {
        mp4.push({
          resolusi,
          downloadUrl  
        });
      } else {
        mkv.push({
          resolusi,
          downloadUrl  
        });
      }
    }
  }

  result.push({
    mp4,
    mkv
  });

  return result;
}

export default getEpisode;
