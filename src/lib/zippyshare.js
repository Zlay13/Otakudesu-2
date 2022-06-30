import axios from "axios";
import * as cheerio from 'cheerio';


const getHtmlContent = async (url) => {
  const res = await axios.get(url);
  return res.data;
}

const getRawDownloadURL = (html) => {
  const $ = cheerio.load(html);
  const downloadEl = $('#dlbutton~script').html();
  
  if(!downloadEl) return false;
  return downloadEl.split(';')[0]
    .replace(`document.getElementById('dlbutton').href = `, '')
    .replace(/[+]/g, '')
    .split('"')
    .map(item => item.trim())
    .filter(item => item !== '');
}

const getOriginalUrl = (html) => {
  const $ = cheerio.load(html);
  const originalUrl = $('head meta[property=og:url]').attr('content')?.replace('//', 'https://');
  return originalUrl;
}

const createDownloadURL = (originalUrl, rawURL) => {
  let num = rawURL[1];
  num = num.replace(/[()]/g, '');
  num = num.replace(/[%]/g, '');
  num = num.split(' ').filter(item => item != '');
  const prefix = `https://${originalUrl.split('/')[2]}`;
  return `${prefix}${rawURL[0]}${parseInt(num[0]) % parseInt(num[1]) + parseInt(num[2]) % parseInt(num[3])}${rawURL[2]}`;
}

const getFileUrl = async (url) => {
  const html = await getHtmlContent(url);
  const originalUrl = getOriginalUrl(html);
  const rawDownloadUrl = getRawDownloadURL(html);
  const fileUrl = createDownloadURL(originalUrl, rawDownloadUrl);
  return fileUrl;
}

export default getFileUrl;
