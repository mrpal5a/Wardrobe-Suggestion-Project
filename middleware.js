const API_URL = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = "94e5b2be896bc5f0d6abe0ad98278b54";

module.exports.weatherInfo = async(req,res,next)=>{
    let city = req.query.city || "Ankleshwar";
    try{
      const response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
      const jsonResponse = await response.json();
    //   console.log(jsonResponse);
      let result = 
      {
          city:jsonResponse.name,
          temp : jsonResponse.main.temp,
          tempMin : jsonResponse.main.temp_min,
          tempMax : jsonResponse.main.temp_max,
          feelsLike :jsonResponse.main.feels_like,
          humidity: jsonResponse.main.humidity,
          weather : jsonResponse.weather[0].description
      }
      // console.log(result);
      res.locals.weather = response.result;  // 🧠 Magic Line
    //   console.log(result);
  } catch(err){
      next(err);
  }
  }