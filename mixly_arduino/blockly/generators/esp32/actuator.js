'use strict';

goog.provide('Blockly.Python.actuator');
goog.require('Blockly.Python');


Blockly.Python.esp32_mixgo_music_pitch = function(block) {
  //Blockly.Python.definitions_['import_ESP32_*'] = 'from ESP32 import *';
  Blockly.Python.definitions_['import_music'] = 'import music';
  Blockly.Python.definitions_['import_math'] = 'import math';
  Blockly.Python.definitions_['import_machine_*'] = 'from machine import *';
  var number_pitch = Blockly.Python.valueToCode(block, 'pitch', Blockly.Python.ORDER_ATOMIC);
  // var number_duration = Blockly.Python.valueToCode(block, 'duration', Blockly.Python.ORDER_ATOMIC);
  var pin = Blockly.Python.valueToCode(block, 'PIN', Blockly.Python.ORDER_ATOMIC);
  var code = 'music.pitch(round(' + number_pitch + '), PWM(Pin(' + pin + ')))\n';
  return code;
};

Blockly.Python.esp32_mixgo_music_stop = function(block) {
  Blockly.Python.definitions_['import_music'] = 'import music';
  Blockly.Python.definitions_['import_machine_*'] = 'from machine import *';
  var pin = Blockly.Python.valueToCode(block, 'PIN', Blockly.Python.ORDER_ATOMIC);
  //Blockly.Python.setups_['music'+pin] ='music'+pin+'.pwm(Pin('+pin+'))\n'+'music'+pin+'.duty(512)\n';
  var code = 'music.stop(PWM(Pin('+pin+')))\n';
  return code;
};

Blockly.Python.servo_move = function() {
  Blockly.Python.definitions_['import_servo'] = 'import servo';
  Blockly.Python.definitions_['import_machine_*'] = 'from machine import *';
  var dropdown_pin = Blockly.Python.valueToCode(this, 'PIN',Blockly.Python.ORDER_ATOMIC);
  var value_degree = Blockly.Python.valueToCode(this, 'DEGREE', Blockly.Python.ORDER_ATOMIC);
  var code = 'servo.write_angle(PWM(Pin('+dropdown_pin+')),'+value_degree+')\n';
  return code;
};

Blockly.Python.number = function () {
    var code = this.getFieldValue('op');
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.light = function () {
    var code = this.getFieldValue('flag');
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.actuator_led_bright= function() {
    Blockly.Python.definitions_['import_ESP32_*'] = 'from ESP32 import *';
    var op = Blockly.Python.valueToCode(this,'led', Blockly.Python.ORDER_ATOMIC);
    var flag = this.getFieldValue('bright');
    var code = "led.setonoff("+op+",'"+flag+"')\n";
    return code;
};

Blockly.Python.actuator_get_led_bright= function() {
    Blockly.Python.definitions_['import_ESP32_*'] = 'from ESP32 import *';
    var op = Blockly.Python.valueToCode(this,'led', Blockly.Python.ORDER_ATOMIC);
    var code = "led.getonoff("+op+")";
    return [code, Blockly.Python.ORDER_ATOMIC];;
};

Blockly.Python.actuator_led_brightness= function() {
    Blockly.Python.definitions_['import_ESP32_*'] = 'from ESP32 import *';
    var op = Blockly.Python.valueToCode(this,'led', Blockly.Python.ORDER_ATOMIC);
    var flag = Blockly.Python.valueToCode(this,'bright', Blockly.Python.ORDER_ATOMIC);
    var code = 'led.setbrightness('+op+','+flag+')\n';
    return code;
};

Blockly.Blocks.led_light=Blockly.Blocks.actuator_led_bright;
Blockly.Blocks.get_led_bright=Blockly.Blocks.actuator_get_led_bright;
Blockly.Blocks.led_brightness=Blockly.Blocks.actuator_led_brightness;
Blockly.Blocks.esp32_music_pitch=Blockly.Blocks.esp32_mixgo_music_pitch;
Blockly.Blocks.esp32_music_stop=Blockly.Blocks.esp32_mixgo_music_stop