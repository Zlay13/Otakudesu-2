import cheerio from 'cheerio';

export const mapGenres = (html) => {
  let result = [];
  const genres = html
  .split('</a>')
  .filter(item => item.trim() !== '')
  .map(item => `${item}</a>`);

  for (const genre of genres) {
    const $ = cheerio.load(genre);
    result.push({
      genre: $('a').text(),
      url: $('a').attr('href')
    });
  }

  return result;
}

export const splitAnimeEls = (html) => {
  const $ = cheerio.load(html);

  const animes = $('.detpost')
  .toString()
  .split('<div class="detpost">')
  .filter(item => item.trim() !== '')
  .map(item => `<div class="detpost">${item}`);

  return  animes;
};

export const scrapeAnimeData = (animes, type = 'ongoing') => {
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

    if (type === 'ongoing') {
      res.push({
        judul, slug, poster, url, episodeTerbaru, hariUpload, tanggalTerakhirUpload
      });
    } else {
      res.push({
        judul,
        slug,
        poster,
        url,
        jumlahEpisode: episodeTerbaru,
        rating: hariUpload,
        tanggalTerakhirUpload
      });
    }
  }
  return res;
}