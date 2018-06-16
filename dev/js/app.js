var app = angular.module('weatherApp', []);

app.controller('widgetCtrl', function($scope, $http, $timeout) {
    //API key
    var apiKey = config.apiKey; //api key from wunderground
    var updateDelay = 300000; //update delay, in milliseconds
    
    $scope.widgetStatus = "weather";
        
    $scope.refreshData = function(){
        var d = new Date();
        var currentTime = d.getHours();
                
        $scope.widgetStatus = "weather";
            
        //get Weather Data
        $http.get("http://api.wunderground.com/api/"+apiKey+"/forecast/hourly/alerts/conditions/q/OH/Columbus.json")
        .then(function(response){
            if (response.status === 200) {
                compileData(response.data);      
            }
        });     
        
        $timeout($scope.refreshData, updateDelay);
    };
    
    function compileData(data) {
        var currentConditions = data.current_observation;
        var forecastArr = data.forecast.simpleforecast.forecastday;
        var forecastTxt = data.forecast.txt_forecast.forecastday[0];
        //initialize empty forecastData array
        $scope.forecastData = [];
            
        for (var i=0; i<3; i++) {
            //create empty object for this iteration's forecast
            var forecastDate = {
                    "dayOfWeek" : forecastArr[i].date.weekday,
                    "monthShortname" : forecastArr[i].date.monthname_short,
                    "date" : forecastArr[i].date.day,
                    "icon" : weatherIcon(forecastArr[i].icon),
                    "condition" : forecastArr[i].conditions,
                    "hiTemp": Number(forecastArr[i].high.fahrenheit),
                    "loTemp": Number(forecastArr[i].low.fahrenheit),
                    "pop": forecastArr[i].pop,
                    "popIcon": "rain"
               
            }; 
            
            //extra parameters for current conditions            
            if (i===0) {
                forecastDate.icon = weatherIcon(currentConditions.icon);
                forecastDate.condition = currentConditions.weather;
                forecastDate.description = forecastTxt.fcttext;
                forecastDate.currentTemp = Number(currentConditions.temp_f).toFixed(0);
                forecastDate.feelsLike = Number(currentConditions.feelslike_f).toFixed(0);
                forecastDate.lastUpdated = currentConditions.observation_time;
            }
            
            //change rain icon to snowflakes if current temp, or the hi/lo avg is <32 deg.
            if ((forecastDate.currentTemp !== undefined && forecastDate.currentTemp<32)||((forecastDate.hiTemp+forecastDate.loTemp)/2) < 32 ) {
                forecastDate.popIcon = "snow";
            }
            
            //push data to array
            $scope.forecastData.push(forecastDate);   
        }
          
        $scope.weatherData1 = $scope.forecastData[0];
        $scope.weatherData2 = $scope.forecastData[1];
        $scope.weatherData3 = $scope.forecastData[2];
    }
    
    function weatherIcon(condition){
        switch (condition){
            case "sunny":
            case "clear":
            case "mostlysunny":
                return "sunny";
            case "cloudy":
            case "mostlycloudy":
                return "cloudy";
            case "partlysunny":
            case "partlycloudy":
                return "partly-cloudy";
            case "tstorms":
            case "chancetstorms":
                return "tstorms";
            case "rain":
            case "chancerain":
                return "rain";
            case "sleet":
            case "chancesleet":
            case "flurries":
            case "chanceflurries":
            case "snow":
            case "chancesnow":
                return "snow";
            case "fog":
            case "hazy":
                return "fog";
        }

        //default icon
        return "sunny";
    }

    $scope.refreshData();
});





