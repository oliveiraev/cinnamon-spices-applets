var __extends = (this && this.__extends) || (function() {
                  var extendStatics = function(d, b) {
                    extendStatics = Object.setPrototypeOf ||
                                    ({__proto__ : []} instanceof Array &&
                                     function(d, b) { d.__proto__ = b; }) ||
                                    function(d, b) {
                                      for (var p in b)
                                        if (b.hasOwnProperty(p))
                                          d[p] = b[p];
                                    };
                    return extendStatics(d, b);
                  };
                  return function(d, b) {
                    extendStatics(d, b);
                    function __() { this.constructor = d; }
                    d.prototype = b === null
                                      ? Object.create(b)
                                      : (__.prototype = b.prototype, new __());
                  };
                })();
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
var DEBUG = false;
function importModule(path) {
  if (typeof require !== 'undefined') {
    return require('./' + path);
  } else {
    if (!AppletDir)
      var AppletDir = imports.ui.appletManager.applets['weather@mockturtl'];
    return AppletDir[path];
  }
}
var Cairo = imports.cairo;
var Lang = imports.lang;
var Main = imports.ui.main;
var Mainloop = imports.mainloop;
var Gio = imports.gi.Gio;
var Soup = imports.gi.Soup;
var St = imports.gi.St;
var GLib = imports.gi.GLib;
var GObject = imports.gi.GObject;
var Gettext = imports.gettext;
var Applet = imports.ui.applet;
var PopupMenu = imports.ui.popupMenu;
var Settings = imports.ui.settings;
var Util = imports.misc.util;
var utils = importModule("utils");
var GetDayName = utils.GetDayName;
var GetHoursMinutes = utils.GetHoursMinutes;
var capitalizeFirstLetter = utils.capitalizeFirstLetter;
var TempToUserUnits = utils.TempToUserUnits;
var PressToUserUnits = utils.PressToUserUnits;
var compassDirection = utils.compassDirection;
var MPStoUserUnits = utils.MPStoUserUnits;
var nonempty = utils.nonempty;
var AwareDateString = utils.AwareDateString;
if (typeof Promise != "function") {
  var promisePoly = importModule("promise-polyfill");
  var finallyConstructor = promisePoly.finallyConstructor;
  var setTimeout = promisePoly.setTimeout;
  var setTimeoutFunc = promisePoly.setTimeoutFunc;
  var isArray = promisePoly.isArray;
  var noop = promisePoly.noop;
  var bind = promisePoly.bind;
  var Promise = promisePoly.Promise;
  var handle = promisePoly.handle;
  var resolve = promisePoly.resolve;
  var reject = promisePoly.reject;
  var finale = promisePoly.finale;
  var Handler = promisePoly.Handler;
  var doResolve = promisePoly.doResolve;
  Promise.prototype['catch'] = promisePoly.Promise.prototype['catch'];
  Promise.prototype.then = promisePoly.Promise.prototype.then;
  Promise.all = promisePoly.Promise.all;
  Promise.resolve = promisePoly.Promise.resolve;
  Promise.reject = promisePoly.Promise.reject;
  Promise.race = promisePoly.Promise.race;
  var globalNS = promisePoly.globalNS;
  if (!('Promise' in globalNS)) {
    globalNS['Promise'] = Promise;
  } else if (!globalNS.Promise.prototype['finally']) {
    globalNS.Promise.prototype['finally'] = finallyConstructor;
  }
}
var ipApi = importModule('ipApi');
var UUID = "weather@mockturtl";
var APPLET_ICON = "view-refresh-symbolic";
var REFRESH_ICON = "view-refresh";
var CMD_SETTINGS = "cinnamon-settings applets " + UUID;
var DATA_SERVICE = {
  OPEN_WEATHER_MAP : "OpenWeatherMap",
  DARK_SKY : "DarkSky",
};
var WEATHER_LOCATION = "location";
var WEATHER_USE_SYMBOLIC_ICONS_KEY = 'useSymbolicIcons';
var KEYS = {
  WEATHER_DATA_SERVICE : "dataService",
  WEATHER_API_KEY : "apiKey",
  WEATHER_TEMPERATURE_UNIT_KEY : "temperatureUnit",
  WEATHER_TEMPERATURE_HIGH_FIRST_KEY : "temperatureHighFirst",
  WEATHER_WIND_SPEED_UNIT_KEY : "windSpeedUnit",
  WEATHER_CITY_KEY : "locationLabelOverride",
  WEATHER_TRANSLATE_CONDITION_KEY : "translateCondition",
  WEATHER_VERTICAL_ORIENTATION_KEY : "verticalOrientation",
  WEATHER_SHOW_TEXT_IN_PANEL_KEY : "showTextInPanel",
  WEATHER_SHOW_COMMENT_IN_PANEL_KEY : "showCommentInPanel",
  WEATHER_SHOW_SUNRISE_KEY : "showSunrise",
  WEATHER_SHOW_24HOURS_KEY : "show24Hours",
  WEATHER_FORECAST_DAYS : "forecastDays",
  WEATHER_REFRESH_INTERVAL : "refreshInterval",
  WEATHER_PRESSURE_UNIT_KEY : "pressureUnit",
  WEATHER_SHORT_CONDITIONS_KEY : "shortConditions",
  WEATHER_MANUAL_LOCATION : "manualLocation"
};
Gettext.bindtextdomain(UUID, GLib.get_home_dir() + "/.local/share/locale");
function _(str) { return Gettext.dgettext(UUID, str); }
var WeatherApplet = (function(_super) {
  __extends(WeatherApplet, _super);
  function WeatherApplet(metadata, orientation, panelHeight, instanceId) {
    var _this = _super.call(this, orientation, panelHeight, instanceId) || this;
    _this.weather = {
      date : null,
      location : {
        city : null,
        country : null,
        tzOffset : null,
        timeZone : null,
        url : null
      },
      coord : {
        lat : null,
        lon : null,
      },
      sunrise : null,
      sunset : null,
      wind : {
        speed : null,
        degree : null,
      },
      temperature : null,
      pressure : null,
      humidity : null,
      condition : {
        main : null,
        description : null,
        icon : null,
      },
    };
    _this.forecasts = [];
    _this.currentLocale = null;
    _this.systemLanguage = null;
    _this._httpSession = new Soup.SessionAsync();
    _this.locProvider = new ipApi.IpApi(_this);
    _this.lastUpdated = null;
    _this.encounteredError = false;
    _this.pauseRefresh = false;
    _this.errorCount = 0;
    _this.LOOP_INTERVAL = 15;
    _this.errMsg = {
      unknown : _("Error"),
      "bad api response - non json" : _("Service Error"),
      "bad key" : _("Incorrect API Key"),
      "bad api response" : _("Service Error"),
      "bad location format" : _("Incorrect Location Format"),
      "bad status code" : _("Service Error"),
      "key blocked" : _("Key Blocked"),
      "location not found" : _("Can't find location"),
      "no api response" : _("Service Error"),
      "no key" : _("No Api Key"),
      "no location" : _("No Location"),
      "no network response" : _("Service Error"),
      "no reponse body" : _("Service Error"),
      "no respone data" : _("Service Error"),
      "unusal payload" : _("Service Error"),
    };
    _this.currentLocale = _this.constructJsLocale(GLib.get_language_names()[0]);
    _this.systemLanguage = _this.currentLocale.split('-')[0];
    _this.settings = new Settings.AppletSettings(_this, UUID, instanceId);
    _this.log = new Log(instanceId);
    _this._httpSession.user_agent =
        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:37.0) Gecko/20100101 Firefox/37.0";
    Soup.Session.prototype.add_feature.call(_this._httpSession,
                                            new Soup.ProxyResolverDefault());
    _this.SetAppletOnPanel();
    _this.AddPopupMenu(orientation);
    _this.BindSettings();
    _this.AddRefreshButton();
    _this.BuildPopupMenu();
    _this.rebuild();
    _this.RefreshLoop();
    _this.orientation = orientation;
    try {
      _this.setAllowedLayout(Applet.AllowedLayout.BOTH);
      _this.update_label_visible();
    } catch (e) {
    }
    return _this;
  }
  WeatherApplet.prototype.SetAppletOnPanel = function() {
    this.set_applet_icon_name(APPLET_ICON);
    this.set_applet_label(_("..."));
    this.set_applet_tooltip(_("Click to open"));
  };
  WeatherApplet.prototype.AddPopupMenu = function(orientation) {
    this.menuManager = new PopupMenu.PopupMenuManager(this);
    this.menu = new Applet.AppletPopupMenu(this, orientation);
    if (typeof this.menu.setCustomStyleClass === "function")
      this.menu.setCustomStyleClass(STYLE_WEATHER_MENU);
    else {
      this.menu.actor.add_style_class_name(STYLE_WEATHER_MENU);
    }
    this.menuManager.addMenu(this.menu);
  };
  WeatherApplet.prototype.BindSettings = function() {
    for (var k in KEYS) {
      var key = KEYS[k];
      var keyProp = "_" + key;
      this.settings.bindProperty(Settings.BindingDirection.IN, key, keyProp,
                                 this.refreshAndRebuild, null);
    }
    this.settings.bindProperty(Settings.BindingDirection.BIDIRECTIONAL,
                               WEATHER_LOCATION, ("_" + WEATHER_LOCATION),
                               this.refreshAndRebuild, null);
    this.settings.bindProperty(Settings.BindingDirection.IN, "keybinding",
                               "keybinding", this._onKeySettingsUpdated, null);
    Main.keybindingManager.addHotKey(UUID, this.keybinding,
                                     Lang.bind(this, this.on_applet_clicked));
    this.updateIconType();
    this.settings.connect(SIGNAL_CHANGED + WEATHER_USE_SYMBOLIC_ICONS_KEY,
                          Lang.bind(this, function() {
                            this.updateIconType();
                            this._applet_icon.icon_type = this._icon_type;
                            this._currentWeatherIcon.icon_type =
                                this._icon_type;
                            for (var i = 0; i < this._forecastDays; i++) {
                              this._forecast[i].Icon.icon_type =
                                  this._icon_type;
                            }
                            this.refreshWeather();
                          }));
  };
  WeatherApplet.prototype.AddRefreshButton = function() {
    var itemLabel = _("Refresh");
    var refreshMenuItem = new Applet.MenuItem(
        itemLabel, REFRESH_ICON,
        Lang.bind(this, function() { this.refreshAndRebuild(); }));
    this._applet_context_menu.addMenuItem(refreshMenuItem);
  };
  WeatherApplet.prototype.BuildPopupMenu = function() {
    this._currentWeather = new St.Bin({style_class : STYLE_CURRENT});
    this._futureWeather = new St.Bin({style_class : STYLE_FORECAST});
    this._separatorArea =
        new St.DrawingArea({style_class : STYLE_POPUP_SEPARATOR_MENU_ITEM});
    this._separatorArea.width = 200;
    this._separatorArea.connect(SIGNAL_REPAINT,
                                Lang.bind(this, this._onSeparatorAreaRepaint));
    var mainBox = new St.BoxLayout({vertical : true});
    mainBox.add_actor(this._currentWeather);
    mainBox.add_actor(this._separatorArea);
    mainBox.add_actor(this._futureWeather);
    this.menu.addActor(mainBox);
  };
  WeatherApplet.prototype.refreshAndRebuild = function() {
    this.pauseRefresh = false;
    this.refreshWeather(true);
  };
  ;
  WeatherApplet.prototype.LoadJsonAsync = function(query) {
    return __awaiter(this, void 0, void 0, function() {
      var json;
      var _this = this;
      return __generator(this, function(_a) {
        switch (_a.label) {
        case 0:
          return [
            4, new Promise(function(resolve, reject) {
              var message = Soup.Message.new('GET', query);
              _this._httpSession.queue_message(
                  message, function(session, message) {
                    if (!message)
                      reject({
                        code : 0,
                        message : "no network response",
                        reason_phrase : "no network response"
                      });
                    if (message.status_code != 200)
                      reject({
                        code : message.status_code,
                        message : "bad status code",
                        reason_phrase : message.reason_phrase
                      });
                    if (!message.response_body)
                      reject({
                        code : message.status_code,
                        message : "no reponse body",
                        reason_phrase : message.reason_phrase
                      });
                    if (!message.response_body.data)
                      reject({
                        code : message.status_code,
                        message : "no respone data",
                        reason_phrase : message.reason_phrase
                      });
                    try {
                      _this.log.Debug("API full response: " +
                                      message.response_body.data.toString());
                      var payload = JSON.parse(message.response_body.data);
                      resolve(payload);
                    } catch (e) {
                      _this.log.Error(
                          "Error: API response is not JSON. The response: " +
                          message.response_body.data);
                      reject({
                        code : message.status_code,
                        message : "bad api response - non json",
                        reason_phrase : e
                      });
                    }
                  });
            })
          ];
        case 1:
          json = _a.sent();
          return [ 2, json ];
        }
      });
    });
  };
  ;
  WeatherApplet.prototype.locationLookup = function() {
    return __awaiter(this, void 0, void 0, function() {
      var command;
      return __generator(this, function(_a) {
        command = "xdg-open ";
        Util.spawnCommandLine(
            command + "https://cinnamon-spices.linuxmint.com/applets/view/17");
        return [ 2 ];
      });
    });
  };
  WeatherApplet.prototype.IsDataTooOld = function() {
    if (!this.lastUpdated)
      return true;
    var oldDate = this.lastUpdated;
    oldDate.setMinutes(oldDate.getMinutes() + (this._refreshInterval * 2));
    return (this.lastUpdated > oldDate);
  };
  WeatherApplet.prototype.RefreshLoop = function() {
    if (this.encounteredError) {
      this.encounteredError = false;
      this.errorCount++;
    }
    if (this.errorCount > 60)
      this.errorCount = 60;
    var loopInterval = this.LOOP_INTERVAL;
    if (this.errorCount > 0)
      loopInterval = loopInterval * this.errorCount;
    try {
      if ((this.lastUpdated == null || this.errorCount > 0 ||
           new Date(this.lastUpdated.getTime() +
                    this._refreshInterval * 60000) < new Date()) &&
          !this.pauseRefresh) {
        this.refreshWeather(false);
      }
    } catch (e) {
      this.log.Error("Error in Main loop: " + e);
      this.encounteredError = true;
    }
    Mainloop.timeout_add_seconds(
        loopInterval,
        Lang.bind(this, function mainloopTimeout() { this.RefreshLoop(); }));
  };
  ;
  WeatherApplet.prototype.update_label_visible = function() {
    if (this.orientation == St.Side.LEFT || this.orientation == St.Side.RIGHT)
      this.hide_applet_label(true);
    else
      this.hide_applet_label(false);
  };
  ;
  WeatherApplet.prototype.on_orientation_changed = function(orientation) {
    this.orientation = orientation;
    this.refreshWeather(true);
  };
  ;
  WeatherApplet.prototype._onKeySettingsUpdated = function() {
    if (this.keybinding != null) {
      Main.keybindingManager.addHotKey(UUID, this.keybinding,
                                       Lang.bind(this, this.on_applet_clicked));
    }
  };
  WeatherApplet.prototype.on_applet_clicked = function(
      event) { this.menu.toggle(); };
  WeatherApplet.prototype._onSeparatorAreaRepaint = function(area) {
    var cr = area.get_context();
    var themeNode = area.get_theme_node();
    var _a = area.get_surface_size(), width = _a[0], height = _a[1];
    var margin = themeNode.get_length('-margin-horizontal');
    var gradientHeight = themeNode.get_length('-gradient-height');
    var startColor = themeNode.get_color('-gradient-start');
    var endColor = themeNode.get_color('-gradient-end');
    var gradientWidth = (width - margin * 2);
    var gradientOffset = (height - gradientHeight) / 2;
    var pattern =
        new Cairo.LinearGradient(margin, gradientOffset, width - margin,
                                 gradientOffset + gradientHeight);
    pattern.addColorStopRGBA(0, startColor.red / 255, startColor.green / 255,
                             startColor.blue / 255, startColor.alpha / 255);
    pattern.addColorStopRGBA(0.5, endColor.red / 255, endColor.green / 255,
                             endColor.blue / 255, endColor.alpha / 255);
    pattern.addColorStopRGBA(1, startColor.red / 255, startColor.green / 255,
                             startColor.blue / 255, startColor.alpha / 255);
    cr.setSource(pattern);
    cr.rectangle(margin, gradientOffset, gradientWidth, gradientHeight);
    cr.fill();
  };
  ;
  WeatherApplet.prototype.updateIconType = function() {
    this._icon_type = this.settings.getValue(WEATHER_USE_SYMBOLIC_ICONS_KEY)
                          ? St.IconType.SYMBOLIC
                          : St.IconType.FULLCOLOR;
  };
  ;
  WeatherApplet.prototype.constructJsLocale = function(locale) {
    var jsLocale = locale.split(".")[0];
    var tmp = jsLocale.split("_");
    jsLocale = "";
    for (var i = 0; i < tmp.length; i++) {
      if (i != 0)
        jsLocale += "-";
      jsLocale += tmp[i];
    }
    return jsLocale;
  };
  WeatherApplet.prototype.refreshWeather = function(rebuild) {
    return __awaiter(this, void 0, void 0, function() {
      var locationData, e_1, darkSky, openWeatherMap, weatherInfo, _a, e_2;
      return __generator(this, function(_b) {
        switch (_b.label) {
        case 0:
          this.encounteredError = false;
          locationData = null;
          _b.label = 1;
        case 1:
          _b.trys.push([ 1, 3, , 4 ]);
          return [ 4, this.ValidateLocation() ];
        case 2:
          locationData = _b.sent();
          return [ 3, 4 ];
        case 3:
          e_1 = _b.sent();
          this.log.Error(e_1);
          return [ 2 ];
        case 4:
          _b.trys.push([ 4, 9, , 10 ]);
          switch (this._dataService) {
          case DATA_SERVICE.DARK_SKY:
            if (darkSky == null)
              darkSky = importModule('darkSky');
            this.provider = new darkSky.DarkSky(this);
            break;
          case DATA_SERVICE.OPEN_WEATHER_MAP:
            if (openWeatherMap == null)
              openWeatherMap = importModule("openWeatherMap");
            this.provider = new openWeatherMap.OpenWeatherMap(this);
            break;
          default:
            return [ 2 ];
          }
          return [ 4, this.provider.GetWeather() ];
        case 5:
          weatherInfo = _b.sent();
          if (!weatherInfo) {
            this.log.Error("Unable to obtain Weather Information");
            return [ 2 ];
          }
          this.wipeCurrentData();
          this.wipeForecastData();
          this.ProcessWeatherData(weatherInfo, locationData);
          if (rebuild)
            this.rebuild();
          return [ 4, this.displayWeather() ];
        case 6:
          _a = !(_b.sent());
          if (_a)
            return [ 3, 8 ];
          return [ 4, this.displayForecast() ];
        case 7:
          _a = !(_b.sent());
          _b.label = 8;
        case 8:
          if (_a)
            return [ 2 ];
          this.log.Print("Weather Information refreshed");
          this.errorCount = 0;
          return [ 3, 10 ];
        case 9:
          e_2 = _b.sent();
          this.log.Error("Generic Error while refreshing Weather info: " + e_2);
          this.HandleError({
            type : "hard",
            detail : "unknown",
            message : _(
                "Unexpected Error While Refreshing Weather, please see log in Looking Glass")
          });
          return [ 2 ];
        case 10:
          this.lastUpdated = new Date();
          return [ 2 ];
        }
      });
    });
  };
  ;
  WeatherApplet.prototype.ValidateLocation = function() {
    return __awaiter(this, void 0, void 0, function() {
      var location, loc, loc;
      return __generator(this, function(_a) {
        switch (_a.label) {
        case 0:
          location = null;
          if (!!this._manualLocation)
            return [ 3, 2 ];
          return [ 4, this.locProvider.GetLocation() ];
        case 1:
          location = _a.sent();
          if (!location)
            throw new Error(null);
          loc = location.lat + "," + location.lon;
          this.settings.setValue('location', loc);
          return [ 2, location ];
        case 2:
          loc = this._location.replace(" ", "");
          if (loc == undefined || loc == "") {
            this.HandleError({
              type : "hard",
              detail : "no location",
              userError : true,
              message : _(
                  "Make sure you entered a location or use Automatic location instead")
            });
            throw new Error(
                "No location given when setting is on Manual Location");
          }
          _a.label = 3;
        case 3:
          return [ 2, null ];
        }
      });
    });
  };
  WeatherApplet.prototype.ProcessWeatherData = function(weatherInfo,
                                                        locationData) {
    if (!!locationData) {
      this.weather.location.city = locationData.city;
      this.weather.location.country = locationData.country;
      this.weather.location.timeZone = locationData.timeZone;
      this.weather.coord.lat = locationData.lat;
      this.weather.coord.lon = locationData.lon;
    }
    this.weather.condition = weatherInfo.condition;
    this.weather.wind = weatherInfo.wind;
    this.weather.temperature = weatherInfo.temperature,
    this.weather.date = weatherInfo.date;
    this.weather.sunrise = weatherInfo.sunrise;
    this.weather.sunset = weatherInfo.sunset;
    this.weather.coord = weatherInfo.coord;
    this.weather.humidity = weatherInfo.humidity;
    this.weather.pressure = weatherInfo.pressure;
    if (!!weatherInfo.location.city)
      this.weather.location.city = weatherInfo.location.city;
    if (!!weatherInfo.location.country)
      this.weather.location.country = weatherInfo.location.country;
    if (!!weatherInfo.location.timeZone)
      this.weather.location.timeZone = weatherInfo.location.timeZone;
    if (!!weatherInfo.location.url)
      this.weather.location.url = weatherInfo.location.url;
    if (!!weatherInfo.extra_field)
      this.weather.extra_field = weatherInfo.extra_field;
    this.forecasts = weatherInfo.forecasts;
  };
  WeatherApplet.prototype.displayWeather = function() {
    try {
      var mainCondition = "";
      var descriptionCondition = "";
      if (this.weather.condition.main != null) {
        mainCondition = this.weather.condition.main;
        if (this._translateCondition) {
          mainCondition = capitalizeFirstLetter(_(mainCondition));
        }
      }
      if (this.weather.condition.description != null) {
        descriptionCondition =
            capitalizeFirstLetter(this.weather.condition.description);
        if (this._translateCondition) {
          descriptionCondition = _(descriptionCondition);
        }
      }
      var location = "";
      if (this.weather.location.city != null &&
          this.weather.location.country != null) {
        location =
            this.weather.location.city + ", " + this.weather.location.country;
      } else {
        location = Math.round(this.weather.coord.lat * 10000) / 10000 + ", " +
                   Math.round(this.weather.coord.lon * 10000) / 10000;
      }
      if (nonempty(this._locationLabelOverride)) {
        location = this._locationLabelOverride;
      }
      this.set_applet_tooltip(location + " - " + _("Updated") + " " +
                              AwareDateString(this.weather.date,
                                              this.currentLocale,
                                              this._show24Hours));
      this._currentWeatherSummary.text = descriptionCondition;
      var iconname = this.weather.condition.icon;
      if (iconname == null) {
        iconname = "weather-severe-alert";
      }
      this._currentWeatherIcon.icon_name = iconname;
      this._icon_type == St.IconType.SYMBOLIC
          ? this.set_applet_icon_symbolic_name(iconname)
          : this.set_applet_icon_name(iconname);
      var temp = "";
      if (this.weather.temperature != null) {
        temp = TempToUserUnits(this.weather.temperature, this._temperatureUnit)
                   .toString();
        this._currentWeatherTemperature.text =
            temp + ' ' + this.unitToUnicode(this._temperatureUnit);
      }
      var label = "";
      if (this._showCommentInPanel) {
        label += mainCondition;
      }
      if (this._showTextInPanel) {
        if (label != "") {
          label += " ";
        }
        label += (temp + ' ' + this.unitToUnicode(this._temperatureUnit));
      }
      this.set_applet_label(label);
      try {
        this.update_label_visible();
      } catch (e) {
      }
      if (this.weather.humidity != null) {
        this._currentWeatherHumidity.text =
            Math.round(this.weather.humidity) + "%";
      }
      var wind_direction = compassDirection(this.weather.wind.degree);
      this._currentWeatherWind.text =
          ((wind_direction != undefined) ? wind_direction + ' ' : '') +
          MPStoUserUnits(this.weather.wind.speed, this._windSpeedUnit) + ' ' +
          this._windSpeedUnit;
      this._currentWeatherApiUnique.text = "";
      this._currentWeatherApiUniqueCap.text = "";
      if (!!this.weather.extra_field) {
        this._currentWeatherApiUniqueCap.text =
            _(this.weather.extra_field.name);
        var value = void 0;
        switch (this.weather.extra_field.type) {
        case "percent":
          value = this.weather.extra_field.value.toString() + "%";
          break;
        case "temperature":
          value = TempToUserUnits(this.weather.extra_field.value,
                                  this._temperatureUnit) +
                  this.unitToUnicode(this._temperatureUnit);
          break;
        default:
          value = _(this.weather.extra_field.value);
          break;
        }
        this._currentWeatherApiUnique.text = value;
      }
      if (this.weather.pressure != null) {
        this._currentWeatherPressure.text =
            PressToUserUnits(this.weather.pressure, this._pressureUnit) + ' ' +
            _(this._pressureUnit);
      }
      this._currentWeatherLocation.label = location;
      this._currentWeatherLocation.url = this.weather.location.url;
      var sunriseText = "";
      var sunsetText = "";
      if (this.weather.sunrise != null && this.weather.sunset != null &&
          this._showSunrise) {
        sunriseText = (_('Sunrise') + ': ' +
                       GetHoursMinutes(this.weather.sunrise, this.currentLocale,
                                       this._show24Hours,
                                       this.weather.location.timeZone));
        sunsetText = (_('Sunset') + ': ' +
                      GetHoursMinutes(this.weather.sunset, this.currentLocale,
                                      this._show24Hours,
                                      this.weather.location.timeZone));
      }
      this._currentWeatherSunrise.text = sunriseText;
      this._currentWeatherSunset.text = sunsetText;
      return true;
    } catch (e) {
      this.log.Error("DisplayWeatherError: " + e);
      return false;
    }
  };
  ;
  WeatherApplet.prototype.displayForecast = function() {
    try {
      for (var i = 0; i < this._forecast.length; i++) {
        var forecastData = this.forecasts[i];
        var forecastUi = this._forecast[i];
        var t_low =
            TempToUserUnits(forecastData.temp_min, this._temperatureUnit);
        var t_high =
            TempToUserUnits(forecastData.temp_max, this._temperatureUnit);
        var first_temperature = this._temperatureHighFirst ? t_high : t_low;
        var second_temperature = this._temperatureHighFirst ? t_low : t_high;
        var comment = "";
        if (forecastData.condition.main != null &&
            forecastData.condition.description != null) {
          comment = (this._shortConditions)
                        ? forecastData.condition.main
                        : forecastData.condition.description;
          comment = capitalizeFirstLetter(comment);
          if (this._translateCondition)
            comment = _(comment);
        }
        if (this.weather.location.timeZone == null)
          forecastData.date.setMilliseconds(
              forecastData.date.getMilliseconds() +
              (this.weather.location.tzOffset * 1000));
        var dayName = GetDayName(forecastData.date, this.currentLocale,
                                 this.weather.location.timeZone);
        if (forecastData.date) {
          var now = new Date();
          if (forecastData.date.getDate() == now.getDate())
            dayName = _("Today");
          if (forecastData.date.getDate() ==
              new Date(now.setDate(now.getDate() + 1)).getDate())
            dayName = _("Tomorrow");
        }
        forecastUi.Day.text = dayName;
        forecastUi.Temperature.text = first_temperature + ' ' +
                                      '\u002F' +
                                      ' ' + second_temperature + ' ' +
                                      this.unitToUnicode(this._temperatureUnit);
        forecastUi.Summary.text = comment;
        forecastUi.Icon.icon_name = forecastData.condition.icon;
      }
      return true;
    } catch (e) {
      this.log.Error("DisplayForecastError " + e);
      return false;
    }
  };
  ;
  WeatherApplet.prototype.wipeCurrentData = function() {
    this.weather.date = null;
    this.weather.location.city = null;
    this.weather.location.country = null;
    this.weather.location.timeZone = null;
    this.weather.location.tzOffset = null;
    this.weather.location.url = null;
    this.weather.coord.lat = null;
    this.weather.coord.lon = null;
    this.weather.sunrise = null;
    this.weather.sunset = null;
    this.weather.wind.degree = null;
    this.weather.wind.speed = null;
    this.weather.temperature = null;
    this.weather.pressure = null;
    this.weather.humidity = null;
    this.weather.condition.main = null;
    this.weather.condition.description = null;
    this.weather.condition.icon = null;
    this.weather.extra_field = null;
  };
  ;
  WeatherApplet.prototype.wipeForecastData =
      function() { this.forecasts = []; };
  ;
  WeatherApplet.prototype.destroyCurrentWeather = function() {
    if (this._currentWeather.get_child() != null)
      this._currentWeather.get_child().destroy();
  };
  WeatherApplet.prototype.destroyFutureWeather = function() {
    if (this._futureWeather.get_child() != null)
      this._futureWeather.get_child().destroy();
  };
  WeatherApplet.prototype.showLoadingUi = function() {
    this.destroyCurrentWeather();
    this.destroyFutureWeather();
    this._currentWeather.set_child(
        new St.Label({text : _('Loading current weather ...')}));
    this._futureWeather.set_child(
        new St.Label({text : _('Loading future weather ...')}));
  };
  WeatherApplet.prototype.rebuild = function() {
    this.showLoadingUi();
    this.rebuildCurrentWeatherUi();
    this.rebuildFutureWeatherUi();
  };
  WeatherApplet.prototype.rebuildCurrentWeatherUi = function() {
    this.destroyCurrentWeather();
    var textOb = {text : ELLIPSIS};
    this._currentWeatherIcon = new St.Icon({
      icon_type : this._icon_type,
      icon_size : 64,
      icon_name : APPLET_ICON,
      style_class : STYLE_ICON
    });
    this._currentWeatherLocation = new St.Button({
      reactive : true,
      label : _('Refresh'),
    });
    this._currentWeatherLocation.style_class = STYLE_LOCATION_LINK;
    this._currentWeatherLocation.connect(
        SIGNAL_CLICKED, Lang.bind(this, function() {
          if (this._currentWeatherLocation.url == null) {
            this.refreshWeather();
          } else {
            Gio.app_info_launch_default_for_uri(
                this._currentWeatherLocation.url,
                global.create_app_launch_context());
          }
        }));
    this._currentWeatherSummary =
        new St.Label({text : _('Loading ...'), style_class : STYLE_SUMMARY});
    this._currentWeatherSunrise = new St.Label(textOb);
    this._currentWeatherSunset = new St.Label(textOb);
    var ab_spacerlabel = new St.Label({text : BLANK});
    var bb_spacerlabel = new St.Label({text : BLANK});
    var sunBox = new St.BoxLayout({style_class : STYLE_ASTRONOMY});
    sunBox.add_actor(this._currentWeatherSunrise);
    sunBox.add_actor(ab_spacerlabel);
    sunBox.add_actor(this._currentWeatherSunset);
    var middleColumn =
        new St.BoxLayout({vertical : true, style_class : STYLE_SUMMARYBOX});
    middleColumn.add_actor(this._currentWeatherLocation);
    middleColumn.add_actor(this._currentWeatherSummary);
    middleColumn.add_actor(bb_spacerlabel);
    middleColumn.add_actor(sunBox);
    this._currentWeatherTemperature = new St.Label(textOb);
    this._currentWeatherHumidity = new St.Label(textOb);
    this._currentWeatherPressure = new St.Label(textOb);
    this._currentWeatherWind = new St.Label(textOb);
    this._currentWeatherApiUnique = new St.Label({text : ''});
    this._currentWeatherApiUniqueCap = new St.Label({text : ''});
    var rb_captions = new St.BoxLayout(
        {vertical : true, style_class : STYLE_DATABOX_CAPTIONS});
    var rb_values =
        new St.BoxLayout({vertical : true, style_class : STYLE_DATABOX_VALUES});
    rb_captions.add_actor(new St.Label({text : _('Temperature:')}));
    rb_captions.add_actor(new St.Label({text : _('Humidity:')}));
    rb_captions.add_actor(new St.Label({text : _('Pressure:')}));
    rb_captions.add_actor(new St.Label({text : _('Wind:')}));
    rb_captions.add_actor(this._currentWeatherApiUniqueCap);
    rb_values.add_actor(this._currentWeatherTemperature);
    rb_values.add_actor(this._currentWeatherHumidity);
    rb_values.add_actor(this._currentWeatherPressure);
    rb_values.add_actor(this._currentWeatherWind);
    rb_values.add_actor(this._currentWeatherApiUnique);
    var rightColumn = new St.BoxLayout({style_class : STYLE_DATABOX});
    rightColumn.add_actor(rb_captions);
    rightColumn.add_actor(rb_values);
    var weatherBox = new St.BoxLayout();
    weatherBox.add_actor(middleColumn);
    weatherBox.add_actor(rightColumn);
    var box = new St.BoxLayout({style_class : STYLE_ICONBOX});
    box.add_actor(this._currentWeatherIcon);
    box.add_actor(weatherBox);
    this._currentWeather.set_child(box);
  };
  ;
  WeatherApplet.prototype.rebuildFutureWeatherUi = function() {
    this.destroyFutureWeather();
    this._forecast = [];
    this._forecastBox = new St.BoxLayout({
      vertical : this._verticalOrientation,
      style_class : STYLE_FORECAST_CONTAINER
    });
    this._futureWeather.set_child(this._forecastBox);
    for (var i = 0; i < this._forecastDays; i++) {
      var forecastWeather = {
        Icon : new St.Icon,
        Day : new St.Label,
        Summary : new St.Label,
        Temperature : new St.Label,
      };
      forecastWeather.Icon = new St.Icon({
        icon_type : this._icon_type,
        icon_size : 48,
        icon_name : APPLET_ICON,
        style_class : STYLE_FORECAST_ICON
      });
      forecastWeather.Day = new St.Label({style_class : STYLE_FORECAST_DAY});
      forecastWeather.Summary =
          new St.Label({style_class : STYLE_FORECAST_SUMMARY});
      forecastWeather.Temperature =
          new St.Label({style_class : STYLE_FORECAST_TEMPERATURE});
      var dataBox = new St.BoxLayout(
          {vertical : true, style_class : STYLE_FORECAST_DATABOX});
      dataBox.add_actor(forecastWeather.Day);
      dataBox.add_actor(forecastWeather.Summary);
      dataBox.add_actor(forecastWeather.Temperature);
      var forecastBox = new St.BoxLayout({style_class : STYLE_FORECAST_BOX});
      forecastBox.add_actor(forecastWeather.Icon);
      forecastBox.add_actor(dataBox);
      this._forecast[i] = forecastWeather;
      this._forecastBox.add_actor(forecastBox);
    }
  };
  WeatherApplet.prototype.noApiKey = function() {
    if (this._apiKey == undefined || this._apiKey == "") {
      return true;
    }
    return false;
  };
  ;
  WeatherApplet.prototype.unitToUnicode = function(
      unit) { return unit == "fahrenheit" ? '\u2109' : '\u2103'; };
  WeatherApplet.prototype.DisplayError = function(title, msg) {
    this.set_applet_label(title);
    this.set_applet_tooltip("Click to open");
    this.set_applet_icon_name("weather-severe-alert");
    this._currentWeatherSunset.text = msg;
  };
  ;
  WeatherApplet.prototype.HandleError = function(error) {
    if (this.encounteredError)
      return;
    this.encounteredError = true;
    if (error.type == "hard") {
      this.rebuild();
      this.DisplayError(this.errMsg[error.detail],
                        (!error.message) ? "" : error.message);
    }
    if (error.type == "soft") {
      if (this.IsDataTooOld()) {
        this.set_applet_tooltip("Click to open");
        this.set_applet_icon_name("weather-severe-alert");
        this._currentWeatherSunset.text = _(
            "Could not update weather for a while...\nare you connected to the internet?");
      }
    }
    if (error.userError) {
      this.pauseRefresh = true;
      return;
    }
    var nextRefresh = (this.errorCount > 0)
                          ? this.errorCount++ * this.LOOP_INTERVAL
                          : this.LOOP_INTERVAL;
    this.log.Error("Retrying in the next " + nextRefresh.toString() +
                   " seconds...");
  };
  WeatherApplet.prototype.HandleHTTPError = function(service, error, ctx,
                                                     callback) {
    var uiError = {
      type : "soft",
      detail : "unknown",
      message : _("Network Error, please check logs in Looking Glass"),
      service : service
    };
    if (typeof error === 'string' || error instanceof String) {
      ctx.log.Error("Error calling " + service + ": " + error.toString());
    } else {
      ctx.log.Error("Error calling " + service + " '" +
                    error.message.toString() +
                    "' Reason: " + error.reason_phrase.toString());
      uiError.detail = error.message;
      uiError.code = error.code;
      if (error.message == "bad api response - non json")
        uiError.type = "hard";
      if (!!callback && callback instanceof Function)
        uiError = callback(error, uiError);
    }
    ctx.HandleError(uiError);
  };
  return WeatherApplet;
}(Applet.TextIconApplet));
var Log = (function() {
  function Log(_instanceId) {
    this.debug = false;
    this.ID = _instanceId;
    this.debug = DEBUG;
  }
  Log.prototype.Print = function(message) {
    var msg = UUID + "#" + this.ID + ": " + message.toString();
    var debug = "";
    if (this.debug) {
      debug = this.GetErrorLine();
      global.log(msg, '\n', "On Line:", debug);
    } else {
      global.log(msg);
    }
  };
  Log.prototype.Error = function(error) {
    global.logError(UUID + "#" + this.ID + ": " + error.toString(), '\n',
                    "On Line:", this.GetErrorLine());
  };
  ;
  Log.prototype.Debug = function(message) {
    if (this.debug) {
      this.Print(message);
    }
  };
  Log.prototype.GetErrorLine = function() {
    var arr =
        (new Error).stack.split("\n").slice(-2)[0].split('/').slice(-1)[0];
    return arr;
  };
  return Log;
}());
var SIGNAL_CHANGED = 'changed::';
var SIGNAL_CLICKED = 'clicked';
var SIGNAL_REPAINT = 'repaint';
var STYLE_LOCATION_LINK = 'weather-current-location-link';
var STYLE_SUMMARYBOX = 'weather-current-summarybox';
var STYLE_SUMMARY = 'weather-current-summary';
var STYLE_DATABOX = 'weather-current-databox';
var STYLE_ICON = 'weather-current-icon';
var STYLE_ICONBOX = 'weather-current-iconbox';
var STYLE_DATABOX_CAPTIONS = 'weather-current-databox-captions';
var STYLE_ASTRONOMY = 'weather-current-astronomy';
var STYLE_FORECAST_ICON = 'weather-forecast-icon';
var STYLE_FORECAST_DATABOX = 'weather-forecast-databox';
var STYLE_FORECAST_DAY = 'weather-forecast-day';
var STYLE_CONFIG = 'weather-config';
var STYLE_DATABOX_VALUES = 'weather-current-databox-values';
var STYLE_FORECAST_SUMMARY = 'weather-forecast-summary';
var STYLE_FORECAST_TEMPERATURE = 'weather-forecast-temperature';
var STYLE_FORECAST_BOX = 'weather-forecast-box';
var STYLE_FORECAST_CONTAINER = 'weather-forecast-container';
var STYLE_PANEL_BUTTON = 'panel-button';
var STYLE_POPUP_SEPARATOR_MENU_ITEM = 'popup-separator-menu-item';
var STYLE_CURRENT = 'current';
var STYLE_FORECAST = 'forecast';
var STYLE_WEATHER_MENU = 'weather-menu';
var BLANK = '   ';
var ELLIPSIS = '...';
var EN_DASH = '\u2013';
function main(metadata, orientation, panelHeight, instanceId) {
  return new WeatherApplet(metadata, orientation, panelHeight, instanceId);
}
