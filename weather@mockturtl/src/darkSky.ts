export {}; // Declaring as a Module

function importModule(path: string): any {
    if (typeof require !== 'undefined') {
      return require('./' + path);
    } else {
      if (!AppletDir) var AppletDir = imports.ui.appletManager.applets['weather@mockturtl'];
      return AppletDir[path];
    }
  }

var utils = importModule("utils");
var isCoordinate = utils.isCoordinate as (text: any) => boolean;
var isLangSupported = utils.isLangSupported as (lang: string, languages: Array <string> ) => boolean;
var FahrenheitToKelvin = utils.FahrenheitToKelvin as (fahr: number) => number;
var CelsiusToKelvin = utils.CelsiusToKelvin as (celsius: number) => number;
var MPHtoMPS = utils.MPHtoMPS as (speed: number) => number;
var icons = utils.icons;
var weatherIconSafely = utils.weatherIconSafely as (code: string[], icon_type: string) => string;

//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
///////////                                       ////////////
///////////                DarkSky                ////////////
///////////                                       ////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////

class DarkSky implements WeatherProvider {

    //--------------------------------------------------------
    //  Properties
    //--------------------------------------------------------
    private descriptionLinelength = 25;
    private supportedLanguages = [
        'ar', 'az', 'be', 'bg', 'bs', 'ca', 'cs', 'da', 'de', 'el', 'en', 'es',
        'et', 'fi', 'fr', 'he', 'hr', 'hu', 'id', 'is', 'it', 'ja', 'ka', 'ko',
        'kw', 'lv', 'nb', 'nl', 'no', 'pl', 'pt', 'ro', 'ru', 'sk', 'sl', 'sr',
        'sv', 'tet', 'tr', 'uk', 'x-pig-latin', 'zh', 'zh-tw'];

    private query = "https://api.darksky.net/forecast/";

      // DarkSky Filter words for short conditions, won't work on every language
    private DarkSkyFilterWords = [_("and"), _("until"), _("in")];

    private unit: queryUnits = null;

    private app: WeatherApplet

    constructor(_app: WeatherApplet) {
        this.app = _app;
    }

    //--------------------------------------------------------
    //  Functions
    //--------------------------------------------------------
    public async GetWeather(): Promise<WeatherData> {
        let query = this.ConstructQuery();
        let json;
        if (query != "" && query != null) {
            this.app.log.Debug("DarkSky API query: " + query);
            try {
                json = await this.app.LoadJsonAsync(query);
            }
            catch(e) {
                this.app.HandleHTTPError("darksky", e, this.app, this.HandleHTTPError);
                return null;
            }

            if (!json) {
                this.app.HandleError({type: "soft", detail: "no api response", service: "darksky"});
                return null;
            }

            if (!json.code) {                   // No code, Request Success
                return this.ParseWeather(json);
            }
            else {
                this.HandleResponseErrors(json);
                return null;
            }
        }
        return null;
    };


    private ParseWeather(json: any): WeatherData {
        try {
            let result: WeatherData = {
                date: new Date(json.currently.time * 1000),
                coord: {
                    lat: json.latitude,
                    lon: json.longitude
                },
                location: {
                    url: "https://darksky.net/forecast/" + json.latitude + "," + json.longitude,
                    timeZone: json.timezone,
                },
                sunrise: new Date(json.daily.data[0].sunriseTime * 1000),
                sunset: new Date(json.daily.data[0].sunsetTime * 1000),
                wind: {
                    speed: this.ToMPS(json.currently.windSpeed),
                    degree: json.currently.windBearing
                },
                temperature: this.ToKelvin(json.currently.temperature),
                pressure: json.currently.pressure,
                humidity: json.currently.humidity * 100,
                condition: {
                    main: this.GetShortCurrentSummary(json.currently.summary),
                    description: json.currently.summary,
                    icon: weatherIconSafely(this.ResolveIcon(json.currently.icon), this.app._icon_type)
                },
                extra_field: {
                    name: _("Feels Like"),
                    value: this.ToKelvin(json.currently.apparentTemperature),
                    type: "temperature"
                },
                forecasts: []
            }
            // Forecast
            for (let i = 0; i < this.app._forecastDays; i++) {
                let day = json.daily.data[i];
                let forecast: ForecastData = {
                    date: new Date(day.time * 1000),
                      temp_min: this.ToKelvin(day.temperatureLow),
                      temp_max: this.ToKelvin(day.temperatureHigh),
                    condition: {
                      main: this.GetShortSummary(day.summary),
                      description: this.ProcessSummary(day.summary),
                      icon: weatherIconSafely(this.ResolveIcon(day.icon), this.app._icon_type),
                    },
                  };

                  // JS assumes time is local, so it applies the correct offset creating the Date (including Daylight Saving)
                  // but when using the date when daylight saving is active, it DOES NOT apply the DST back,
                  // So we offset the date to make it Noon
                  forecast.date.setHours(forecast.date.getHours() + 12);

                  result.forecasts.push(forecast);
            }
            return result;
        }
        catch(e) {
            this.app.log.Error("DarkSky payload parsing error: " + e)
            this.app.HandleError({type: "soft", detail: "unusal payload", service: "darksky", message: _("Failed to Process Weather Info")});
            return null;
        }
    };


