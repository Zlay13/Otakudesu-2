import express from 'express';
import otakudesu from '../src/otakudesu.js';

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const searchAnimeHandler = async (req, res) => {
  const { keyword } = req.params;
  let result;
  try {
    result = await otakudesu.searchAnime(keyword);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 'Error',
      message: 'Internal server error'
    });
  }

  return res.status(200).json({
    status: 'Ok',
    data: {
      result
    }
  });
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const singleAnimeHandler = async (req, res) => {
  const { slug } = req.params;
  let downloadUrls;
  try {
    downloadUrls = await otakudesu.singleAnime(slug);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 'Error',
      message: 'Internal server error'
    });
  }

  if (!downloadUrls) return res.status(404).json({
    status: 'Error',
    message: 'Anime tidak ditemukan periksa kembali parameter yang kamu berikan!'
  });

  return res.status(200).json({
    status: 'Ok',
    data: {
      downloadUrls
    }
  });
}

/*
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const episodeHandler = async (req, res) => {
  const { slug } = req.params;
  let data;
  try {
    data = await otakudesu.getEpisode(slug);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 'Error',
      message: 'Internal server error'
    });
  }

  if (!data) return res.status(404).json({
    status: 'Error',
    message: 'Data tidak ditemukan periksa kembali parameter yang kamu berikan!'
  });

  return res.status(200).json({
    status: 'Ok',
    data
  });
}


export default {
  searchAnimeHandler, singleAnimeHandler, episodeHandler
};
