#include "HX711.h"
#include <ESP8266WiFi.h>
#include <ESP8266Firebase.h>
#include <ESPAsyncWebSrv.h>

// 2 libraries for getting World Time
#include <NTPClient.h>
#include <WiFiUdp.h>

// Json
#include <ArduinoJson.h>

#define FIREBASE_HOST "https://joyfeed-6f7a8-default-rtdb.asia-southeast1.firebasedatabase.app/"
#define FIREBASE_AUTH "3INg6iazTAVbOqB9NUC8ke9HY1C4yGAnBJIm5gV9"
#define WIFI_SSID "HCMUS-I34"
#define WIFI_PASSWORD "phonghoc@i34"
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
String path = "Device_ID_001/";
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
float calibration_factor = -9050;

// ultrasonic sensor
const int trig_pin = 14;
const int echo_pin = 15;

// Motor initialization
const int ena = 4;
const int in1 = 0;
const int in2 = 2;

// buzzer pin
const int buzzer = 5;

// time limit for notification
float time_no_food = -1000*3600*12; //12 hours -> milliseconds
float time_no_eat = -1000*3600*12;
float time_after_eat = 5000;  //after 30mins
float eat_time = 0;
float H12 = 1000*3600*12;


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

String getWorldTime()
{
  timeClient.update();
  String time = "";
  Serial.print(daysOfTheWeek[timeClient.getDay()]);
  Serial.print(", ");
  Serial.print(timeClient.getHours());
  Serial.print(":");
  Serial.print(timeClient.getMinutes());
  Serial.print(":");
  Serial.println(timeClient.getSeconds());
  int h = timeClient.getHours();
  int m = timeClient.getMinutes();
  if(h < 10)
    time += "0"+String(h);
  else
    time += String(h);
  time += ":";
  if(m < 10)
    time += "0"+String(m);
  else
    time += String(m);  
  return time;
}

float getDistance()
{
  digitalWrite(trig_pin,0);
  delay(2);
  digitalWrite(trig_pin,1);
  delay(10);
  digitalWrite(trig_pin,0);
  
  float duration = pulseIn(echo_pin,1);
  float cm = duration * 0.034 / 2;
  return cm;
}

void sendOutOfFood() {
  WiFiClient client;

  const int port = 80;
  const char* host = "maker.ifttt.com";
  const char* request = "/trigger/HetThucAn/json/with/key/gPNlx2u00aAoP61jpWxwzhFHdEhi2qv92N3oobtwrFM";
  
  while(!client.connect(host, port)) {
    Serial.println("connection fail");
    delay(1000);
  }

  client.print(String("GET ") + request + " HTTP/1.1\r\n"
              + "Host: " + host + "\r\n"
              + "Connection: closes\r\n\r\n");
  
  delay(500);

  while(client.available()) {
    String line = client.readStringUntil('\r');
    Serial.print(line);
  }

  delay(500);
}

void sendNoEat() {
  WiFiClient client;

  const int port = 80;
  const char* host = "maker.ifttt.com";
  const char* request = "/trigger/BoAn/json/with/key/gPNlx2u00aAoP61jpWxwzhFHdEhi2qv92N3oobtwrFM";
  
  while(!client.connect(host, port)) {
    Serial.println("connection fail");
    delay(1000);
  }

  client.print(String("GET ") + request + " HTTP/1.1\r\n"
              + "Host: " + host + "\r\n"
              + "Connection: closes\r\n\r\n");
  
  delay(500);

  while(client.available()) {
    String line = client.readStringUntil('\r');
    Serial.print(line);
  }

  delay(500);
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

  //Setup for ultrasonic sensor
  pinMode(trig_pin, OUTPUT);
  pinMode(echo_pin, INPUT);
}

float eat_amount = 200;
void loop() {
  Serial.println("Hello");
  getWorldTime();
  String request = "None";
  request = "{" + firebase.getString(path) + "}";
  Serial.println(request);
  char json[1024];
  request.toCharArray(json, 1024);

  DynamicJsonDocument doc(1024);
  deserializeJson(doc, json);
  Serial.println(String(doc["feed_time"]));
  Serial.println(String(doc["feed_gram"]));
  int n = doc["n_feed"];
  for (int i=0;i<n;++i)
  {
    Serial.println(String(doc["feed_time"][i]));
    Serial.println(String(doc["feed_gram"][i]));

  }
  // if (request == "feed")
  // {
  //   float time = firebase.getFloat(path + "feed_time");
  //   runMotor(time);
  //   float curWeight = getWeight();
  //   firebase.setFloat(path + "weight", curWeight);
  //   alert();
  // }

  // Serial.println(WiFi.softAPIP());
  // Serial.println(WiFi.localIP());

  // //Detect out of food
  // float distance = getDistance();
  // float now = millis();
  // Serial.println(distance);
  // if(distance > 7 && now - time_no_food > H12)
  // {
  //     sendOutOfFood();
  //     time_no_food = now;
  // }

  // //Detect no eat
  // float w = getWeight();
  // if(now - eat_time > time_after_eat && now - time_no_eat > 5000 && w > 0.8*eat_amount)
  // {
  //   sendNoEat();
  //   time_no_eat = now;
  // }
  // Serial.println(w);
  delay(1000);
  

}
