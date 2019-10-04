const DEBUG = false;
function importModule(path) {
  if (typeof require !== "undefined") {
    return require("./" + path);
  } else {
    if (!AppletDir)
      var AppletDir = imports.ui.appletManager.applets["weather@mockturtl"];
    return AppletDir[path];
  }
}
const Cairo = imports.cairo;
const Lang = imports.lang;
const Main = imports.ui.main;
var Mainloop = imports.mainloop;
const Gio = imports.gi.Gio;
const Soup = imports.gi.Soup;
const St = imports.gi.St;
const GLib = imports.gi.GLib;
const GObject = imports.gi.GObject;
const Gettext = imports.gettext;
const Applet = imports.ui.applet;
const PopupMenu = imports.ui.popupMenu;
const Settings = imports.ui.settings;
const Util = imports.misc.util;
var utils = importModule("utils");
var GetDayName = utils.GetDayName;
var GetHoursMinutes = utils.GetHoursMinutes;
var capitalizeFirstLetter = utils.capitalizeFirstLetter;
var TempToUserUnits = utils.TempToUserUnits;
var PressToUserUnits = utils.PressToUserUnits;
var compassDirection = utils.compassDirection;
var MPStoUserUnits = utils.MPStoUserUnits;
var nonempty = utils.nonempty;
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
  Promise.prototype["catch"] = promisePoly.Promise.prototype["catch"];
  Promise.prototype.then = promisePoly.Promise.prototype.then;
  Promise.all = promisePoly.Promise.all;
  Promise.resolve = promisePoly.Promise.resolve;
  Promise.reject = promisePoly.Promise.reject;
  Promise.race = promisePoly.Promise.race;
  var globalNS = promisePoly.globalNS;
  if (!("Promise" in globalNS)) {
    globalNS["Promise"] = Promise;
  } else if (!globalNS.Promise.prototype["finally"]) {
    globalNS.Promise.prototype["finally"] = finallyConstructor;
  }
}
const ipApi = importModule("ipApi");
const UUID = "weather@mockturtl";
const APPLET_ICON = "view-refresh-symbolic";
const REFRESH_ICON = "view-refresh";
const CMD_SETTINGS = "cinnamon-settings applets " + UUID;
const DATA_SERVICE = {
  OPEN_WEATHER_MAP: "OpenWeatherMap",
  DARK_SKY: "DarkSky"
};
const WEATHER_LOCATION = "location";
const WEATHER_USE_SYMBOLIC_ICONS_KEY = "useSymbolicIcons";
const KEYS = {
  WEATHER_DATA_SERVICE: "dataService",
  WEATHER_API_KEY: "apiKey",
  WEATHER_TEMPERATURE_UNIT_KEY: "temperatureUnit",
  WEATHER_TEMPERATURE_HIGH_FIRST_KEY: "temperatureHighFirst",
  WEATHER_WIND_SPEED_UNIT_KEY: "windSpeedUnit",
  WEATHER_CITY_KEY: "locationLabelOverride",
  WEATHER_TRANSLATE_CONDITION_KEY: "translateCondition",
  WEATHER_VERTICAL_ORIENTATION_KEY: "verticalOrientation",
  WEATHER_SHOW_TEXT_IN_PANEL_KEY: "showTextInPanel",
  WEATHER_SHOW_COMMENT_IN_PANEL_KEY: "showCommentInPanel",
  WEATHER_SHOW_SUNRISE_KEY: "showSunrise",
  WEATHER_SHOW_24HOURS_KEY: "show24Hours",
  WEATHER_FORECAST_DAYS: "forecastDays",
  WEATHER_REFRESH_INTERVAL: "refreshInterval",
  WEATHER_PRESSURE_UNIT_KEY: "pressureUnit",
  WEATHER_SHORT_CONDITIONS_KEY: "shortConditions",
  WEATHER_MANUAL_LOCATION: "manualLocation"
};
Gettext.bindtextdomain(UUID, GLib.get_home_dir() + "/.local/share/locale");
function _(str) {
  return Gettext.dgettext(UUID, str);
}
class WeatherApplet extends Applet.TextIconApplet {
  constructor(metadata, orientation, panelHeight, instanceId) {
    super(orientation, panelHeight, instanceId);
    this.weather = {
      dateTime: null,
      location: {
        city: null,
        country: null,
        id: null,
        tzOffset: null,
        timeZone: null
      },
      coord: {
        lat: null,
        lon: null
      },
      sunrise: null,
      sunset: null,
      wind: {
        speed: null,
        degree: null
      },
      main: {
        temperature: null,
        pressure: null,
        humidity: null,
        temp_min: null,
        temp_max: null,
        feelsLike: null
      },
      condition: {
        id: null,
        main: null,
        description: null,
        icon: null
      },
      cloudiness: null
    };
    this.forecasts = [];
    this.currentLocale = null;
    this.systemLanguage = null;
    this._httpSession = new Soup.SessionAsync();
    this.locProvider = new ipApi.IpApi(this);
    this.lastUpdated = null;
    this.encounteredError = false;
    this.errMsg = {
      unknown: _("Error"),
      "bad api response - non json": _("Service Error"),
      "bad key": _("Incorrect API Key"),
      "bad api response": _("Service Error"),
      "bad location format": _("Incorrect Location Format"),
      "bad status code": _("Service Error"),
      "key blocked": _("Key Blocked"),
      "location not found": _("Can't find location"),
      "no api response": _("Service Error"),
      "no key": _("No Api Key"),
      "no location": _("No Location"),
      "no network response": _("Service Error"),
      "no reponse body": _("Service Error"),
      "no respone data": _("Service Error"),
      "unusal payload": _("Service Error")
    };
    this.currentLocale = this.constructJsLocale(GLib.get_language_names()[0]);
    this.systemLanguage = this.currentLocale.split("-")[0];
    this.settings = new Settings.AppletSettings(this, UUID, instanceId);
    this.log = new Log(instanceId);
    this._httpSession.user_agent =
      "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:37.0) Gecko/20100101 Firefox/37.0";
    Soup.Session.prototype.add_feature.call(
      this._httpSession,
      new Soup.ProxyResolverDefault()
    );
    this.SetAppletOnPanel();
    this.AddPopupMenu(orientation);
    this.BindSettings();
    this.AddRefreshButton();
    this.BuildPopupMenu();
    this.rebuild();
    this.RefreshLoop();
    this.orientation = orientation;
    try {
      this.setAllowedLayout(Applet.AllowedLayout.BOTH);
      this.update_label_visible();
    } catch (e) {}
  }
  SetAppletOnPanel() {
    this.set_applet_icon_name(APPLET_ICON);
    this.set_applet_label(_("..."));
    this.set_applet_tooltip(_("Click to open"));
  }
  AddPopupMenu(orientation) {
    this.menuManager = new PopupMenu.PopupMenuManager(this);
    this.menu = new Applet.AppletPopupMenu(this, orientation);
    if (typeof this.menu.setCustomStyleClass === "function")
      this.menu.setCustomStyleClass(STYLE_WEATHER_MENU);
    else {
      this.menu.actor.add_style_class_name(STYLE_WEATHER_MENU);
    }
    this.menuManager.addMenu(this.menu);
  }
  BindSettings() {
    for (let k in KEYS) {
      let key = KEYS[k];
      let keyProp = "_" + key;
      this.settings.bindProperty(
        Settings.BindingDirection.IN,
        key,
        keyProp,
        this.refreshAndRebuild,
        null
      );
    }
    this.settings.bindProperty(
      Settings.BindingDirection.BIDIRECTIONAL,
      WEATHER_LOCATION,
      "_" + WEATHER_LOCATION,
      this.refreshAndRebuild,
      null
    );
    this.settings.bindProperty(
      Settings.BindingDirection.IN,
      "keybinding",
      "keybinding",
      this._onKeySettingsUpdated,
      null
    );
    Main.keybindingManager.addHotKey(
      UUID,
      this.keybinding,
      Lang.bind(this, this.on_applet_clicked)
    );
    this.updateIconType();
    this.settings.connect(
      SIGNAL_CHANGED + WEATHER_USE_SYMBOLIC_ICONS_KEY,
      Lang.bind(this, function() {
        this.updateIconType();
        this._applet_icon.icon_type = this._icon_type;
        this._currentWeatherIcon.icon_type = this._icon_type;
        for (let i = 0; i < this._forecastDays; i++) {
          this._forecast[i].Icon.icon_type = this._icon_type;
        }
        this.refreshWeather();
      })
    );
  }
  AddRefreshButton() {
    let itemLabel = _("Refresh");
    let refreshMenuItem = new Applet.MenuItem(
      itemLabel,
      REFRESH_ICON,
      Lang.bind(this, function() {
        this.refreshWeather();
      })
    );
    this._applet_context_menu.addMenuItem(refreshMenuItem);
  }
  BuildPopupMenu() {
    this._currentWeather = new St.Bin({ style_class: STYLE_CURRENT });
    this._futureWeather = new St.Bin({ style_class: STYLE_FORECAST });
    this._separatorArea = new St.DrawingArea({
      style_class: STYLE_POPUP_SEPARATOR_MENU_ITEM
    });
    this._separatorArea.width = 200;
    this._separatorArea.connect(
      SIGNAL_REPAINT,
      Lang.bind(this, this._onSeparatorAreaRepaint)
    );
    let mainBox = new St.BoxLayout({ vertical: true });
    mainBox.add_actor(this._currentWeather);
    mainBox.add_actor(this._separatorArea);
    mainBox.add_actor(this._futureWeather);
    this.menu.addActor(mainBox);
  }
  refreshAndRebuild() {
    this.refreshWeather(true);
  }
  async LoadJsonAsync(query) {
    let json = await new Promise((resolve, reject) => {
      let message = Soup.Message.new("GET", query);
      this._httpSession.queue_message(message, (session, message) => {
        if (!message)
          reject({
            code: 0,
            message: "no network response",
            reason_phrase: "no network response"
          });
        if (message.status_code != 200)
          reject({
            code: message.status_code,
            message: "bad status code",
            reason_phrase: message.reason_phrase
          });
        if (!message.response_body)
          reject({
            code: message.status_code,
            message: "no reponse body",
            reason_phrase: message.reason_phrase
          });
        if (!message.response_body.data)
          reject({
            code: message.status_code,
            message: "no respone data",
            reason_phrase: message.reason_phrase
          });
        try {
          this.log.Debug(
            "API full response: " + message.response_body.data.toString()
          );
          let payload = JSON.parse(message.response_body.data);
          resolve(payload);
        } catch (e) {
          this.log.Error(
            "Error: API response is not JSON. The response: " +
              message.response_body.data
          );
          reject({
            code: message.status_code,
            message: "bad api response - non json",
            reason_phrase: e
          });
        }
      });
    });
    return json;
  }
  async locationLookup() {
    let command = "xdg-open ";
    Util.spawnCommandLine(
      command + "https://cinnamon-spices.linuxmint.com/applets/view/17"
    );
  }
  IsDataTooOld() {
    if (!this.lastUpdated) return true;
    let oldDate = this.lastUpdated;
    oldDate.setMinutes(oldDate.getMinutes() + this._refreshInterval * 2);
    return this.lastUpdated > oldDate;
  }
  RefreshLoop() {
    let loopInterval = 15;
    try {
      if (
        this.lastUpdated == null ||
        this.encounteredError ||
        new Date(this.lastUpdated.getTime() + this._refreshInterval * 60000) <
          new Date()
      ) {
        this.refreshWeather(false);
      }
    } catch (e) {
      this.log.Error("Error in Main loop: " + e);
      this.encounteredError = true;
    }
    Mainloop.timeout_add_seconds(
      loopInterval,
      Lang.bind(this, function mainloopTimeout() {
        this.RefreshLoop();
      })
    );
  }
  update_label_visible() {
    if (this.orientation == St.Side.LEFT || this.orientation == St.Side.RIGHT)
      this.hide_applet_label(true);
    else this.hide_applet_label(false);
  }
  on_orientation_changed(orientation) {
    this.orientation = orientation;
    this.refreshWeather(true);
  }
  _onKeySettingsUpdated() {
    if (this.keybinding != null) {
      Main.keybindingManager.addHotKey(
        UUID,
        this.keybinding,
        Lang.bind(this, this.on_applet_clicked)
      );
    }
  }
  on_applet_clicked(event) {
    this.menu.toggle();
  }
  _onSeparatorAreaRepaint(area) {
    let cr = area.get_context();
    let themeNode = area.get_theme_node();
    let [width, height] = area.get_surface_size();
    let margin = themeNode.get_length("-margin-horizontal");
    let gradientHeight = themeNode.get_length("-gradient-height");
    let startColor = themeNode.get_color("-gradient-start");
    let endColor = themeNode.get_color("-gradient-end");
    let gradientWidth = width - margin * 2;
    let gradientOffset = (height - gradientHeight) / 2;
    let pattern = new Cairo.LinearGradient(
      margin,
      gradientOffset,
      width - margin,
      gradientOffset + gradientHeight
    );
    pattern.addColorStopRGBA(
      0,
      startColor.red / 255,
      startColor.green / 255,
      startColor.blue / 255,
      startColor.alpha / 255
    );
    pattern.addColorStopRGBA(
      0.5,
      endColor.red / 255,
      endColor.green / 255,
      endColor.blue / 255,
      endColor.alpha / 255
    );
    pattern.addColorStopRGBA(
      1,
      startColor.red / 255,
      startColor.green / 255,
      startColor.blue / 255,
      startColor.alpha / 255
    );
    cr.setSource(pattern);
    cr.rectangle(margin, gradientOffset, gradientWidth, gradientHeight);
    cr.fill();
  }
  updateIconType() {
    this._icon_type = this.settings.getValue(WEATHER_USE_SYMBOLIC_ICONS_KEY)
      ? St.IconType.SYMBOLIC
      : St.IconType.FULLCOLOR;
  }
  constructJsLocale(locale) {
    let jsLocale = locale.split(".")[0];
    let tmp = jsLocale.split("_");
    jsLocale = "";
    for (let i = 0; i < tmp.length; i++) {
      if (i != 0) jsLocale += "-";
      jsLocale += tmp[i];
    }
    return jsLocale;
  }
  async refreshWeather(rebuild) {
    this.encounteredError = false;
    this.wipeCurrentData();
    this.wipeForecastData();
    try {
      if (!this._manualLocation) {
        let haveLocation = await this.locProvider.GetLocation();
        if (!haveLocation) return;
      } else {
        let loc = this._location.replace(" ", "");
        if (loc == undefined || loc == "") {
          this.HandleError({
            type: "hard",
            detail: "no location",
            noTriggerRefresh: true,
            message: _(
              "Make sure you entered a location or use Automatic location instead"
            )
          });
          this.log.Error(
            "No location given when setting is on Manual Location"
          );
          return;
        }
      }
      switch (this._dataService) {
        case DATA_SERVICE.DARK_SKY:
          if (darkSky == null) var darkSky = importModule("darkSky");
          this.provider = new darkSky.DarkSky(this);
          break;
        case DATA_SERVICE.OPEN_WEATHER_MAP:
          if (openWeatherMap == null)
            var openWeatherMap = importModule("openWeatherMap");
          this.provider = new openWeatherMap.OpenWeatherMap(this);
          break;
        default:
          return;
      }
      if (!(await this.provider.GetWeather())) {
        this.log.Error("Unable to obtain Weather Information");
        return;
      }
      if (rebuild) this.rebuild();
      if (!(await this.displayWeather()) || !(await this.displayForecast()))
        return;
      this.log.Print("Weather Information refreshed");
    } catch (e) {
      this.log.Error("Generic Error while refreshing Weather info: " + e);
      this.HandleError({
        type: "hard",
        detail: "unknown",
        message: _(
          "Unexpected Error While Refreshing Weather, please see log in Looking Glass"
        )
      });
      return;
    }
    this.lastUpdated = new Date();
    return;
  }
  displayWeather() {
    try {
      let mainCondition = "";
      let descriptionCondition = "";
      if (this.weather.condition.main != null) {
        mainCondition = this.weather.condition.main;
        if (this._translateCondition) {
          mainCondition = capitalizeFirstLetter(_(mainCondition));
        }
      }
      if (this.weather.condition.description != null) {
        descriptionCondition = capitalizeFirstLetter(
          this.weather.condition.description
        );
        if (this._translateCondition) {
          descriptionCondition = _(descriptionCondition);
        }
      }
      let location = "";
      if (
        this.weather.location.city != null &&
        this.weather.location.country != null
      ) {
        location =
          this.weather.location.city + ", " + this.weather.location.country;
      } else {
        location =
          Math.round(this.weather.coord.lat * 10000) / 10000 +
          ", " +
          Math.round(this.weather.coord.lon * 10000) / 10000;
      }
      if (nonempty(this._locationLabelOverride)) {
        location = this._locationLabelOverride;
      }
      this.set_applet_tooltip(location);
      this._currentWeatherSummary.text = descriptionCondition;
      let iconname = this.weather.condition.icon;
      if (iconname == null) {
        iconname = "weather-severe-alert";
      }
      this._currentWeatherIcon.icon_name = iconname;
      this._icon_type == St.IconType.SYMBOLIC
        ? this.set_applet_icon_symbolic_name(iconname)
        : this.set_applet_icon_name(iconname);
      let temp = "";
      if (this.weather.main.temperature != null) {
        temp = TempToUserUnits(
          this.weather.main.temperature,
          this._temperatureUnit
        ).toString();
        this._currentWeatherTemperature.text =
          temp + " " + this.unitToUnicode();
      }
      let label = "";
      if (this._showCommentInPanel) {
        label += mainCondition;
      }
      if (this._showTextInPanel) {
        if (label != "") {
          label += " ";
        }
        label += temp + " " + this.unitToUnicode();
      }
      this.set_applet_label(label);
      try {
        this.update_label_visible();
      } catch (e) {}
      if (this.weather.main.humidity != null) {
        this._currentWeatherHumidity.text =
          Math.round(this.weather.main.humidity) + "%";
      }
      let wind_direction = compassDirection(this.weather.wind.degree);
      this._currentWeatherWind.text =
        (wind_direction != undefined ? wind_direction + " " : "") +
        MPStoUserUnits(this.weather.wind.speed, this._windSpeedUnit) +
        " " +
        this._windSpeedUnit;
      switch (this._dataService) {
        case DATA_SERVICE.OPEN_WEATHER_MAP:
          if (this.weather.cloudiness != null) {
            this._currentWeatherApiUnique.text = this.weather.cloudiness + "%";
            this._currentWeatherApiUniqueCap.text = _("Cloudiness:");
          }
          break;
        case DATA_SERVICE.DARK_SKY:
          if (this.weather.main.feelsLike != null) {
            this._currentWeatherApiUnique.text =
              TempToUserUnits(
                this.weather.main.feelsLike,
                this._temperatureUnit
              ) + this.unitToUnicode();
            this._currentWeatherApiUniqueCap.text = _("Feels like:");
          }
          break;
        default:
          this._currentWeatherApiUnique.text = "";
          this._currentWeatherApiUniqueCap.text = "";
      }
      if (this.weather.main.pressure != null) {
        this._currentWeatherPressure.text =
          PressToUserUnits(this.weather.main.pressure, this._pressureUnit) +
          " " +
          _(this._pressureUnit);
      }
      this._currentWeatherLocation.label = location;
      switch (this._dataService) {
        case DATA_SERVICE.OPEN_WEATHER_MAP:
          this._currentWeatherLocation.url =
            "https://openweathermap.org/city/" + this.weather.location.id;
          break;
        case DATA_SERVICE.DARK_SKY:
          this._currentWeatherLocation.url =
            "https://darksky.net/forecast/" +
            this.weather.coord.lat +
            "," +
            this.weather.coord.lon;
          break;
        default:
          this._currentWeatherLocation.url = null;
      }
      let sunriseText = "";
      let sunsetText = "";
      if (
        this.weather.sunrise != null &&
        this.weather.sunset != null &&
        this._showSunrise
      ) {
        sunriseText =
          _("Sunrise") +
          ": " +
          GetHoursMinutes(
            this.weather.sunrise,
            this.currentLocale,
            this._show24Hours,
            this.weather.location.timeZone
          );
        sunsetText =
          _("Sunset") +
          ": " +
          GetHoursMinutes(
            this.weather.sunset,
            this.currentLocale,
            this._show24Hours,
            this.weather.location.timeZone
          );
      }
      this._currentWeatherSunrise.text = sunriseText;
      this._currentWeatherSunset.text = sunsetText;
      return true;
    } catch (e) {
      this.log.Error("DisplayWeatherError: " + e);
      return false;
    }
  }
  displayForecast() {
    try {
      for (let i = 0; i < this._forecast.length; i++) {
        let forecastData = this.forecasts[i];
        let forecastUi = this._forecast[i];
        let t_low = TempToUserUnits(
          forecastData.main.temp_min,
          this._temperatureUnit
        );
        let t_high = TempToUserUnits(
          forecastData.main.temp_max,
          this._temperatureUnit
        );
        let first_temperature = this._temperatureHighFirst ? t_high : t_low;
        let second_temperature = this._temperatureHighFirst ? t_low : t_high;
        let comment = "";
        if (
          forecastData.condition.main != null &&
          forecastData.condition.description != null
        ) {
          comment = this._shortConditions
            ? forecastData.condition.main
            : forecastData.condition.description;
          comment = capitalizeFirstLetter(comment);
          if (this._translateCondition) comment = _(comment);
        }
        if (this.weather.location.timeZone == null)
          forecastData.dateTime.setMilliseconds(
            forecastData.dateTime.getMilliseconds() +
              this.weather.location.tzOffset * 1000
          );
        let dayName = GetDayName(
          forecastData.dateTime,
          this.currentLocale,
          this.weather.location.timeZone
        );
        if (forecastData.dateTime) {
          let now = new Date();
          if (forecastData.dateTime.getDate() == now.getDate())
            dayName = _("Today");
          if (
            forecastData.dateTime.getDate() ==
            new Date(now.setDate(now.getDate() + 1)).getDate()
          )
            dayName = _("Tomorrow");
        }
        forecastUi.Day.text = dayName;
        forecastUi.Temperature.text =
          first_temperature +
          " " +
          "\u002F" +
          " " +
          second_temperature +
          " " +
          this.unitToUnicode();
        forecastUi.Summary.text = comment;
        forecastUi.Icon.icon_name = forecastData.condition.icon;
      }
      return true;
    } catch (e) {
      this.log.Error("DisplayForecastError " + e);
      return false;
    }
  }
  wipeCurrentData() {
    this.weather.dateTime = null;
    this.weather.location.city = null;
    this.weather.location.country = null;
    this.weather.location.id = null;
    this.weather.location.timeZone = null;
    this.weather.location.tzOffset = null;
    this.weather.coord.lat = null;
    this.weather.coord.lon = null;
    this.weather.sunrise = null;
    this.weather.sunset = null;
    this.weather.wind.degree = null;
    this.weather.wind.speed = null;
    this.weather.main.temperature = null;
    this.weather.main.pressure = null;
    this.weather.main.humidity = null;
    this.weather.main.temp_max = null;
    this.weather.main.temp_min = null;
    this.weather.condition.id = null;
    this.weather.condition.main = null;
    this.weather.condition.description = null;
    this.weather.condition.icon = null;
    this.weather.cloudiness = null;
  }
  wipeForecastData() {
    this.forecasts = [];
  }
  destroyCurrentWeather() {
    if (this._currentWeather.get_child() != null)
      this._currentWeather.get_child().destroy();
  }
  destroyFutureWeather() {
    if (this._futureWeather.get_child() != null)
      this._futureWeather.get_child().destroy();
  }
  showLoadingUi() {
    this.destroyCurrentWeather();
    this.destroyFutureWeather();
    this._currentWeather.set_child(
      new St.Label({
        text: _("Loading current weather ...")
      })
    );
    this._futureWeather.set_child(
      new St.Label({
        text: _("Loading future weather ...")
      })
    );
  }
  rebuild() {
    this.showLoadingUi();
    this.rebuildCurrentWeatherUi();
    this.rebuildFutureWeatherUi();
  }
  rebuildCurrentWeatherUi() {
    this.destroyCurrentWeather();
    let textOb = {
      text: ELLIPSIS
    };
    this._currentWeatherIcon = new St.Icon({
      icon_type: this._icon_type,
      icon_size: 64,
      icon_name: APPLET_ICON,
      style_class: STYLE_ICON
    });
    this._currentWeatherLocation = new St.Button({
      reactive: true,
      label: _("Refresh")
    });
    this._currentWeatherLocation.style_class = STYLE_LOCATION_LINK;
    this._currentWeatherLocation.connect(
      SIGNAL_CLICKED,
      Lang.bind(this, function() {
        if (this._currentWeatherLocation.url == null) {
          this.refreshWeather();
        } else {
          Gio.app_info_launch_default_for_uri(
            this._currentWeatherLocation.url,
            global.create_app_launch_context()
          );
        }
      })
    );
    this._currentWeatherSummary = new St.Label({
      text: _("Loading ..."),
      style_class: STYLE_SUMMARY
    });
    this._currentWeatherSunrise = new St.Label(textOb);
    this._currentWeatherSunset = new St.Label(textOb);
    let ab_spacerlabel = new St.Label({ text: BLANK });
    let bb_spacerlabel = new St.Label({ text: BLANK });
    let sunBox = new St.BoxLayout({ style_class: STYLE_ASTRONOMY });
    sunBox.add_actor(this._currentWeatherSunrise);
    sunBox.add_actor(ab_spacerlabel);
    sunBox.add_actor(this._currentWeatherSunset);
    let middleColumn = new St.BoxLayout({
      vertical: true,
      style_class: STYLE_SUMMARYBOX
    });
    middleColumn.add_actor(this._currentWeatherLocation);
    middleColumn.add_actor(this._currentWeatherSummary);
    middleColumn.add_actor(bb_spacerlabel);
    middleColumn.add_actor(sunBox);
    this._currentWeatherTemperature = new St.Label(textOb);
    this._currentWeatherHumidity = new St.Label(textOb);
    this._currentWeatherPressure = new St.Label(textOb);
    this._currentWeatherWind = new St.Label(textOb);
    this._currentWeatherApiUnique = new St.Label({ text: "" });
    this._currentWeatherApiUniqueCap = new St.Label({ text: "" });
    let rb_captions = new St.BoxLayout({
      vertical: true,
      style_class: STYLE_DATABOX_CAPTIONS
    });
    let rb_values = new St.BoxLayout({
      vertical: true,
      style_class: STYLE_DATABOX_VALUES
    });
    rb_captions.add_actor(new St.Label({ text: _("Temperature:") }));
    rb_captions.add_actor(new St.Label({ text: _("Humidity:") }));
    rb_captions.add_actor(new St.Label({ text: _("Pressure:") }));
    rb_captions.add_actor(new St.Label({ text: _("Wind:") }));
    rb_captions.add_actor(this._currentWeatherApiUniqueCap);
    rb_values.add_actor(this._currentWeatherTemperature);
    rb_values.add_actor(this._currentWeatherHumidity);
    rb_values.add_actor(this._currentWeatherPressure);
    rb_values.add_actor(this._currentWeatherWind);
    rb_values.add_actor(this._currentWeatherApiUnique);
    let rightColumn = new St.BoxLayout({ style_class: STYLE_DATABOX });
    rightColumn.add_actor(rb_captions);
    rightColumn.add_actor(rb_values);
    let weatherBox = new St.BoxLayout();
    weatherBox.add_actor(middleColumn);
    weatherBox.add_actor(rightColumn);
    let box = new St.BoxLayout({ style_class: STYLE_ICONBOX });
    box.add_actor(this._currentWeatherIcon);
    box.add_actor(weatherBox);
    this._currentWeather.set_child(box);
  }
  rebuildFutureWeatherUi() {
    this.destroyFutureWeather();
    this._forecast = [];
    this._forecastBox = new St.BoxLayout({
      vertical: this._verticalOrientation,
      style_class: STYLE_FORECAST_CONTAINER
    });
    this._futureWeather.set_child(this._forecastBox);
    for (let i = 0; i < this._forecastDays; i++) {
      let forecastWeather = {
        Icon: new St.Icon(),
        Day: new St.Label(),
        Summary: new St.Label(),
        Temperature: new St.Label()
      };
      forecastWeather.Icon = new St.Icon({
        icon_type: this._icon_type,
        icon_size: 48,
        icon_name: APPLET_ICON,
        style_class: STYLE_FORECAST_ICON
      });
      forecastWeather.Day = new St.Label({ style_class: STYLE_FORECAST_DAY });
      forecastWeather.Summary = new St.Label({
        style_class: STYLE_FORECAST_SUMMARY
      });
      forecastWeather.Temperature = new St.Label({
        style_class: STYLE_FORECAST_TEMPERATURE
      });
      let dataBox = new St.BoxLayout({
        vertical: true,
        style_class: STYLE_FORECAST_DATABOX
      });
      dataBox.add_actor(forecastWeather.Day);
      dataBox.add_actor(forecastWeather.Summary);
      dataBox.add_actor(forecastWeather.Temperature);
      let forecastBox = new St.BoxLayout({
        style_class: STYLE_FORECAST_BOX
      });
      forecastBox.add_actor(forecastWeather.Icon);
      forecastBox.add_actor(dataBox);
      this._forecast[i] = forecastWeather;
      this._forecastBox.add_actor(forecastBox);
    }
  }
  noApiKey() {
    if (this._apiKey == undefined || this._apiKey == "") {
      return true;
    }
    return false;
  }
  unitToUnicode() {
    return this._temperatureUnit == "fahrenheit" ? "\u2109" : "\u2103";
  }
  DisplayError(title, msg) {
    this.set_applet_label(title);
    this.set_applet_tooltip("Click to open");
    this.set_applet_icon_name("weather-severe-alert");
    this._currentWeatherSunset.text = msg;
  }
  HandleError(error) {
    if (this.encounteredError) return;
    this.encounteredError = true;
    if (error.type == "hard") {
      this.rebuild();
      this.DisplayError(
        this.errMsg[error.detail],
        !error.message ? "" : error.message
      );
    }
    if (error.type == "soft") {
      if (this.IsDataTooOld()) {
        this.set_applet_tooltip("Click to open");
        this.set_applet_icon_name("weather-severe-alert");
        this._currentWeatherSunset.text = _(
          "Could not update weather for a while...\nare you connected to the internet?"
        );
      }
    }
    if (error.noTriggerRefresh) {
      this.encounteredError = false;
      return;
    }
    this.log.Error("Retrying in the next 15 seconds...");
  }
  HandleHTTPError(service, error, ctx, callback) {
    let uiError = {
      type: "soft",
      detail: "unknown",
      message: _("Network Error, please check logs in Looking Glass"),
      service: service
    };
    if (typeof error === "string" || error instanceof String) {
      ctx.log.Error("Error calling " + service + ": " + error.toString());
    } else {
      ctx.log.Error(
        "Error calling " +
          service +
          " '" +
          error.message.toString() +
          "' Reason: " +
          error.reason_phrase.toString()
      );
      uiError.detail = error.message;
      uiError.code = error.code;
      if (error.message == "bad api response - non json") uiError.type = "hard";
      if (!!callback && callback instanceof Function)
        uiError = callback(error, uiError);
    }
    ctx.HandleError(uiError);
  }
}
class Log {
  constructor(_instanceId) {
    this.debug = false;
    this.ID = _instanceId;
    this.debug = DEBUG;
  }
  Print(message) {
    let msg = UUID + "#" + this.ID + ": " + message.toString();
    let debug = "";
    if (this.debug) {
      debug = this.GetErrorLine();
      global.log(msg, "\n", "On Line:", debug);
    } else {
      global.log(msg);
    }
  }
  Error(error) {
    global.logError(
      UUID + "#" + this.ID + ": " + error.toString(),
      "\n",
      "On Line:",
      this.GetErrorLine()
    );
  }
  Debug(message) {
    if (this.debug) {
      this.Print(message);
    }
  }
  GetErrorLine() {
    let arr = new Error().stack
      .split("\n")
      .slice(-2)[0]
      .split("/")
      .slice(-1)[0];
    return arr;
  }
}
const SIGNAL_CHANGED = "changed::";
const SIGNAL_CLICKED = "clicked";
const SIGNAL_REPAINT = "repaint";
const STYLE_LOCATION_LINK = "weather-current-location-link";
const STYLE_SUMMARYBOX = "weather-current-summarybox";
const STYLE_SUMMARY = "weather-current-summary";
const STYLE_DATABOX = "weather-current-databox";
const STYLE_ICON = "weather-current-icon";
const STYLE_ICONBOX = "weather-current-iconbox";
const STYLE_DATABOX_CAPTIONS = "weather-current-databox-captions";
const STYLE_ASTRONOMY = "weather-current-astronomy";
const STYLE_FORECAST_ICON = "weather-forecast-icon";
const STYLE_FORECAST_DATABOX = "weather-forecast-databox";
const STYLE_FORECAST_DAY = "weather-forecast-day";
const STYLE_CONFIG = "weather-config";
const STYLE_DATABOX_VALUES = "weather-current-databox-values";
const STYLE_FORECAST_SUMMARY = "weather-forecast-summary";
const STYLE_FORECAST_TEMPERATURE = "weather-forecast-temperature";
const STYLE_FORECAST_BOX = "weather-forecast-box";
const STYLE_FORECAST_CONTAINER = "weather-forecast-container";
const STYLE_PANEL_BUTTON = "panel-button";
const STYLE_POPUP_SEPARATOR_MENU_ITEM = "popup-separator-menu-item";
const STYLE_CURRENT = "current";
const STYLE_FORECAST = "forecast";
const STYLE_WEATHER_MENU = "weather-menu";
const BLANK = "   ";
const ELLIPSIS = "...";
const EN_DASH = "\u2013";
function main(metadata, orientation, panelHeight, instanceId) {
  return new WeatherApplet(metadata, orientation, panelHeight, instanceId);
}
