// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

const Gpio = require('onoff').Gpio;
const redLED = new Gpio(15, 'out');
const greenLED = new Gpio(17, 'out');

// Toggle the state of the LEDs every 200ms
const flashRed = setInterval(_ => redLED.writeSync(redLED.readSync() ^ 1), 200);
const flashGreen = setInterval(_ => greenLED.writeSync(greenLED.readSync() ^ 1), 200);

// Stop blinking the LED after 5 seconds
setTimeout(_ => {
  clearInterval(flashRed); // Stop blinking
  clearInterval(flashGreen); // Stop blinking
  redLED.unexport();    // Unexport GPIO and free resources
  greenLED.unexport();    // Unexport GPIO and free resources
}, 5000);

try {
    var security = require("./security.json");
// do stuff
} catch (ex) {
    var security = require("/mnt/security/security.json");
}

// The device connection string to authenticate the device with your IoT hub.
//
// NOTE:
// For simplicity, this sample sets the connection string in code.
// In a production environment, the recommended approach is to use
// an environment variable to make it available to your application
// or use an HSM or an x509 certificate.
// https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-security
//
// Using the Azure CLI:
// az iot hub device-identity show-connection-string --hub-name {YourIoTHubName} --device-id MyNodeDevice --output table
var connectionString = security.connectionString;

// Using the Node.js Device SDK for IoT Hub:
//   https://github.com/Azure/azure-iot-sdk-node
// The sample connects to a device-specific MQTT endpoint on your IoT Hub.
var Mqtt = require('azure-iot-device-mqtt').Mqtt;
var DeviceClient = require('azure-iot-device').Client
var Message = require('azure-iot-device').Message;

var client = DeviceClient.fromConnectionString(connectionString, Mqtt);

// Create a message and send it to the IoT hub every second
setInterval(function(){
  // Simulate telemetry.
  var temperature = 20 + (Math.random() * 15);
  var message = new Message(JSON.stringify({
    temperature: temperature,
    humidity: 60 + (Math.random() * 20)
  }));

  // Add a custom application property to the message.
  // An IoT hub can filter on these properties without access to the message body.
  message.properties.add('temperatureAlert! Hello IoT North', (temperature > 30) ? 'true' : 'false');

  console.log('Sending message to the IoT Hub! ' + message.getData());

  // Send the message.
  client.sendEvent(message, function (err) {
    if (err) {
      console.error('send error: ' + err.toString());
    } else {
      console.log('message sent to the IoT Hub...!');
    }
  });
}, 1000);