const { decryptMedia } = require('@open-wa/wa-automate');
const axios = require('axios');
const voiceUrl = require('./voice');
const quran = require('./quran');
const makequotes = require('./makequote');
const brainly = require('./brainly');
const youtubeMusic = require('./youtube');
const { facebook, twitter, instagram } = require('./socialmedia');
const lyrics = require('./lyrics');
const wiki = require('./wikipedia');

const bucin = async () => {
  const fetch = await axios.get('https://api-hell.vercel.app/api/bucin');
  const data = fetch.data.result;
  return data.kata;
};

const short = async (link) => {
  const APIURL = `https://cutt.ly/api/api.php?key=72beacce144734333514216ee6d81595a3388&short=${link}`;
  const { data } = await axios.get(APIURL);
  const status = data.url.status;
  if (status !== 7) return '⚠️ Make sure you entered URL/Link';
  return `🔗 *${data.url.shortLink}* | *${data.url.title}*`;
};

const covid = async (country = null) => {
  const path = country ? `countries/${country}` : '';
  const APIURL = `https://covid19.mathdro.id/api/${path}`;
  const { data } = await axios.get(APIURL);
  if (data.error) return undefined;
  return `_🌏 Covid data ${country ? country.toLowerCase() : 'Worldwide'}_\n\n_Confirmed : ${data.confirmed.value}_\n_Recovered : ${data.recovered.value}_\n_Death : ${data.deaths.value}_\n\n_Wear Masks to Stay Safe!_`;
};

const cat = async () => {
  const APIURL = `https://api.thecatapi.com/v1/images/search`;
  const { data } = await axios.get(APIURL);
  const picUrl = data[0].url;
  if (!picUrl) return undefined;
  return picUrl;
};

const dog = async () => {
  const APIURL = `https://dog.ceo/api/breeds/image/random`;
  const { data } = await axios.get(APIURL);
  const picUrl = data.message;
  if (!picUrl) return undefined;
  return picUrl;
};

const meme = async () => {
  const APIURL = `https://meme-api.herokuapp.com/gimme`;
  const { data } = await axios.get(APIURL);
  const picUrl = data.url;
  if (!picUrl) return undefined;
  const ext = picUrl.replace(/(.*)\./g, '');
  return { picUrl, ext };
};

const anime = async (title) => {
  const APIURL = `https://api.jikan.moe/v3/search/anime?q=${title}`;
  const { data } = await axios.get(APIURL);
  const result = data.results[0];
  const picUrl = result.image_url.replace(/\?(.*)/g, '');
  const caption = `_*Title* : ${result.title}_\n_*Synopsis* : ${result.synopsis}_\n_*Rated* : ${result.rated}_\n_*Score* : ${ result.score}_\n_*Link* : ${result.url}_`;
  return { picUrl, caption };
};

const tosticker = (arguments) => {
  const phrase = arguments.map((result, index) => `${result}${index !== 0 && (index + 1) % 3 === 0 ? '%0A' : '%20'}` ).join('');
  const APIURL = `https://raterian.sirv.com/New%20Project.png?text.0.text=${phrase}&text.0.position.y=-50%25&text.0.color=000000&text.0.font.family=Poppins&text.0.font.weight=600&text.0.outline.color=ffffff&text.0.outline.width=5`;
  return APIURL;
};

const imgquote = async () => {
  const { data } = await axios.get('https://inspirobot.me/api?generate=true');
  return data;
};

const weather = async (city) => {
  const API_KEY = 'f70fc7b25b88688986ee23eef10b2ab9';
  const APIURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
  const { data } = await axios.get(APIURL);

  switch (parseInt(data.cod)) {
    case 404:
      return `_⚠️ City not found_`;
    case 200:
      return `_*City* : ${data.name}, ${data.sys.country}_\n_*Coordinates* -_\n_--- Latitude : ${data.coord.lat}_\n_-- - Longitude : ${data.coord.lon}_\n_*Wind speed* : ${data.wind.speed}m/s W_\n_*Weather : ${data.weather[0].main} | ${data.weather[0].description}*_\n_*Temperature :* ${(data.main.temp - 273, 15)}_`;
    default:
      return `_There was an error on the server!_`;
  }
};

const movie = async (params) => {
  const API_KEY = 'e03a86fd';
  const APIURL = `http://www.omdbapi.com/?apikey=${API_KEY}&t=${params}`;
  const { data } = await axios.get(APIURL);
  const response = data.Response === 'True';
  if (!response) return undefined;
  const moviePicture = data.Poster;
  const movieCaption = `_*Title* : ${data.Title}_\n_*Year* : ${data.Year}_\n_*Rating* : ${data.Rated}_\n_*Release* : ${ data.Released}_\n_*Duration* : ${data.Runtime}_\n_*Genre* : ${data.Genre}_\n_*Director* : ${data.Director}_\n_*Author* : ${data.Writer}_\n_*Actor* : ${data.Actors}_\n_*Language/Country* : ${data.Language}/${data.Country}_\n_*Awards* : ${ data.Awards}_\n_*Website* : ${data.Website}_\n`;
  return { moviePicture, movieCaption };
};

module.exports = {
  voiceUrl,
  quran,
  makequotes,
  brainly,
  bucin,
  youtubeMusic,
  facebook,
  lyrics,
  short,
  covid,
  cat,
  dog,
  meme,
  anime,
  tosticker,
  wiki,
  imgquote,
  weather,
  movie,
};