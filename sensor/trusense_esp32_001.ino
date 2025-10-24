#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include "bme68xLibrary.h"
#include "config_private.h"

// Device info
const char* topicId = "0.0.7001056";

// API endpoints
const char* dataUrl = "https://trusense-web-server.onrender.com/data";
String settingsUrl = String("https://trusense-web-server.onrender.com/device-settings/") + topicId;

// Intervals (milliseconds)
int measurementInterval = 30000;   // default 30 seconds
int settingsCheckInterval = 60000; // check settings every 60 seconds

// Timing variables
unsigned long lastMeasurementTime = 0;
unsigned long lastSettingsCheck = 0;

// ======================== SENSOR ========================
Bme68x bme;

void initSensor() {
  Wire.begin(21, 22); // SDA, SCL for ESP32
  bme.begin(BME68X_I2C_ADDR_HIGH, Wire); // address 0x77
  bme.setTPH();
  bme.setHeaterProf(300, 100);
}

// ======================== SETTINGS CHECK ========================
void checkServerForNewSettings() {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  http.begin(settingsUrl);
  int httpCode = http.GET();

  if (httpCode == 200) {
    String payload = http.getString();
    Serial.println("Received settings: " + payload);

    // Manual parsing for "interval"
    int idx = payload.indexOf("interval");
    if (idx > 0) {
      int start = payload.indexOf(":", idx) + 1;
      int end = payload.indexOf(",", start);
      if (end < 0) end = payload.indexOf("}", start);
      if(payload.substring(start, end).toInt() != measurementInterval) {
        measurementInterval = payload.substring(start, end).toInt();
        Serial.printf("New measurement interval: %d ms\n", measurementInterval);
      }
    }

  } else {
    Serial.printf("Failed to fetch settings (HTTP %d)\n", httpCode);
  }

  http.end();
}

// ======================== MEASUREMENT LOGIC ========================
void sendMeasurement() {
  if (WiFi.status() != WL_CONNECTED) return;

  // Read BME680 sensor
  bme68xData data;
  bme.setOpMode(BME68X_FORCED_MODE);
  delay(1500 + bme.getMeasDur()/200); // safe wait
  float tempC = 0.0, humidity = 0.0, pressure_hPa = 0.0;
  if (bme.fetchData()) {
    bme.getData(data);

    if (!isnan(data.temperature) && !isnan(data.humidity) && !isnan(data.pressure)) {
      tempC = data.temperature;
      humidity = data.humidity;
      pressure_hPa = data.pressure / 100.0;

      Serial.printf("T: %.2f °C  H: %.2f %% P: %.2f hPa\n",
              tempC, humidity, pressure_hPa);

      // Send to server
      HTTPClient http;
      http.begin(dataUrl);
      http.addHeader("Content-Type", "application/json");

      char payload[256];
      snprintf(payload, sizeof(payload),
        "{\"topicId\":\"%s\",\"temperature\":%.2f,\"humidity\":%.2f,\"pressure\":%.2f}",
        topicId, tempC, humidity, pressure_hPa);

      int httpResponseCode = http.POST(payload);
      Serial.printf("Sent data → Response code: %d\n", httpResponseCode);

      http.end();
    }
  }
}

// ======================== SETUP ========================
void setup() {
  Serial.begin(115200);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n Connected to WiFi");

  // Initialize sensor
  initSensor();

  // Initial settings check
  checkServerForNewSettings();
  lastSettingsCheck = millis();
  lastMeasurementTime = millis();
}

// ======================== MAIN LOOP ========================
void loop() {
  unsigned long now = millis();

  // Check if it's time to fetch new settings
  if (now - lastSettingsCheck >= settingsCheckInterval) {
    checkServerForNewSettings();
    lastSettingsCheck = now;
  }

  // Check if it's time to send a measurement
  if (now - lastMeasurementTime >= measurementInterval) {
    sendMeasurement();
    lastMeasurementTime = now;
  }

  delay(50); // small non-blocking delay
}

