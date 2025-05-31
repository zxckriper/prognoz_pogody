const apiKey = "25324c8224a28a2b23fdb35ce923947e";
const baseUrl = "https://api.openweathermap.org/data/2.5";
const iconUrl = "https://openweathermap.org/img/wn/";

const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search-btn");
const cityName = document.querySelector("#city-name");
const dateTime = document.querySelector("#date-time");
const weatherIcon = document.querySelector("#weather-icon");
const temperature = document.querySelector("#temperature");
const weatherDescription = document.querySelector("#weather-description");
const feelsLike = document.querySelector("#feels-like");
const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#wind-speed");
const pressure = document.querySelector("#pressure");
const forecast = document.querySelector("#forecast");

searchBtn.addEventListener("click",function(){
    handleInput();
});

cityInput.addEventListener("keydown",function(event){
    if(event.key == "Enter"){
        handleInput();
    }
    
});

function handleInput(){
    let city = cityInput.value.trim();

    if(city){
        getCurrentWeather(city);
    }
}


async function getCurrentWeather(city){
    try{
        let response = await fetch(`${baseUrl}/weather?q=${city}&appid=${apiKey}&units=metric&lang=ru`);
        if (!response.ok) {
            if(response.status == 404) {
                alert("город не найден. проверьте ошибки");
            }
            else{
                alert("произошла ошибка при получении данных о погоде");
            }
            return;

        }
        let data = await response.json();
        updateWeatherUI(data);
        console.log(data);


    }

    catch(error){
        console.log("ошибка"+error);
        alert("произошла ошибка"+  error);
    }

}

async function getForecast(city){
    try{
        let response = await fetch(`${baseUrl}/forecast?q=${city}&appid=${apiKey}&units=metric&lang=ru`);
        if (!response.ok) {
            if(response.status == 404) {
                alert("город не найден. проверьте ошибки");
            }
            else{
                alert("произошла ошибка при получении данных о погоде");
            }
            return;

        }
        let data = await response.json();
        updateForecastUI(data);
        // console.log(data);


    }

    catch(error){
        console.log("ошибка"+error);
        alert("произошла ошибка"+  error);
    }

}

function updateForecastUI(data) {
    let forecasts = [];

    for (const item of data.list) {
        // console.log(item);

        let time = item.dt_txt.split(" ")[1].split(":")[0];
        if(time == "12"){
            forecasts.push(item);
        }

        if(forecasts.length == 5){
            break;
        }
    }

    for (const item of forecasts) {
        console.log(item);
        let year = item.dt_txt.split(" ")[0].split("-")[0];
        let month = item.dt_txt.split(" ")[0].split("-")[1] - 1;
        let day = item.dt_txt.split(" ")[0].split("-")[2];
        let dateOption = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',};
        let weekDay = new Date(year, month, day).toLocaleDateString('ru-RU', dateOption).split(",")[0];
        console.log(weekDay);
        
        let block = document.createElement("div");
        block.classList.add("block");
        block.innerHTML = `
        <div class="left">
            <div class="week-day">${weekDay}</div>
            <img class="icon" src="${iconUrl + item.weather[0].icon}@4x.png" alt="">
        </div>
        <p class="temp">${Math.round(item.main.temp)}°</p>
        `;

        forecast.append(block);
    }
    
}

function updateWeatherUI(data){
    cityName.textContent = data.name + ","+ data.sys.country;
    let dateOption = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',};
    dateTime.textContent = new Date().toLocaleDateString('ru-RU', dateOption);
    // let icon = data.weather[0].icon;
    // weatherIcon.src = iconUrl + icon + "@4x.png";

    temperature.textContent = Math.round(data.main.temp) + "°";

    weatherDescription.textContent = data.weather[0].description;

    feelsLike.textContent = Math.round(data.main.feels_like) + "°";

    humidity.textContent = Math.round(data.main.humidity) + "%";

    pressure.textContent = Math.round(data.main.pressure) + " кпа";

    windSpeed.textContent = Math.round(data.wind.speed) + " мс";

    let main = data.weather[0].main;

    if(main == "Thunderstorm" || main == "Drizzle" || main == "Rain"){
        document.body.style.background = "linear-gradient(53deg,rgba(71, 80, 97, 1) 0%, rgba(123, 123, 141, 1) 32%, rgba(62, 73, 99, 1) 89%)";
        document.documentElement.style.setProperty("--text-title", "rgba(71, 80, 97, 1)");
        document.documentElement.style.setProperty("--text-paragraph", "rgba(71, 80, 97, 1)");
    }
    else if(main == "Snow"){
        document.body.style.background = "linear-gradient(0deg,rgba(255, 255, 255, 1) 25%, rgba(7, 85, 255, 1) 100%)";
        document.documentElement.style.setProperty("--text-title", "rgb(70, 76, 78)");
        document.documentElement.style.setProperty("--text-paragraph", "rgb(70, 76, 78)");
    }
    else if(main == "Atmosphere"){
        document.body.style.background = "linear-gradient(0deg,rgba(255, 255, 255, 1) 0%, rgba(130, 130, 130, 1) 100%)";
        document.documentElement.style.setProperty("--text-title", "rgb(33, 33, 33)");
        document.documentElement.style.setProperty("--text-paragraph", "rgb(34, 34, 34)");
    }
    else if(main == "Clear"){
        document.body.style.background = "  linear-gradient(43deg,rgba(0, 111, 156, 1) 0%, rgba(169, 193, 209, 1) 100%)";
        document.documentElement.style.setProperty("--text-title", "rgb(28, 72, 90)");
        document.documentElement.style.setProperty("--text-paragraph", "rgb(28, 72, 90)");
    }
    else if(main == "Clouds"){
        document.body.style.background = "linear-gradient(0deg,rgba(166, 166, 166, 1) 0%, rgba(105, 105, 105, 1) 100%)";
        document.documentElement.style.setProperty("--text-title", "rgb(45, 45, 45)");
        document.documentElement.style.setProperty("--text-paragraph", "rgb(45, 45, 45)");
    }


}

getCurrentWeather("Ставрополь")
getForecast("Ставрополь")


// "linear-gradient(29deg,rgb(28, 72, 90) 5%, rgb(60, 126, 146) 49%, rgb(255, 255, 255) 100%)"

// "rgb(70, 76, 78)");