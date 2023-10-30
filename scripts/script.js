const apiKEY = '19195f675238682b98a2e612b103d1f1';
const apiURL = 'https://api.openweathermap.org/data/2.5/weather';

const weatherCondion = document.querySelector('.js-display-weather-condition');
const degree = document.querySelector('.js-degree');
const weatherIcon = document.querySelector('.js-weather-icon');
const date = document.querySelector('.js-date');
const locationTitle = document.querySelector('.js-current-location-text');
const locationName = document.querySelector('.js-display-location-name');
const searchBtn = document.querySelector('.js-search-btn');
const searchBar = document.querySelector('.js-search-bar');


function fetchWeatherData(cityName){
    const url =`${apiURL}?q=${cityName}&appid=${apiKEY}&units=metric`;
    

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
            weatherIcon.src = `/img/weather-icon/${Data.weather[0].icon}.png`
            date.innerHTML = getCurrentDate();
            locationName.innerHTML = `${Data.name}, ${getCountryName(Data.sys.country)}`;

            //return console.log(Data);
        })
        .catch((error) => {
            console.error(error);
        });
}


searchBtn.addEventListener('click', (event) => {
    event.preventDefault();
    fetchWeatherData(searchBar.value);
});


searchBar.addEventListener('keydown', (key) => {
    if(key.code === 'Enter'){
        fetchWeatherData(searchBar.value);
    }
});



function getCurrentDate(){
    const d = new Date();

    return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
}



function getCountryName(countryCode) {
    const regionNames = new Intl.DisplayNames(['en'], {type: 'region'});

    return regionNames.of(countryCode);
}