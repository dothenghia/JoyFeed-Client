// #include <ESP8266WiFi.h>
// #include <ESP8266Firebase.h>
#include <WiFi.h>
#include <ESP32Firebase.h>

// ======= Configure Firebase & WiFi
#define API_KEY "AIzaSyD7Hl6psEa09ktEpUcpAULhChv4pD8M6IU"
#define DATABASE_URL "joyfeed-6f7a8-default-rtdb.asia-southeast1.firebasedatabase.app/"

#define WIFI_SSID "Wokwi-GUEST" // Wifi name
#define WIFI_PASSWORD ""        // Wifi password

// ======= Firebase initialization
Firebase firebase(DATABASE_URL);
// String path = "light/"; // Lấy data của thuộc tính light
String path = "/light"; // Lấy data của thuộc tính light


// ======= Pin initialization
int led = 16;


// ======= Connect to WiFi
void connectWiFi() {
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    while (WiFi.status() != WL_CONNECTED) {
        Serial.print(".");
        delay(500);
    }
    Serial.println();
    Serial.println("Connected to Wifi!");
}


// ======= Connect to Firebase
void connectFirebase() {
    Serial.print("Connecting to Firebase...");
    while (!firebase.beginStream(firebaseData, path)) {
        Serial.println(firebaseData.errorReason());
        delay(500);
    }
    Serial.println("Connected to Firebase!");
}

void setup() {
    Serial.begin(115200);
    Serial.println("Hello World!");

    pinMode(led, OUTPUT);

    connectWiFi();
    // connectFirebase();
}



void loop() {
    delay(10); // this speeds up the simulation

    digitalWrite(led, HIGH);
}