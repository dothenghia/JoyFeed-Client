#include "HX711.h"
#include <ESP8266WiFi.h>
#include <ESP8266Firebase.h>
#include <ESPAsyncWebSrv.h>

// 2 libraries for getting World Time
#include <NTPClient.h>
#include <WiFiUdp.h>

#define FIREBASE_HOST "https://vatly2-finalproject-default-rtdb.asia-southeast1.firebasedatabase.app/"
#define FIREBASE_AUTH "3INg6iazTAVbOqB9NUC8ke9HY1C4yGAnBJIm5gV9"
#define WIFI_SSID "Cao Khoi"
#define WIFI_PASSWORD "27022610"
#define ESP_SSID "joyfeed_wifi"
#define ESP_PASSWORD "123456789"

// Initializating for World Time
const long utcOffsetInSeconds = 7 * 3600;
char daysOfTheWeek[7][12] = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};

// Define NTP Client to get time
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", utcOffsetInSeconds);

// Firebase initialization
Firebase firebase(FIREBASE_HOST);
String path = "DeviceID_1/";
String ssid = "";
String password = "";

const char index_html[] PROGMEM = R"rawliteral(
<!DOCTYPE HTML><html><head>
  <title>ESP Input Form</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  </head><body>
  <form action="/get">
    wifi's name: <input type="text" name="wifi's name"></br>
    wifi's password: <input type="text" name="wifi's password"></br>
    <input type="submit" value="Submit">
  </form><br>
</body></html>)rawliteral";


// HX711 and Loadcell initialization
const int LOADCELL_DOUT_PIN = 12;
const int LOADCELL_SCK_PIN = 13;
HX711 scale;
float calibration_factor = -6050;

// Motor initialization
const int ena = 4;
const int in1 = 0;
const int in2 = 2;

// buzzer pin
const int buzzer = 5;

// ESP8266 Access Point
AsyncWebServer server(80);

void connect2wifi()
{
  // ESP8266 connect to wifi 
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.println("Connected.");
}

void setupAccessPoint()
{
  // Setup ESP as a Access Point and setup ESP to connect to an Access Point
  WiFi.softAP(ESP_SSID, ESP_PASSWORD);
  IPAddress apIP(192, 168, 1, 84);
  IPAddress subnet(255, 255, 255, 0);
  WiFi.softAPConfig(apIP, apIP, subnet);

  Serial.print("ESP32 IP as soft AP: ");
  Serial.println(WiFi.softAPIP());
 
  Serial.print("ESP32 IP on the WiFi network: ");
  Serial.println(WiFi.localIP());

  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send_P(200, "text/html", index_html);
  });

  // Send a GET request to <ESP_IP>/get?input1=<inputMessage>
  server.on("/get", HTTP_GET, [] (AsyncWebServerRequest *request) {
    String inputParam;
    String inputMessage;
    // GET input1 value on <ESP_IP>/get?input1=<inputMessage>
    ssid = request->getParam("wifi's name")->value();
    password = request->getParam("wifi's password")->value();
    request->send(200, "text/html", "HTTP GET request sent to your ESP on input field (with value: " + ssid + "," + password +
                                     "<br><a href=\"/\">Return to Home Page</a>");
  });

  server.begin();
}

float getWeight()
{
  scale.set_scale(calibration_factor);
  float weight = scale.get_units();
  return weight > 0 ? weight : 0;
}

void runMotor(float time)
{
  long long curTime = millis();
  while (millis() - curTime < time * 1000)
  {
    Serial.println("Start motor");
    digitalWrite(ena, HIGH);
    digitalWrite(in1, HIGH);
    digitalWrite(in2, LOW);
  }
  digitalWrite(ena, LOW);
  digitalWrite(in1, LOW);
  digitalWrite(in2, LOW);
}

void alert()
{
  tone(buzzer, 263, 1000);
}

void getWorldTime()
{
  timeClient.update();

  Serial.print(daysOfTheWeek[timeClient.getDay()]);
  Serial.print(", ");
  Serial.print(timeClient.getHours());
  Serial.print(":");
  Serial.print(timeClient.getMinutes());
  Serial.print(":");
  Serial.println(timeClient.getSeconds());
}

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  Serial.println("Connecting to WiFi");
  WiFi.mode(WIFI_AP_STA);
  // setupAccessPoint();
  connect2wifi();
  // Setup the Loadcell&HX711
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
  scale.set_scale();
  scale.tare(); //Reset the scale to 0
  long zero_factor = scale.read_average(); //Get a baseline reading

  // Setup for motor 
  pinMode(ena, OUTPUT);
  pinMode(in1, OUTPUT);
  pinMode(in2, OUTPUT);

  // Setup for buzzer
  pinMode(buzzer, OUTPUT);
}

void loop() {
  Serial.println("Hello");
  getWorldTime();
  String request = "None";
  request = firebase.getString(path + "request");
  Serial.println(request);
  if (request == "feed")
  {
    float time = firebase.getFloat(path + "feed_time");
    runMotor(time);
    float curWeight = getWeight();
    firebase.setFloat(path + "weight", curWeight);
    alert();
  }
  // Serial.println(WiFi.softAPIP());
  // Serial.println(WiFi.localIP());
}