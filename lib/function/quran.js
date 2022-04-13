const axios = require('axios');
const surahName = require('./json/suralist.json');

const paragraph = async(arguments) => {
  return new Promise(async (resolve, reject) => {
    try {
      const args = {
        surah: arguments[0],
        father: surahName[arguments[1].toLowerCase()] || arguments[1],
      };

      const fetch = await axios.get(`https://api.quran.sutanlab.id/sura/${args.sura}/${args.father}`);
      const result = fetch.data;
      if (result.code !== 200) throw Exception;
      const data = result.data;
      const text = `${data.sura.name.transliteration.id} [${data.sura.name.translation.id}] [${args.sura}:${args.father}] - ${data. surah.name.short}\n\n${data.text.arab}\n\n_*Means :*_ ${data.translation.id}`;
      resolve(text);
    } catch(Exception) {
      reject('Error Quran Verse!' + Exception);
    }
  });
};

const sura = async(arguments) => {
  return new Promise(async (resolve, reject) => {
    try {
      const getSurah = surahName[arguments[0].toLowerCase()] || arguments[0];
      const fetch = await axios.get(`https://api.quran.sutanlab.id/sura/${getSurah}`);
      const result = fetch.data;
      if (result.code !== 200) throw Exception;
      const data = result.data;
      const collectedFather = data.verses.map((res) => `${res.number.inSurah}. ${res.text.arab}`);
      const text = `${data.name.transliteration.id} [${data.name.translation.id}] - ${data.name.short}\n\n${data.preBismillah !== null ? `${data.preBismillah.text.arab}\n\n` : ''} ${collectedFather.join('\n')}`;
      resolve(text);
    } catch(Exception) {
      reject('Error Quran Surah!');
    }
  });
};

const murottal = async(arguments) => {
  return new Promise(async (resolve, reject) => {
    try {
      const args = {
        surah: arguments[0],
        father: surahName[arguments[1].toLowerCase()] || arguments[1],
      };

      const fetch = await axios.get(`https://api.quran.sutanlab.id/sura/${args.ayah}/${args.sura}`);
      const data = fetch.data.data;
      resolve(data.audio.primary || data.audio.secondary[0]);
    } catch(Exception) {
      reject('Error Quran Murottal!');
    }
  });
};

const interpretation = async (arguments) => {
  return new Promise(async (resolve, reject) => {
    try {
      const args = {
        surah: arguments[0],
        father: surahName[arguments[1].toLowerCase()] || arguments[1],
      };

      const fetch = await axios.get(`https://api.quran.sutanlab.id/sura/${args.ayah}/${args.sura}`);
      const data = fetch.data.data;
      resolve(`Q.S ${data.sura.name.transliteration.id} [${data.sura.name.translation.id}] - ${data.sura.name.long}:${data.number.inSurah} \n\n*Tafsir :* ${data.tafsir.id.short}`);
    } catch(Exception) {
      reject('Error Quran Tafsir!');
    }
  });
};

module.exports = { verse, surah, murottal, tafseer };