#include <ESP8266WiFi.h>
#include <WiFiManager.h>
#include <Firebase_ESP_Client.h>
//Provide the token generation process info.
#include "addons/TokenHelper.h"
//Provide the RTDB payload printing info and other helper functions.
#include "addons/RTDBHelper.h"

#define API_KEY "AIzaSyBpzBqy_Ia1jVaLchkPdFUe9YifRH2Fnq0"
#define DATABASE_URL "igg-test-808e9-default-rtdb.asia-southeast1.firebasedatabase.app/"

FirebaseData fbdo;

FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
int count = 0;
bool signupOK = false;

// Define the pins
const int relay = D0;
int MUX[4] = { D1, D2, D3, D4 };
const int signal = A0;
int LED1[3] = { D5, D7, D6 }; //RGB
int LED2[3] = { D8, 9, 10 };
const int waterPin = 7;
const int waterTriggerPin = 6;
const int dhtPin = D4;
const int lightPin = 3;
const int soilMoisturePin = 1;
int binChannel[4] = { 0, 0, 0, 0 };

// Value ranges
const int minWater = 0;
const int maxWater = 1024;
const int minSoilMosture = 330; //wet
const int maxSoilMosture = 635; //dry
const int minLight = 255; // Brightest
const int maxLight = 1024; // Darkest

bool connectWifi() {
    // Checking the wifi status
    WiFiManager wm;
    setColorLed(255, 0, 0, LED1);
    setColorLed(255, 0, 0, LED2);
    delay(2000);
    // Try to connect or turn on configuration web
    Serial.println("No connection.");
    Serial.println("Try to connect again");
    setColorLed(0, 0, 255, LED1);
    setColorLed(0, 0, 255, LED2);
    if (!wm.startConfigPortal("iGG Config Wifi", "samplePass")) {
        Serial.println("Failed to connect and hit timeout");
        return false;
    }
    for (int i = 0; i < 10; i++) {
        setColorLed(0, 255, 0, LED1);
        setColorLed(0, 255, 0, LED2);
        delay(500);
        offLed(LED1);
        offLed(LED2);
        delay(500);
    }
    //if you get here you have connected to the WiFi
    Serial.println("connected...yeey :)");
    return true;
}

void setup() {
    Serial.begin(115200);
    pinMode(LED_BUILTIN, OUTPUT);
    pinMode(relay, OUTPUT);
    digitalWrite(relay, LOW);
    for (int i = 0; i < 3; i++) {
        pinMode(LED1[i], OUTPUT);
        pinMode(LED2[i], OUTPUT);
        delay(300);
        analogWrite(LED1[i], 0);
        analogWrite(LED2[i], 0);
        delay(300);
    }
    for (int i = 0; i < 4; i++)
    {
        pinMode(MUX[i], OUTPUT);
        delay(100);
        digitalWrite(MUX[i], LOW);
    }

    config.api_key = API_KEY;
    config.database_url = DATABASE_URL;

    pinMode(signal, INPUT);
    WiFiManager wm;
    wm.autoConnect("iGG Config Wifi", "samplePass");
    if (Firebase.signUp(&config, &auth, "", "")) {
        Serial.println("ok");
        signupOK = true;
    }
    else {
        Serial.printf("%s\n", config.signer.signupError.message.c_str());
    }

    config.token_status_callback = tokenStatusCallback;

    Firebase.begin(&config, &auth);
    Firebase.reconnectWiFi(true);

}

void offLed(int pins[3]) {
    analogWrite(pins[0], 0);
    analogWrite(pins[1], 0);
    analogWrite(pins[2], 0);
}

void setColorLed(int red, int green, int blue, int led[3]) {
    analogWrite(led[0], red);
    analogWrite(led[1], green);
    analogWrite(led[2], blue);
}

void decimalToBinary(int decimal, int binaryArray[4]) {
    int s = 0;
    for (int i = 3; i >= 0; i--) {
        binaryArray[s] = decimal % 2;
        decimal /= 2;
        s++;
    }
}

void setChannel(int c) {
    decimalToBinary(c, binChannel);
    for (int i = 0; i < 4; i++) {
        digitalWrite(MUX[i], binChannel[i]);
    }
}

float readWaterLevel() {
    float res = 0.0;
    setChannel(waterPin);
    delay(100);
    int val = analogRead(signal);
    res = map(val, minWater, maxWater, 0, 4);
    return res;
}

int readSoilMoisture() {
    setChannel(soilPin);
    int val = analogRead(signal);
    val = map(val, minSoilMosture, maxSoilMosture, 100, 0);
    return val;
}

int readLight() {
    setChannel(lightPin);
    int val = analogRead(signal);
    val = map(val, minLight, maxLight, 100, 0);
    return val;
}

void onPump() {
    digitalWrite(relay, HIGH);
}

void offPump() {
    digitalWrite(relay, LOW);
}

void loop() {
    readSoilMoisture();
    // if (WiFi.status() != WL_CONNECTED) {
    //   connectWifi();
    // }
    // if (Firebase.ready() && signupOK && (millis() - sendDataPrevMillis > 3000 || sendDataPrevMillis == 0)){
    //   sendDataPrevMillis = millis();
    //   // Write an Int number on the database path int
    //   int val;
    //   val = readWaterLevel();
    //   if (Firebase.RTDB.setInt(&fbdo, "/water_level", val)) {
    //     Serial.println("WL: " + String(val));
    //   }
    //   val = readSoilMoisture();
    //   if (Firebase.RTDB.setInt(&fbdo, "/soil_moisture", val)) {
    //      Serial.println("SM: " + String(val));
    //   }
    //   val = readLight();
    //   if (Firebase.RTDB.setInt(&fbdo, "/light", val)) {
    //      Serial.println("L: " + String(val));
    //   }
    // }
}




