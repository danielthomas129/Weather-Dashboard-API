let searchBtn = $(".searchBtn");
let searchInput = $(".searchInput");

// Left column locations
let cityNameEl = $(".cityName");
let currentDateEl = $(".currentDate");
let weatherIconEl = $(".weatherIcon");
let searchHistoryEl = $(".historyItems");

// Right column locations
let tempEl = $(".temp");
let humidityEl = $(".humidity");
let windSpeedEl = $(".windSpeed");
let uvIndexEl = $(".uvIndex");
let cardRow = $(".card-row");

// check if local storage has data
let currentSearchHistory = JSON.parse(localStorage.getItem('searchHistory')) || []


function loadLocalStorage() {
// add data from local storage to search history display
    searchHistoryEl.empty()
    for (let i = 0; i < currentSearchHistory.length; i++) {
        let newCityEl = $("<h1>").text(currentSearchHistory[i]);
        searchHistoryEl.append(newCityEl);
    }
}



function getWeather(cityName) {

    let currentDate = moment().format('MM/DD/YYYY')

    let apiKey = "ac467b251ab4fbd40be9e5a1cfe02e06";
    let searchUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;

    // add to search history
    let newCityEl = $("<h1>").text(cityName);
    searchHistoryEl.append(newCityEl);

    // check to see if cityName is already in storage
    let isCityExist = false;
    currentSearchHistory.forEach(city => {
        if(city === cityName) {
            isCityExist = true;
        }
    })

    // push new city to current search history
    if(!isCityExist){
        currentSearchHistory.push(cityName)
    }

    // do setItem for local storage
    localStorage.setItem("searchHistory", JSON.stringify(currentSearchHistory))

    // API Call and Current Weather display
    $.ajax({
        url: searchUrl,
        method: 'GET'
    }).then(response => {
        console.log(response);

        cityNameEl.text(response.name + " (" + currentDate + ")")
        tempEl.text('Temperature: ' + response.main.temp)
        windSpeedEl.text('Wind Speed: ' + response.wind.speed)
        humidityEl.text('Temperature: ' + response.main.humidity)

    })

    loadLocalStorage();
}

searchBtn.on('click', function() {
    let searchCity = searchInput.val();
    
    getWeather(searchCity)
})


searchHistoryEl.on('click', 'h1', function() {
    getWeather($(this).text())
})

loadLocalStorage();