const request = require('request');

const getAstroData = (cityValue, callback) => {
    const urlReq = `https://api.ipgeolocation.io/astronomy?apiKey=&location=${cityValue}'`
    request({url: urlReq, json: true}, (errData, resData) => {
        const timeDataTemp = [resData.body.current_time,resData.body.sunrise,resData.body.sunset,resData.body.solar_noon, resData.body.moonrise, resData.body.moonset];
        const timeData = timeDataTemp.map(item => item.replace(':','-'));
        const localTime = getSeconds(timeDataTemp[0]);
        const sunRise = getSeconds(timeDataTemp[1]);
        const sunSet = getSeconds(timeDataTemp[2]);
        let dayTime = '';
        const curTime = timeData[0].slice(0,5);
        const moonDistance = String(Math.floor(resData.body.moon_distance)).slice(0,3);

        if ((localTime-sunRise >= -6000 && localTime-sunRise <= 6000) || (localTime-sunSet >= -6000 && localTime-sunSet <= 6000)) {
            dayTime ='twilight';
        } else if (localTime-sunRise < -6000 || localTime-sunSet > 6000) {
            dayTime = 'night';
        } else  {
            dayTime = 'day';
        }
        
        callback({
            city: cityValue,
            time: curTime,
            sunrise: timeData[1],
            sunset: timeData[2],
            solarNoon: timeData[3],
            sunAltitude: resData.body.sun_altitude.toFixed(2),
            moonrise: timeData[4],
            moonset: timeData[5],
            moonDistance: moonDistance,
            moonAltitude: resData.body.moon_altitude.toFixed(2),
            dayTime:  dayTime
        });
    });
   
    function getSeconds(time) {
      let timeArr = time.split(':')
      return (timeArr[0]*60) + timeArr[1];
    }
}

module.exports = getAstroData;
