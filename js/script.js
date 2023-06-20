import playList from "./playList.js";


const timeElement = document.getElementById('time');
const dateElement = document.getElementById('date');
const greetingElement = document.getElementById('greeting');
const inputElement = document.getElementById('input');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const cityInput = document.getElementById('cityInput');
const weatherInfo = document.getElementById('weatherInfo');
const weatherIcon = document.getElementById('weatherIcon');
const weatherError = document.getElementById('weatherError');
const weatherTemp = document.getElementById('weatherTemp');
const weatherDesc = document.getElementById('weatherDesc');
const wind = document.getElementById('wind');
const humidity = document.getElementById('humidity');
const cityInputForm = document.getElementById('cityInputForm');
const quoteText = document.getElementById('quote');
const quoteAuthor = document.getElementById('author');
const changeQuoteButton = document.getElementById('changeQuote');
const playPrevBtn = document.getElementById('playPrevBtn');
const playBtn = document.getElementById('playBtn');
const playNextBtn = document.getElementById('playNextBtn');
const audio = document.getElementById('audio');
const playListContainer = document.getElementById('playList');
const trackTitle = document.getElementById('trackTitle');
const trackProgress = document.getElementById('trackProgress');
const trackLimit = document.getElementById('trackLimit');
const trackLimitWidth = trackLimit.offsetWidth;
const trackTimer = document.getElementById('trackTimer');
const trackDuration = document.getElementById('trackDuration');
const muteBtn = document.getElementById('muteBtn');
const soundVolume = document.getElementById('soundVolume');
const langSelector = document.getElementById('lang-select');

const localization = {};
let selectedLang = 'en';
let isPlay = false;

const REPOSITORY_LINK = 'https://raw.githubusercontent.com/nataliamoiseenko/stage1-tasks/assets/images';
const WEATHER_API_KEY = '492003bfd44fb7dbe75df7d92a5e55d1';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const initTimer = () => {
  setInterval(() => {
    setTime();
  }, 1000);
};

const setTime = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const secs = now.getSeconds();
  const month = now.getMonth();
  const date = now.getDate();
  const day = now.getDay();
  const formattedHours = hours < 10 ? '0' + hours : hours;
  const formattedMins = minutes < 10 ? '0' + minutes : minutes;
  const formattedSecs = secs < 10 ? '0' + secs : secs;

  timeElement.innerHTML = `${formattedHours}:${formattedMins}:${formattedSecs}`;
  dateElement.innerHTML = `${localization[selectedLang].week[day]}, ${localization[selectedLang].months[month]} ${date}`;
};

const formatNumber = number => number < 10 ? '0' + number : '' + number;

const greetings = () => {
  const hours = new Date().getHours();
  const randomPicNumber = Math.floor(Math.random() * 20 + 1);
  const formattedPicNumber = formatNumber(randomPicNumber);
  switch(true) {
    case hours < 6:
      greetingElement.innerHTML = localization[selectedLang].greeting_night;
      document.body.setAttribute('data-daytime', 'night');
      document.body.style.background = `url(${REPOSITORY_LINK}/night/${formattedPicNumber}.jpg)`
      break;
    case hours < 12:
      greetingElement.innerHTML = localization[selectedLang].greeting_morning;
      document.body.setAttribute('data-daytime', 'morning');
      document.body.style.background = `url(${REPOSITORY_LINK}/morning/${formattedPicNumber}.jpg)`
      break;
    case hours < 18:
      greetingElement.innerHTML = localization[selectedLang].greeting_afternoon;
      document.body.setAttribute('data-daytime', 'afternoon');
      document.body.style.background = `url(${REPOSITORY_LINK}/afternoon/${formattedPicNumber}.jpg)`
      break;
    default:
      greetingElement.innerHTML = localization[selectedLang].greeting_evening;
      document.body.setAttribute('data-daytime', 'evening');
      document.body.style.background = `url(${REPOSITORY_LINK}/evening/${formattedPicNumber}.jpg)`
      break;
  }

  document.body.setAttribute('data-pic', randomPicNumber);

  const savedName = localStorage.getItem('momentum_name');
  if (savedName) inputElement.value = savedName;
};

const switchBackground = direction => {
  const currentPicNumber = document.body.getAttribute('data-pic');
  const daytime = document.body.getAttribute('data-daytime');
  let nextPicNumber;
  if (direction === 'next') {
    nextPicNumber = currentPicNumber === '20' ? '1': +currentPicNumber + 1;
  } else {
    nextPicNumber = currentPicNumber === '1' ? '20': +currentPicNumber - 1;
  }
  document.body.style.background = `url(${REPOSITORY_LINK}/${daytime}/${formatNumber(nextPicNumber)}.jpg)`;
  document.body.setAttribute('data-pic', nextPicNumber);
};

const fetchAndUpdateWeather = async (cityName) => {
  const url = `${WEATHER_API_URL}?q=${cityName}&lang=en&appid=${WEATHER_API_KEY}&units=metric`;
  const data = await fetch(url);
  const result = await data.json();
  if (!result.weather) {
    weatherError.innerHTML = 'Error! City is not found';
    weatherInfo.style.display = 'none';
  } else {
    weatherError.innerHTML = '';
    weatherInfo.style.display = 'block';
    weatherIcon.classList.add(`owf-${result.weather[0].id}`);
    weatherTemp.textContent = `${Math.round(result.main.temp)}°C`;
    weatherDesc.textContent = result.weather[0].description;
    wind.textContent = `Wind speed: ${Math.round(result.wind.speed)} m/s`;
    humidity.textContent = `Humidity: ${Math.round(result.main.humidity)} %`;
    localStorage.setItem('momentum_city', cityName);
  }
};