    private ConstructQuery(): string {
        this.SetQueryUnit();
        let query;
        let key = this.app._apiKey.replace(" ", "");
        let location = this.app._location.replace(" ", "");
        if (this.app.noApiKey()) {
            this.app.log.Error("DarkSky: No API Key given");
            this.app.HandleError({
                type: "hard",
                 userError: true,
                  "detail": "no key",
                   message: _("Please enter API key in settings,\nor get one first on https://darksky.net/dev/register")});
            return "";
        }
        if (isCoordinate(location)) {
            query = this.query + key + "/" + location +
            "?exclude=minutely,hourly,flags" + "&units=" + this.unit;
            this.app.log.Debug(this.app.systemLanguage);
            if (isLangSupported(this.app.systemLanguage, this.supportedLanguages) && this.app._translateCondition) {
                query = query + "&lang=" + this.app.systemLanguage;
            }
            return query;
        }
        else {
            this.app.log.Error("DarkSky: Location is not a coordinate");
            this.app.HandleError({type: "hard", detail: "bad location format", service:"darksky", userError: true, message: ("Please Check the location,\nmake sure it is a coordinate") })
            return "";
        }
    };


    private HandleResponseErrors(json: any): void {
        let code = json.code;
        let error = json.error;
        let errorMsg = "DarkSky API: "
        this.app.log.Debug("DarksSky API error payload: " + json);
        switch(code) {
            case "400":
                this.app.log.Error(errorMsg + error);
                break;
            default:
                this.app.log.Error(errorMsg + error);
                break
        }
    };

    /** Handles API Scpecific HTTP errors  */
    public HandleHTTPError(error: HttpError, uiError: AppletError): AppletError {
        if (error.code == 403) { // DarkSky returns auth error on the http level when key is wrong
            uiError.detail = "bad key"
            uiError.message = _("Please Make sure you\nentered the API key correctly and your account is not locked");
            uiError.type = "hard";
            uiError.userError = true;
        }
        return uiError;
    }

    private ProcessSummary(summary: string): string {
        let processed = summary.split(" ");
        let result = "";
        let linelength = 0;
        for (let i = 0; i < processed.length; i++) {
            if (linelength + processed[i].length > this.descriptionLinelength) {
                result = result + "\n";
                linelength = 0;
            }
            result = result + processed[i] + " ";
            linelength = linelength + processed[i].length + 1;
        }
        return result;
    };

    private GetShortSummary(summary: string): string {
        let processed = summary.split(" ");
        let result = "";
        for (let i = 0; i < 2; i++) {
            if (!/[\(\)]/.test(processed[i]) && !this.WordBanned(processed[i])) {
                result = result + processed[i] + " ";
            }
        }
        return result;
    };

    private GetShortCurrentSummary(summary: string): string {
        let processed = summary.split(" ");
        let result = "";
        let maxLoop;
        (processed.length < 2) ? maxLoop = processed.length : maxLoop = 2;
        for (let i = 0; i < maxLoop; i++) {
            if (processed[i] != "and") {
                result = result + processed[i] + " ";
            }
        }
        return result;
    }

    private WordBanned(word: string): boolean {
        return this.DarkSkyFilterWords.indexOf(word) != -1;
    }

    private ResolveIcon(icon: string): string[] {
        switch (icon) {
            case "rain":
              return [icons.rain, icons.showers_scattered, icons.rain_freezing]
            case "snow":
              return [icons.snow]
            case "fog":
              return [icons.fog]
           // case "04d":/* broken clouds day */
           //   return ['weather_overcast', 'weather-clouds', "weather-few-clouds"]
            //case "04n":/* broken clouds night */
            //  return ['weather_overcast', 'weather-clouds', "weather-few-clouds-night"]
           // case "03n":/* mostly cloudy (night) */
           //   return ['weather-clouds-night', 'weather-few-clouds-night']
            case "cloudy":/* mostly cloudy (day) */
              return [icons.overcast, icons.clouds, icons.few_clouds_day]
            case "partly-cloudy-night":
              return [icons.few_clouds_night, icons.few_clouds_day]
            case "partly-cloudy-day":
              return [icons.few_clouds_day]
            case "clear-night":
              return [icons.clear_night]
            case "clear-day":
              return [icons.clear_day]
            // Have not seen Storm or Showers icons returned yet
            case "storm":
              return [icons.storm]
            case "showers":
              return [icons.showers]
            // There is no guarantee that there is a wind icon
            case "wind":
                return ["weather-wind", "wind", "weather-breeze", icons.clouds, icons.few_clouds_day]
            default:
              return [icons.alert]
          }
    };

    private SetQueryUnit(): void {
        if (this.app._temperatureUnit == "celsius"){
            if (this.app._windSpeedUnit == "kph" || this.app._windSpeedUnit == "m/s") {
                this.unit = 'si';
            }
            else {
                this.unit = 'uk2';
            }
        }
        else {
            this.unit = 'us';
        }
    };

    private ToKelvin(temp: number): number {
        if (this.unit == 'us') {
            return FahrenheitToKelvin(temp);
        }
        else {
            return CelsiusToKelvin(temp);
        }

    };

    private ToMPS(speed: number): number {
        if (this.unit == 'si') {
            return speed;
        }
        else {
            return MPHtoMPS(speed);
        }
    };
};

/**
 * - 'si' returns meter/sec and Celsius
 * - 'us' returns miles/hour and Farhenheit
 * - 'uk2' return miles/hour and Celsius
 */
type queryUnits = 'si' | 'us' | 'uk2';
