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