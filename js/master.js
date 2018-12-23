var APIKEY = "7e10205a5133ec645fa811d92a7ae7ec";

window.onload = function(){
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var date = new Date();
  $("#dateNow").text(`${date.getDate()}/${date.getMonth()+1}`);

  date.setDate(date.getDate()+1);
  $("#dateSecond").text(`${date.getDate()}/${date.getMonth()+1}`);
  $("#secondDayTime").text(days[date.getDay()]);
  date.setDate(date.getDate()+1);
  $("#dateThird").text(`${date.getDate()}/${date.getMonth()+1}`);
  $("#thirdDayTime").text(days[date.getDay()]);
  date.setDate(date.getDate()+1);
  $("#dateFourth").text(`${date.getDate()}/${date.getMonth()+1}`);
  $("#fourthDayTime").text(days[date.getDay()]);
  date.setDate(date.getDate()+1);
  $("#dateFifth").text(`${date.getDate()}/${date.getMonth()+1}`);
  $("#fifthDayTime").text(days[date.getDay()]);
  submit("Kosice, SK");
  updateMap(0,0,2);
}
var handleMostSearched = function(id){
  switch(id){
    case 1:
      submit("London, UK");
      break;
    case 2:
      submit("New York, US");
      break;
    case 3:
      submit("Paris");
      break;
  case 4:
    submit("Barcelona");
    break;
  case 5:
    submit("Sydney");
    break;
  case 6:
    submit("Berlin");
    break;
  case 7:
    submit("Rome");
    break;
  case 8:
    submit("Bratislava");
    break;
  }
}
var updateMap = function(lat,lon, zoom){
  $("#basicMap").empty();
  var map = new ol.Map({
        target: 'basicMap',
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
        view: new ol.View({
          center: ol.proj.fromLonLat([lon, lat]),
          zoom: zoom      //TODO: change zoom by the population?
        })
  });
}
var submit = function(data){
  var str
  if(data !== undefined){
      str = data.split(',');
  }else{
    str = ($("#cityName").val()).split(',');
  }
  var name = str[0];
  while(name[name.length-1] === ' '){
    name = name.substring(0, name.length-1);
  }
  var url = name;

  if(str[1] !== undefined){
    url+=","+str[1];
  }
  $.ajax({

    url:"http://api.openweathermap.org/data/2.5/forecast?q="+url+"&APPID="+APIKEY,
    success:(data) => {
      console.log(data);

      var zoom = 8;
      if(parseFloat(data.city.population) < 1000000){
        zoom = 10;
      }
      if(parseFloat(data.city.population) < 600000){
        zoom = 10;
      }
      if(parseFloat(data.city.population) < 300000){
        zoom = 11;
      }
      if(parseFloat(data.city.population) < 100000){
        zoom = 12;
      }
      if(parseFloat(data.city.population) < 10000){
        zoom = 13;
      }
      initComponents(data);
      updateMap(parseFloat(data.city.coord.lat), parseFloat(data.city.coord.lon), zoom); //todo vypocitat zoom
      beforeFirstSubmit = false;
    }
  });
}
var initComponents = function(data){
  //terajsie pocasie
  $("#location").text(data.city.name);
  $("#temperatureNow").text(Math.round((data.list[0].main.temp-273.15)*10)/10);
  $("#humidityNow").text(data.list[0].main.humidity);
  $("#windNow").text(Math.round(data.list[0].wind.speed*10)/10);
  setIcon("weatherNowIcon", data.list[0].weather[0].id);
  //cyklom prechadzat nasledujuce dni
  var date = new Date();
  date.setDate(date.getDate()+1);
  date.setDate(date.getDate());
  date.setHours(13);
  date.setMinutes(0);
  date.setSeconds(0);
  var filled = 0;
  for(var i = 1; i < data.list.length; i++){
    //zajtra
    if(data.list[i].dt === parseInt(date.getTime()/1000) && filled === 0){
      console.log(date);
        setIcon("weatherSecondIcon", data.list[i].weather[0].id);
        $("#temperatureSecond").text(Math.round((data.list[i].main.temp-273.15)*10)/10);
        $("#humiditySecond").text(data.list[i].main.humidity);
        $("#windSecond").text(Math.round(data.list[i].wind.speed*10)/10);
        filled++;
        date.setDate(date.getDate()+1);
    }
    //pozajtra
    else if(data.list[i].dt === parseInt(date.getTime()/1000) && filled === 1){
      console.log(date);
        setIcon("weatherThirdIcon", data.list[i].weather[0].id);
        $("#temperatureThird").text(Math.round((data.list[i].main.temp-273.15)*10)/10);
        $("#humidityThird").text(data.list[i].main.humidity);
        $("#windThird").text(Math.round(data.list[i].wind.speed*10)/10);
        filled++;
        date.setDate(date.getDate()+1);
    }
    else if(data.list[i].dt === parseInt(date.getTime()/1000) && filled === 2){
      console.log(date);
        setIcon("weatherFourthIcon", data.list[i].weather[0].id);
        $("#temperatureFourth").text(Math.round((data.list[i].main.temp-273.15)*10)/10);
        $("#humidityFourth").text(data.list[i].main.humidity);
        $("#windFourth").text(Math.round(data.list[i].wind.speed*10)/10);
        filled++;
        date.setDate(date.getDate()+1);
    }
    else if(data.list[i].dt === parseInt(date.getTime()/1000) && filled === 3){
      console.log(date);
        setIcon("weatherFifthIcon", data.list[i].weather[0].id);
        $("#temperatureFifth").text(Math.round((data.list[i].main.temp-273.15)*10)/10);
        $("#humidityFifth").text(data.list[i].main.humidity);
        $("#windFifth").text(Math.round(data.list[i].wind.speed*10)/10);
        filled++;
        date.setDate(date.getDate()+1);
    }
  }
}
var setIcon = function(id, weatherCode){
  var iconUrl = "#";
  if(weatherCode < 300){
    iconUrl="imgs/icons/icon-11.svg";
  }
  else if(weatherCode < 400){
    iconUrl="imgs/icons/icon-10.svg";
  }
  else if(weatherCode < 600){
    iconUrl="imgs/icons/icon-4.svg";
  }
  else if(weatherCode < 700){
    iconUrl="imgs/icons/icon-14.svg";
  }
  else if(weatherCode < 800){
    iconUrl="imgs/icons/icon-7.svg";
  }
  else if(weatherCode === 801){
    iconUrl="imgs/icons/icon-3.svg";
  }
  else if(weatherCode === 802){
    iconUrl="imgs/icons/icon-5.svg";
  }
  else if(weatherCode === 803){
    iconUrl="imgs/icons/icon-6.svg";
  }
  else if(weatherCode === 804){
    iconUrl="imgs/icons/icon-6.svg";
  }
  else{
    iconUrl="imgs/icons/icon-2.svg";
  }
  $("#"+id).attr({src:iconUrl});
}
