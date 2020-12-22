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

//////get 5 day forecast

getFiveDayForecast();

    function getFiveDayForecast() {

        cardRow.empty();
        let apiKey = "ac467b251ab4fbd40be9e5a1cfe02e06";
        let searchUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityNameEl + "&appid=" + apiKey;
        $.ajax({
            url: searchUrl,
            method: 'GET'
        }).then(response => {
            console.log(response);
        })
        .then(function(fiveDayReponse) {
            for (let i = 0; i != fiveDayReponse.list.length; i+=8 ) {
                let cityObj = {
                    date: fiveDayReponse.list[i].dt_txt,
                    icon: fiveDayReponse.list[i].weather[0].icon,
                    temp: fiveDayReponse.list[i].main.temp,
                    humidity: fiveDayReponse.list[i].main.humidity
                }
                let dateStr = cityObj.date;
                let trimmedDate = dateStr.substring(0, 10); 
                let weatherIco = `https:///openweathermap.org/img/w/${cityObj.icon}.png`;
                createForecastCard(trimmedDate, weatherIco, cityObj.temp, cityObj.humidity);
            }
        })
    }   


function createForecastCard(date, icon, temp, humidity) {

    // HTML elements we will create to later
    let fiveDayCardEl = $("<div>").attr("class", "five-day-card");
    let cardDate = $("<h3>").attr("class", "card-text");
    let cardIcon = $("<img>").attr("class", "weatherIcon");
    let cardTemp = $("<p>").attr("class", "card-text");
    let cardHumidity = $("<p>").attr("class", "card-text");

    cardRow.append(fiveDayCardEl);
    cardDate.text(date);
    cardIcon.attr("src", icon);
    cardTemp.text(`Temp: ${temp} °F`);
    cardHumidity.text(`Humidity: ${humidity}%`);
    fiveDayCardEl.append(cardDate, cardIcon, cardTemp, cardHumidity);
}

