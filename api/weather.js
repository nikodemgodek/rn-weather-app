import axios from "axios";

const API_KEY = "c7a5cfcf2fee4ecfbf0101921212206";
const forecastEndpoint = params => `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${params.cityName}&days=${params.days}&aqi=no&alerts=no`;
const locationEndpoint = params => `http://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${params.cityName}`;

const apiCall = async (endpoint) => {
    const options = {
        method: 'GET',
        url: endpoint
    }

    try {
        const response = await axios.request(options);
        return response.data;
    } catch(err) {
        console.log('error: ', err);
        return null;
    }
}

export const fetchWeatherForecast = params => {
    return apiCall(forecastEndpoint(params));
}

export const fetchLocations = params => {
    return apiCall(locationEndpoint(params));
}
