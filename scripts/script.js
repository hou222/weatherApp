import { apiKEY } from "./config.js";
const apiURL = 'https://api.openweathermap.org/data/2.5/weather';
const dailyApiURL = 'https://api.openweathermap.org/data/2.5/forecast';


const weatherCondion = document.querySelector('.js-display-weather-condition');
//const dailyWeatherCondition = document.querySelector('.js-slides-weather');
const degree = document.querySelector('.js-degree');
//const dailyDegree = document.querySelector('.js-slides-degree');
const weatherIcon = document.querySelector('.js-weather-icon');
//const dailyWeatherIcon = document.querySelector('.js-daily-weather-icon');
const date = document.querySelector('.js-date');
const locationTitle = document.querySelector('.js-current-location-text');
const locationName = document.querySelector('.js-display-location-name');
const searchBtn = document.querySelector('.js-search-btn');
const searchBar = document.querySelector('.js-search-bar');
const slide = document.querySelector('.slides');
const leftArrow = document.querySelector('.js-left-arrow');
const rightArrow = document.querySelector('.js-right-arrow');
const displaySmallInfo = document.querySelector('.weatehr-descrition');
const leftContainer = document.querySelector('.left');
const rightContainer = document.querySelector('.right');
const backgroundImage = document.querySelector('.left-image');
let indexSlide = 0;


function fetchWeatherData(cityName){
    const url =`${apiURL}?q=${cityName}&appid=${apiKEY}&units=metric`;
    let timestamp;
    

    fetch(url) 
        .then((response) => {
            if(!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((Data) => {
            weatherCondion.innerHTML = Data.weather[0].description;
            degree.innerHTML = `${Math.round(Data.main.temp)}°`;
            weatherIcon.src = `/img/weather-icon/${Data.weather[0].icon}.png`;
            timestamp = Data.dt;
            date.innerHTML = getDate(timestamp);

            locationName.innerHTML = `${Data.name}, ${getCountryName(Data.sys.country)}`;

            //return console.log(Data);
        })
        .catch((error) => {
            console.error(error);
        });
}

function fetchDailyWeatherData (cityName) {
    const url = `${dailyApiURL}?q=${cityName}&appid=${apiKEY}&units=metric`;
    
    

    fetch(url)
        .then((response) => {
          return  response.json();
        })
        .then((data) => {
            let previousDate = date.innerHTML;
            let time = '09:00:00';
            let c = 1;
            for(let i = 0; i < 40; i++) {
                const timestamp = data.list[i].dt;
                const weatherTime = data.list[i].dt_txt.split(' ')[1];
                
                
                //console.log(date.innerHTML);

                if((getDate(timestamp) !== previousDate) && (time === weatherTime)){
                const dailyWeatherCondition = document.querySelector(`.js-daily-weather-info${c} .js-slides-weather`);
                const dailyDegree = document.querySelector(`.js-daily-weather-info${c} .js-slides-degree`);
                const dailyWeatherIcon = document.querySelector(`.js-daily-weather-info${c} .js-daily-weather-icon`);
                const dailyDate = document.querySelector(`.js-daily-weather-info${c} .js-slides-date`);
                

                
                dailyDegree.innerHTML = `${Math.round(data.list[i].main.temp)}°`;
                dailyWeatherCondition.innerHTML = `${data.list[i].weather[0].main}`;
                dailyWeatherIcon.src = `/img/weather-icon/${data.list[i].weather[0].icon}.png`;
                dailyDate.innerHTML = getDate(timestamp);
                previousDate = getDate(timestamp);
                //console.log(weatherTime);
                //console.log(c); 
                c++;
            }
            }

            console.log(data);
        })
        .catch((error) => {

         console.error(error);
        });
}


searchBtn.addEventListener('click', (event) => {
    event.preventDefault();
    fetchWeatherData(searchBar.value);
    dailyContainer();
    fetchDailyWeatherData(searchBar.value);
});


searchBar.addEventListener('keydown', (key) => {
    
    if(key.code === 'Enter'){
        fetchWeatherData(searchBar.value);
        dailyContainer();
        fetchDailyWeatherData(searchBar.value);
        leftContainer.style.width = '60%';
        rightContainer.style.width = '40%';

        leftContainer.style.borderTopRightRadius = '30px';
        leftContainer.style.borderBottomRightRadius = '30px';
        backgroundImage.style.borderTopRightRadius = '30px';
        backgroundImage.style.borderBottomRightRadius = '30px';
    }
});


function getDate(timestamp){
    const date = new Date(timestamp * 1000);
    return date.toDateString();
}


function getCountryName(countryCode) {
    const regionNames = new Intl.DisplayNames(['en'], {type: 'region'});

    return regionNames.of(countryCode);
}

rightArrow.addEventListener('click', () => {
    const clickStop = slide.children.length - 2;

    if(clickStop > Math.abs(indexSlide)) {
        indexSlide--;
        show();
    }

    
    if (clickStop === Math.abs(indexSlide)) {
        rightArrow.style.color = 'rgb(155, 155, 155)';
        rightArrow.style.cursor = 'auto'; 
       } 

         
    if(indexSlide < 0) {
        leftArrow.style.color = '#000';
        leftArrow.style.cursor = 'pointer';       
       }
});

leftArrow.addEventListener('click', () => {
    rightArrow.style.color = '#000';
        rightArrow.style.cursor = 'pointer';  
    
    if (indexSlide < 0) {
        indexSlide++;
        show();
        if(indexSlide === 0) {
            leftArrow.style.color = 'rgb(155, 155, 155)';
            leftArrow.style.cursor = 'auto';     
        }
    }
});

function show(){
       slide.style.transform = `translateX(${indexSlide * (slide.children[0].offsetWidth + 25)}px)`;
}

function dailyContainer() {
    const slides = document.querySelector('.js-slides');
    slides.innerHTML = '';

    for(let i = 1; i < 6; i++){
        const html = `  <div class="js-daily-weather-info${i} daily-weather-info">
                            <p class="js-slides-degree slides-degree">12°</p>
                            <div class="weather-description">
                                <p class="js-slides-weather slides-weather">Cloudy</p>
                                <img class="js-daily-weather-icon" src="" alt="cloudy">
                            </div>
                            <p class="js-slides-date slides-date">Mon 24, July '20</p>
                        </div>`;


        slides.innerHTML += html;
    }

    
}