const setWeather = () => {
  const savedCity = localStorage.getItem('momentum_city');
  if (savedCity) {
    cityInput.value = savedCity;
  } else cityInput.value = 'Minsk';

  fetchAndUpdateWeather(cityInput.value);
};

const citySubmit = (event) => {
  event.preventDefault();
  const city = cityInput.value;

  fetchAndUpdateWeather(city);
};

const getRandomQuote = async () => {
  const quotes = localization[selectedLang].quotes;
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  quoteText.innerText = randomQuote.text;
  quoteAuthor.innerText = randomQuote.author;
};

const handleTrackInfo = (trackParams) => {
  trackTitle.innerText = trackParams.title;
  trackDuration.innerText = `/ ${trackParams.duration}`;
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const formatedMinutes = (minutes >= 10) ? minutes : "0" + minutes;
  const secondsLeft = Math.floor(seconds % 60);
  const formatedSeconds = (secondsLeft >= 10) ? seconds : "0" + seconds;

  return formatedMinutes + ":" + formatedSeconds;
};

const handleTimeUpdate = () => {
  trackProgress.style.width = `${audio.currentTime / audio.duration * 100}%`;
  trackTimer.innerText = formatTime(Math.floor(audio.currentTime));
};

const markAudioItemActive = (index) => {
  const items = document.querySelectorAll('.play-item');
  items.forEach(item => item.classList.remove('item-active'));
  items.forEach(item => item.classList.remove('paused'));
  items[index].classList.add('item-active');
  if (!isPlay) items[index].classList.add('paused');
  };

const playTrackByIndex = (index) => {
  audio.src = playList[index].src;
  audio.play();
  playBtn.classList.add('pause');
  isPlay = true;
  audio.setAttribute('data-num', index);
  markAudioItemActive(index);
  handleTrackInfo(playList[index]);
}

const playPrevAudio = () => {
  let prevTrackIndex = Number(audio.getAttribute('data-num')) - 1;
  if (prevTrackIndex === -1) prevTrackIndex = playList.length - 1;

  playTrackByIndex(prevTrackIndex);
};

const playAudio = () => {
  const index = Number(audio.getAttribute('data-num'));
  isPlay ? audio.pause() : audio.play();

  playBtn.classList.toggle('pause');
  isPlay = !isPlay;
  markAudioItemActive(index);
};

const playNextAudio = () => {
  let nextTrackIndex = Number(audio.getAttribute('data-num')) + 1;
  if (nextTrackIndex === playList.length) nextTrackIndex = 0;

  playTrackByIndex(nextTrackIndex);
};

const initPlaylist = () => {
  playList.forEach((element, index) => {
    const li = document.createElement('li');
    li.classList.add('play-item');
    li.setAttribute('data-index', index);
    li.innerText = element.title;
    playListContainer.append(li);

    if (index === 0) {
      audio.src = element.src;
      audio.setAttribute('data-num', index);
      handleTrackInfo(playList[index]);
    }

    li.addEventListener('click', (event) => {
      const element = event.target;
      const liIndex = element.getAttribute('data-index');
      const activeIndex = audio.getAttribute('data-num');
      if (isPlay) {
        if (liIndex === activeIndex) {
          element.classList.add('paused');
          audio.pause();
          playBtn.classList.toggle('pause');
          isPlay = !isPlay;
        } else {
          playTrackByIndex(liIndex);
          element.classList.add('item-active');
        }
      } else playTrackByIndex(liIndex);
    });
  });
};

const onMuteClick = () => {
  audio.muted = !audio.muted;
  muteBtn.classList.toggle('muted');
};

const handleSoundVolumeChange = (event) => {
  const value = +event.target.value;
  audio.volume = value;
  if (value === 0) {
    muteBtn.classList.add('muted');
  } else if (muteBtn.classList.contains('muted') && value > 0) {
    muteBtn.classList.remove('muted');
  }
};

const handleProgressClick = (event) => {
  const clickedProgress = event.offsetX / trackLimitWidth;
  audio.currentTime = Math.round(clickedProgress * audio.duration);
};

const updatePageLocalization = (langObject) => {
  inputElement.placeholder = langObject.placeholder;
  greetings();
  getRandomQuote();

  const langOptionElements = document.querySelectorAll('option');
  Array.from(langOptionElements).map(el => {
    el.innerText = langObject.lang_options[el.value];
  });
};

const langSelect = async () => {
  selectedLang = langSelector.value;
  if (!localization[selectedLang]) {
    const data = await fetch(`./assets/localization/${selectedLang}.json`);
    const res = await data.json();
    localization[selectedLang] = res;
  }

  updatePageLocalization(localization[selectedLang]);
}

inputElement.oninput = e => localStorage.setItem('momentum_name', e.target.value);
prevButton.onclick = () => switchBackground('prev');
nextButton.onclick = () => switchBackground('next');
cityInputForm.addEventListener('submit', citySubmit);
changeQuoteButton.onclick = () => getRandomQuote();
playPrevBtn.onclick = () => playPrevAudio();
playBtn.onclick = () => playAudio();
playNextBtn.onclick = () => playNextAudio();
audio.addEventListener('ended', playNextAudio);
audio.addEventListener('timeupdate', handleTimeUpdate);
muteBtn.onclick = () => onMuteClick();
soundVolume.addEventListener('change', handleSoundVolumeChange);
trackLimit.addEventListener('click', handleProgressClick);
langSelector.addEventListener('change', langSelect);

await langSelect();
initTimer();
setWeather();
initPlaylist();
