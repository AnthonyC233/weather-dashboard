var apikey = "147a9340f621104b055425fa58f84df5" 

function updateForecast(lon,lat) {
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apikey)
    //&exclude={part}&appid=
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            // today view first
            replaceWeatherIcon(data.current.weather[0].icon);
            replaceDate(data.current.dt, data.timezone_offset)
            replaceTemp(data.current.temp)
            replaceUvi(data.current.uvi)
            replaceWind(data.current.wind_speed)
            replaceHumidity(data.current.humidity)
            // update main weather here:
            // city name, the date, an icon representation of weather conditions
            // the temperature, the humidity, the wind speed, and the UV index
            // conditions are favorable, moderate, or severe
            for (var i = 1; i < 6; i++) {
                updateDay(i, data)
            }
            // 5 day-forecast
            // displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
    });
}

function updateDay(dayNumber, data) {
    var dayId = "day" + dayNumber;
    var dayObject = data.daily[dayNumber]
    var timezone_offset = data.timezone_offset
    var date = dayObject.dt
    var dateString = getDateString(date, timezone_offset)
    var icon = dayObject.weather[0].icon
    var temp = dayObject.temp.day
    var wind = dayObject.wind_speed
    var humidity = dayObject.humidity
    
    // date, icon, temp, wind, humidity
    document.getElementById(dayId).innerHTML =
        "<h4>" + dateString + "</h4>" + 
        "<img src=\"https://openweathermap.org/img/wn/" + icon + ".png\"/>" +
        "<p>Temp: " + temp + "&#x2109</p>" +
        "<p>Wind: " + wind + "MPH</p>" +
        "<p>Humidity: " + humidity + "%</p>";
}


function getweatherInfo() {
    var city = $("#city-search").val();
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city +"&units=imperial&appid=" + apikey)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            replaceCityName(city)
            updateForecast(data.coord.lon, data.coord.lat);
            console.log(data)
            // search history THEN I am again presented with current and future conditions for that city
            // call addHistory with city name
    });
}

function updateHistory() {
    // removed the button you clicked
    // call getweatherinfo on the city name
}

function addHistory() {
    // add a button with value of city name
    // add on click like $("#search-btn").on('click', getweatherInfo);
}

function replaceCityName(cityName) {
    let upperCaseCityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
    document.getElementById("city-name").innerHTML = upperCaseCityName;
}

function replaceWeatherIcon(icon) {
    document.getElementById("weather-icon").src = getIconUrl(icon);
}

function getIconUrl(icon) {
    return "https://openweathermap.org/img/wn/" + icon + ".png"
}

function getDateString(dt, timezone) {
    // Date automatically adds offset based on local system, we should acccount for that.
    var systemOffset = new Date(Date.now()).getTimezoneOffset()
    var systemOffsetMillis = systemOffset * 60 * 1000;

    var date = (dt + timezone) * 1000;
    var dateObject = new Date(date + systemOffsetMillis)
    return dateObject.toLocaleDateString("en-US");
}

function replaceDate(dt, timezone) {
    var dateString = getDateString(dt, timezone)
    dateString = "(" + dateString + ")"
    document.getElementById("date").innerHTML = dateString;
}

function replaceTemp(temp) {
    document.getElementById("temp").innerHTML = temp
}

function replaceHumidity(humidity) {
    document.getElementById("humidity").innerHTML = humidity
}

function replaceWind(wind){
    document.getElementById("wind").innerHTML = wind
}

function replaceUvi(uvi) {
    var element = document.getElementById("uvi")

    element.innerHTML = uvi
    if (uvi < 3) {
        element.classList = "green uvi-span"
    } else if (uvi < 6) {
        element.classList = "yellow uvi-span"
    } else { 
        element.classList = "red uvi-span"
    }
}


$("#search-btn").on('click', getweatherInfo);
