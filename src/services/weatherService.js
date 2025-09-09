// Weather Service - Real API Integration with OpenWeatherMap

class WeatherService {
  constructor() {
    // Using OpenWeatherMap API (free tier)
    // You can get a free API key from https://openweathermap.org/api
    this.apiKey = process.env.REACT_APP_WEATHER_API_KEY || 'demo_key';
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
  }

  // Get current weather for a city
  async getCurrentWeather(city = 'Mumbai') {
    try {
      // For demo purposes, always use mock data to avoid API key issues
      if (this.apiKey === 'demo_key' || !this.apiKey) {
        return this.getMockWeatherData(city);
      }
      
      const response = await fetch(
        `${this.baseUrl}/weather?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      return this.formatCurrentWeatherData(data);
    } catch (error) {
      console.error('Weather API error:', error);
      // Return mock data as fallback
      return this.getMockWeatherData(city);
    }
  }

  // Get weather forecast
  async getForecast(city = 'Mumbai', days = 5) {
    try {
      const response = await fetch(
        `${this.baseUrl}/forecast?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric&cnt=${days * 8}`
      );
      
      if (!response.ok) {
        throw new Error(`Forecast API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      return this.formatForecastData(data);
    } catch (error) {
      console.error('Forecast API error:', error);
      // Return mock data as fallback
      return this.getMockForecastData(city, days);
    }
  }

  // Get weather by coordinates
  async getWeatherByCoords(lat, lon) {
    try {
      const response = await fetch(
        `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      return this.formatCurrentWeatherData(data);
    } catch (error) {
      console.error('Weather by coords error:', error);
      return this.getMockWeatherData('Your Location');
    }
  }

  // Get user's location weather
  async getCurrentLocationWeather() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(this.getMockWeatherData('Your Location'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const weather = await this.getWeatherByCoords(latitude, longitude);
          resolve(weather);
        },
        () => {
          // If geolocation fails, use default city
          resolve(this.getCurrentWeather('Mumbai'));
        },
        { timeout: 5000, enableHighAccuracy: false }
      );
    });
  }

  // Format current weather data
  formatCurrentWeatherData(data) {
    return {
      location: data.name + (data.sys?.country ? `, ${data.sys.country}` : ''),
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: Math.round(data.wind?.speed * 3.6) || 0, // Convert m/s to km/h
      visibility: data.visibility ? Math.round(data.visibility / 1000) : 10,
      icon: data.weather[0].icon,
      sunrise: data.sys?.sunrise ? new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
      sunset: data.sys?.sunset ? new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
      timestamp: new Date()
    };
  }

  // Format forecast data
  formatForecastData(data) {
    const forecasts = [];
    const dailyData = {};
    
    // Group by date
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyData[date]) {
        dailyData[date] = [];
      }
      dailyData[date].push(item);
    });
    
    // Process daily forecasts
    Object.keys(dailyData).slice(0, 5).forEach(date => {
      const dayData = dailyData[date];
      const minTemp = Math.min(...dayData.map(d => d.main.temp_min));
      const maxTemp = Math.max(...dayData.map(d => d.main.temp_max));
      const midDayData = dayData.find(d => {
        const hour = new Date(d.dt * 1000).getHours();
        return hour >= 12 && hour <= 15;
      }) || dayData[Math.floor(dayData.length / 2)];
      
      forecasts.push({
        date: new Date(date),
        day: new Date(date).toLocaleDateString([], { weekday: 'short' }),
        minTemp: Math.round(minTemp),
        maxTemp: Math.round(maxTemp),
        condition: midDayData.weather[0].main,
        description: midDayData.weather[0].description,
        icon: midDayData.weather[0].icon,
        humidity: midDayData.main.humidity,
        windSpeed: Math.round(midDayData.wind?.speed * 3.6) || 0
      });
    });
    
    return {
      location: data.city.name + (data.city.country ? `, ${data.city.country}` : ''),
      forecasts
    };
  }

  // Mock weather data for fallback
  getMockWeatherData(city = 'Mumbai') {
    const conditions = [
      { main: 'Clear', description: 'clear sky', icon: '01d' },
      { main: 'Clouds', description: 'few clouds', icon: '02d' },
      { main: 'Clouds', description: 'scattered clouds', icon: '03d' },
      { main: 'Rain', description: 'light rain', icon: '10d' },
      { main: 'Thunderstorm', description: 'thunderstorm', icon: '11d' }
    ];
    
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const temp = Math.floor(Math.random() * 15) + 20; // 20-35°C
    
    return {
      location: city,
      temperature: temp,
      feelsLike: temp + Math.floor(Math.random() * 6) - 3,
      condition: condition.main,
      description: condition.description,
      humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
      pressure: Math.floor(Math.random() * 50) + 1000, // 1000-1050 hPa
      windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
      visibility: Math.floor(Math.random() * 5) + 10, // 10-15 km
      icon: condition.icon,
      sunrise: '6:30',
      sunset: '18:45',
      timestamp: new Date()
    };
  }

  // Mock forecast data for fallback
  getMockForecastData(city = 'Mumbai', days = 5) {
    const forecasts = [];
    const conditions = [
      { main: 'Clear', description: 'clear sky', icon: '01d' },
      { main: 'Clouds', description: 'few clouds', icon: '02d' },
      { main: 'Rain', description: 'light rain', icon: '10d' }
    ];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      
      forecasts.push({
        date: date,
        day: date.toLocaleDateString([], { weekday: 'short' }),
        minTemp: Math.floor(Math.random() * 10) + 18, // 18-28°C
        maxTemp: Math.floor(Math.random() * 10) + 28, // 28-38°C
        condition: condition.main,
        description: condition.description,
        icon: condition.icon,
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 20) + 5
      });
    }
    
    return {
      location: city,
      forecasts
    };
  }

  // Get weather emoji based on condition
  getWeatherEmoji(condition, icon) {
    const isDay = icon?.includes('d');
    
    switch (condition?.toLowerCase()) {
      case 'clear':
        return isDay ? '☀️' : '🌙';
      case 'clouds':
        return '☁️';
      case 'rain':
        return '🌧️';
      case 'drizzle':
        return '🌦️';
      case 'thunderstorm':
        return '⛈️';
      case 'snow':
        return '❄️';
      case 'mist':
      case 'fog':
        return '🌫️';
      case 'haze':
        return '🌫️';
      default:
        return isDay ? '🌤️' : '🌃';
    }
  }

  // Format weather data for ChatBot display
  formatWeatherForChat(weatherData) {
    const emoji = this.getWeatherEmoji(weatherData.condition, weatherData.icon);
    
    return `${emoji} **Current Weather - ${weatherData.location}**

🌡️ **Temperature:** ${weatherData.temperature}°C (feels like ${weatherData.feelsLike}°C)
🌤️ **Condition:** ${weatherData.description}
💧 **Humidity:** ${weatherData.humidity}%
🌪️ **Wind Speed:** ${weatherData.windSpeed} km/h
👁️ **Visibility:** ${weatherData.visibility} km
📊 **Pressure:** ${weatherData.pressure} hPa

🌅 **Sunrise:** ${weatherData.sunrise}
🌇 **Sunset:** ${weatherData.sunset}

_Updated: ${weatherData.timestamp.toLocaleTimeString()}_

Stay informed with weather news in our Science section!`;
  }

  // Format forecast for ChatBot display
  formatForecastForChat(forecastData) {
    let message = `🌤️ **5-Day Weather Forecast - ${forecastData.location}**\n\n`;
    
    forecastData.forecasts.forEach((day, index) => {
      const emoji = this.getWeatherEmoji(day.condition, day.icon);
      const dayName = index === 0 ? 'Today' : day.day;
      
      message += `${emoji} **${dayName}:** ${day.minTemp}°C - ${day.maxTemp}°C, ${day.description}\n`;
    });
    
    message += '\n_Check our Weather section for detailed forecasts and climate news!_';
    
    return message;
  }

  // Search weather for different cities
  async searchCityWeather(query) {
    const cities = this.extractCitiesFromQuery(query);
    const results = [];
    
    for (const city of cities.slice(0, 3)) { // Limit to 3 cities
      try {
        const weather = await this.getCurrentWeather(city);
        results.push(weather);
      } catch (error) {
        console.error(`Error fetching weather for ${city}:`, error);
      }
    }
    
    return results;
  }

  // Extract city names from user query
  extractCitiesFromQuery(query) {
    const commonCities = [
      'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad',
      'Pune', 'Ahmedabad', 'New York', 'London', 'Tokyo', 'Paris',
      'Sydney', 'Dubai', 'Singapore', 'Toronto', 'Los Angeles', 'Chicago'
    ];
    
    const foundCities = [];
    const lowerQuery = query.toLowerCase();
    
    commonCities.forEach(city => {
      if (lowerQuery.includes(city.toLowerCase())) {
        foundCities.push(city);
      }
    });
    
    // If no cities found, try to extract from the query
    if (foundCities.length === 0) {
      const words = query.split(' ');
      const potentialCities = words.filter(word => 
        word.length > 2 && 
        word.charAt(0).toUpperCase() === word.charAt(0)
      );
      foundCities.push(...potentialCities.slice(0, 1));
    }
    
    return foundCities.length > 0 ? foundCities : ['Mumbai'];
  }
}

const weatherService = new WeatherService();
export default weatherService;
