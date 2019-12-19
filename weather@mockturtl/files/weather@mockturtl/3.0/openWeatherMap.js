var __awaiter = (this && this.__awaiter) || function(thisArg, _arguments, P,
                                                     generator) {
  function adopt(value) {
    return value instanceof P ? value
                              : new P(function(resolve) { resolve(value); });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value)
                  : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = (this && this.__generator) || function(thisArg, body) {
  var _ = {
    label : 0,
    sent : function() {
      if (t[0] & 1)
        throw t[1];
      return t[1];
    },
    trys : [],
    ops : []
  },
      f, y, t, g;
  return g = {next : verb(0), "throw" : verb(1), "return" : verb(2)},
         typeof Symbol === "function" &&
             (g[Symbol.iterator] = function() { return this; }),
         g;
  function verb(n) {
    return function(v) { return step([ n, v ]); };
  }
  function step(op) {
    if (f)
      throw new TypeError("Generator is already executing.");
    while (_)
      try {
        if (f = 1,
            y &&
                (t = op[0] & 2 ? y["return"]
                               : op[0] ? y["throw"] ||
                                             ((t = y["return"]) && t.call(y), 0)
                                       : y.next) &&
                !(t = t.call(y, op[1])).done)
          return t;
        if (y = 0, t)
          op = [ op[0] & 2, t.value ];
        switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return {value : op[1], done : false};
        case 5:
          _.label++;
          y = op[1];
          op = [ 0 ];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) &&
              (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2])
            _.ops.pop();
          _.trys.pop();
          continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [ 6, e ];
        y = 0;
      } finally {
        f = t = 0;
      }
    if (op[0] & 5)
      throw op[1];
    return {value : op[0] ? op[1] : void 0, done : true};
  }
};
function importModule(path) {
  if (typeof require !== 'undefined') {
    return require('./' + path);
  } else {
    if (!AppletDir)
      var AppletDir = imports.ui.appletManager.applets['weather@mockturtl'];
    return AppletDir[path];
  }
}
var utils = importModule("utils");
var isCoordinate = utils.isCoordinate;
var isLangSupported = utils.isLangSupported;
var isID = utils.isID;
var icons = utils.icons;
var weatherIconSafely = utils.weatherIconSafely;
var get = utils.get;
var OpenWeatherMap = (function() {
  function OpenWeatherMap(_app) {
    this.supportedLanguages = [
      "ar", "bg", "ca", "cz", "de", "el", "en", "fa", "fi", "fr",    "gl",
      "hr", "hu", "it", "ja", "kr", "la", "lt", "mk", "nl", "pl",    "pt",
      "ro", "ru", "se", "sk", "sl", "es", "tr", "ua", "vi", "zh_cn", "zh_tw"
    ];
    this.current_url = "https://api.openweathermap.org/data/2.5/weather?";
    this.daily_url = "https://api.openweathermap.org/data/2.5/forecast/daily?";
    this.app = _app;
  }
  OpenWeatherMap.prototype.GetWeather = function() {
    return __awaiter(this, void 0, void 0, function() {
      var currentResult, forecastResult;
      return __generator(this, function(_a) {
        switch (_a.label) {
        case 0:
          return [ 4, this.GetData(this.current_url, this.ParseCurrent) ];
        case 1:
          currentResult = _a.sent();
          return [ 4, this.GetData(this.daily_url, this.ParseForecast) ];
        case 2:
          forecastResult = _a.sent();
          currentResult.forecasts = forecastResult;
          return [ 2, currentResult ];
        }
      });
    });
  };
  ;
  OpenWeatherMap.prototype.GetData = function(baseUrl, ParseFunction) {
    return __awaiter(this, void 0, void 0, function() {
      var query, json, e_1;
      return __generator(this, function(_a) {
        switch (_a.label) {
        case 0:
          query = this.ConstructQuery(baseUrl);
          if (!(query != null))
            return [ 3, 5 ];
          this.app.log.Debug("Query: " + query);
          _a.label = 1;
        case 1:
          _a.trys.push([ 1, 3, , 4 ]);
          return [ 4, this.app.LoadJsonAsync(query) ];
        case 2:
          json = _a.sent();
          return [ 3, 4 ];
        case 3:
          e_1 = _a.sent();
          this.app.HandleHTTPError("openweathermap", e_1, this.app,
                                   this.HandleHTTPError);
          return [ 2, null ];
        case 4:
          if (json == null) {
            this.app.HandleError({
              type : "soft",
              detail : "no api response",
              service : "openweathermap"
            });
            return [ 2, null ];
          }
          if (json.cod == "200") {
            return [ 2, ParseFunction(json, this) ];
          } else {
            this.HandleResponseErrors(json);
            return [ 2, null ];
          }
          return [ 3, 6 ];
        case 5:
          return [ 2, null ];
        case 6:
          return [ 2 ];
        }
      });
    });
  };
  ;
  OpenWeatherMap.prototype.ParseCurrent = function(json, self) {
    try {
      var weather = {
        coord : {
          lat : get([ "coord", "lat" ], json),
          lon : get([ "coord", "lon" ], json)
        },
        location : {
          city : json.name,
          country : json.sys.country,
          url : "https://openweathermap.org/city/" + json.id,
        },
        date : new Date((json.dt) * 1000),
        sunrise : new Date((json.sys.sunrise) * 1000),
        sunset : new Date((json.sys.sunset) * 1000),
        wind : {
          speed : get([ "wind", "speed" ], json),
          degree : get([ "wind", "deg" ], json)
        },
        temperature : get([ "main", "temp" ], json),
        pressure : get([ "main", "pressure" ], json),
        humidity : get([ "main", "humidity" ], json),
        condition : {
          main : get([ "weather", "0", "main" ], json),
          description : get([ "weather", "0", "description" ], json),
          icon : weatherIconSafely(
              self.ResolveIcon(get([ "weather", "0", "icon" ], json)),
              self.app._icon_type)
        },
        extra_field :
            {name : _("Cloudiness"), value : json.clouds.all, type : "percent"},
        forecasts : []
      };
      return weather;
    } catch (e) {
      self.app.log.Error("OpenWeathermap Weather Parsing error: " + e);
      self.app.HandleError({
        type : "soft",
        service : "openweathermap",
        detail : "unusal payload",
        message : _("Failed to Process Current Weather Info")
      });
      return null;
    }
  };
  ;
  OpenWeatherMap.prototype.ParseForecast = function(json, self) {
    var forecasts = [];
    try {
      for (var i = 0; i < self.app._forecastDays; i++) {
        var day = json.list[i];
        var forecast = {
          date : new Date(day.dt * 1000),
          temp_min : day.temp.min,
          temp_max : day.temp.max,
          condition : {
            main : day.weather[0].main,
            description : day.weather[0].description,
            icon : weatherIconSafely(self.ResolveIcon(day.weather[0].icon),
                                     self.app._icon_type),
          },
        };
        forecasts.push(forecast);
      }
      return forecasts;
    } catch (e) {
      self.app.log.Error("OpenWeathermap Forecast Parsing error: " + e);
      self.app.HandleError({
        type : "soft",
        service : "openweathermap",
        detail : "unusal payload",
        message : _("Failed to Process Forecast Info")
      });
      return null;
    }
  };
  ;
  OpenWeatherMap.prototype.ConstructQuery = function(baseUrl) {
    var query = baseUrl;
    var locString = this.ParseLocation();
    if (locString != null) {
      query = query + locString + "&APPID=";
      query += "1c73f8259a86c6fd43c7163b543c8640";
      if (this.app._translateCondition &&
          isLangSupported(this.app.systemLanguage, this.supportedLanguages)) {
        query = query + "&lang=" + this.app.systemLanguage;
      }
      return query;
    }
    this.app.HandleError({
      type : "hard",
      userError : true,
      "detail" : "no location",
      message : _("Please enter a Location in settings")
    });
    this.app.log.Error("OpenWeatherMap: No Location was provided");
    return null;
  };
  ;
  OpenWeatherMap.prototype.ParseLocation = function() {
    var loc = this.app._location.replace(/ /g, "");
    if (isCoordinate(loc)) {
      var locArr = loc.split(',');
      return "lat=" + locArr[0] + "&lon=" + locArr[1];
    } else if (isID(loc)) {
      return "id=" + loc;
    } else
      return "q=" + loc;
  };
  ;
  OpenWeatherMap.prototype.HandleResponseErrors = function(json) {
    var errorMsg = "OpenWeathermap Response: ";
    var error = {
      service : "openweathermap",
      type : "hard",
    };
    switch (json.cod) {
    case ("400"):
      error.detail = "bad location format";
      error.message = _(
          "Please make sure Location is in the correct format in the Settings");
      break;
    case ("401"):
      error.detail = "bad key";
      error.message = _("Make sure you entered the correct key in settings");
      break;
    case ("404"):
      error.detail = "location not found";
      error.message = _(
          "Location not found, make sure location is available or it is in the correct format");
      break;
    case ("429"):
      error.detail = "key blocked";
      error.message = _(
          "If this problem persists, please contact the Author of this applet");
      break;
    default:
      error.detail = "unknown";
      error.message = _("Unknown Error, please see the logs in Looking Glass");
      break;
    };
    this.app.HandleError(error);
    this.app.log.Debug("OpenWeatherMap Error Code: " + json.cod);
    this.app.log.Error(errorMsg + json.message);
  };
  ;
  OpenWeatherMap.prototype.HandleHTTPError = function(error, uiError) {
    if (error.code == 404) {
      uiError.detail = "location not found";
      uiError.message = _(
          "Location not found, make sure location is available or it is in the correct format");
      uiError.userError = true;
      uiError.type = "hard";
    }
    return uiError;
  };
  OpenWeatherMap.prototype.ResolveIcon = function(icon) {
    switch (icon) {
    case "10d":
      return [ icons.rain, icons.showers_scattered, icons.rain_freezing ];
    case "10n":
      return [ icons.rain, icons.showers_scattered, icons.rain_freezing ];
    case "09n":
      return [ icons.showers ];
    case "09d":
      return [ icons.showers ];
    case "13d":
      return [ icons.snow ];
    case "13n":
      return [ icons.snow ];
    case "50d":
      return [ icons.fog ];
    case "50n":
      return [ icons.fog ];
    case "04d":
      return [ icons.overcast, icons.clouds, icons.few_clouds_day ];
    case "04n":
      return [ icons.overcast, icons.clouds, icons.few_clouds_day ];
    case "03n":
      return [ 'weather-clouds-night', icons.few_clouds_night ];
    case "03d":
      return [ icons.clouds, icons.overcast, icons.few_clouds_day ];
    case "02n":
      return [ icons.few_clouds_night ];
    case "02d":
      return [ icons.few_clouds_day ];
    case "01n":
      return [ icons.clear_night ];
    case "01d":
      return [ icons.clear_day ];
    case "11d":
      return [ icons.storm ];
    case "11n":
      return [ icons.storm ];
    default:
      return [ icons.alert ];
    }
  };
  ;
  return OpenWeatherMap;
}());
;
var openWeatherMapConditionLibrary = [
  _("Thunderstorm with light rain"),
  _("Thunderstorm with rain"),
  _("Thunderstorm with heavy rain"),
  _("Light thunderstorm"),
  _("Thunderstorm"),
  _("Heavy thunderstorm"),
  _("Ragged thunderstorm"),
  _("Thunderstorm with light drizzle"),
  _("Thunderstorm with drizzle"),
  _("Thunderstorm with heavy drizzle"),
  _("Light intensity drizzle"),
  _("Drizzle"),
  _("Heavy intensity drizzle"),
  _("Light intensity drizzle rain"),
  _("Drizzle rain"),
  _("Heavy intensity drizzle rain"),
  _("Shower rain and drizzle"),
  _("Heavy shower rain and drizzle"),
  _("Shower drizzle"),
  _("Light rain"),
  _("Moderate rain"),
  _("Heavy intensity rain"),
  _("Very heavy rain"),
  _("Extreme rain"),
  _("Freezing rain"),
  _("Light intensity shower rain"),
  _("Shower rain"),
  _("Heavy intensity shower rain"),
  _("Ragged shower rain"),
  _("Light snow"),
  _("Snow"),
  _("Heavy snow"),
  _("Sleet"),
  _("Shower sleet"),
  _("Light rain and snow"),
  _("Rain and snow"),
  _("Light shower snow"),
  _("Shower snow"),
  _("Heavy shower snow"),
  _("Mist"),
  _("Smoke"),
  _("Haze"),
  _("Sand, dust whirls"),
  _("Fog"),
  _("Sand"),
  _("Dust"),
  _("Volcanic ash"),
  _("Squalls"),
  _("Tornado"),
  _("Clear"),
  _("Clear sky"),
  _("Sky is clear"),
  _("Few clouds"),
  _("Scattered clouds"),
  _("Broken clouds"),
  _("Overcast clouds")
];
