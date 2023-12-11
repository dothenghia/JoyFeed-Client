#include "HX711.h"
#include <ESP8266WiFi.h>
#include <ESP8266Firebase.h>

#define FIREBASE_HOST "https://vatly2-finalproject-default-rtdb.asia-southeast1.firebasedatabase.app/"
#define FIREBASE_AUTH "3INg6iazTAVbOqB9NUC8ke9HY1C4yGAnBJIm5gV9"
#define WIFI_SSID "Cao Khoi"
#define WIFI_PASSWORD "27022610"

// Firebase initialization
Firebase firebase(FIREBASE_HOST);
String path = "Account/";

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
const int buzzer = 15;

void setup() {
    // put your setup code here, to run once:
    Serial.begin(115200);
    Serial.println("Connecting to WiFi");

    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    while (WiFi.status() != WL_CONNECTED) {
        Serial.print(".");
        delay(500);
    }
    Serial.println();
    Serial.println("Connected.");

    scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
    scale.set_scale();
    scale.tare(); //Reset the scale to 0
    long zero_factor = scale.read_average(); //Get a baseline reading

    pinMode(ena, OUTPUT);
    pinMode(in1, OUTPUT);
    pinMode(in2, OUTPUT);
}

float getWeight() {
    scale.set_scale(calibration_factor);
    float weight = scale.get_units();
    return weight > 0 ? weight : 0;
}

void loop() {
    // float curWeight = getWeight();
    // firebase.setFloat(path, curWeight);
    Serial.println("Start motor");
    digitalWrite(ena, HIGH);
    digitalWrite(in1, HIGH);
    digitalWrite(in2, LOW);

}