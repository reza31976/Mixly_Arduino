'use strict';

var base_url = conf.url + '/blockly/sims/microbit_python/';
Sk.externalLibraries = {
    // added as a farewell message to a school direct student
    microbit: {
        path: base_url + 'microbit/__init__.js',
        dependencies: [
            base_url + 'microbit/display.js',
            base_url + 'microbit/accelerometer.js',
            base_url + 'microbit/compass.js',
        ]
    },
    music: {
        path: conf.url + '/blockly/sims/microbit_python/music/__init__.js'
    },
    speech: {
        path: conf.url + '/blockly/sims/microbit_python/speech/__init__.js',
        dependencies: [conf.url + '/blockly/sims/microbit_python/speech/sam.js']
    },
    neopixel: {
        path: conf.url + '/blockly/sims/microbit_python/neopixel/__init__.js'
    },
}


var ui = {
    init: function () {
        // 初始化模拟外部操作界面
        var val = $('#monitor_select').children('option:selected').val();
        $('#monitor_' + val + '_div').show();
        $('#monitor_select').change(function () {
            var options = $(this).children('option');
            for (var i = 0; i < options.length; i ++) {
                var id = '#monitor_' + options[i].value + '_div';
                $(id).hide();
            }
            var val = $(this).children('option:selected').val();
            var id = '#monitor_' + val + '_div';
            $(id).show();
        });

        // 温度界面
        var ts = $("#temperature_slider").slider();
        ts.slider('setValue', mbData.temperature);
        $("#curr_temperature").text(mbData.temperature);
        $("#temperature_slider").on("slide", function(slideEvt) {
            $("#curr_temperature").text(slideEvt.value);
        });

        // 指南针界面
        var compass_el_arr = ['compass_heading', 'compass_x', 'compass_y', 'compass_z'];
        for (var i = 0; i < compass_el_arr.length; i ++) {
            var key = compass_el_arr[i].split('_')[1];
            var sdr = $("#" + compass_el_arr[i] + "_slider").slider();
            sdr.slider('setValue', mbData.compass[key]);
            $("#curr_" + compass_el_arr[i]).text(mbData.compass[key]);
            $("#" + compass_el_arr[i] + "_slider").on("slide", function(slideEvt) {
                var sliderId = slideEvt.currentTarget.getAttribute('id').replace('_slider', '');
                $("#curr_" + sliderId).text(slideEvt.value);
            });
        }

        // 超声波测距界面
        var ts = $("#HCSR04_slider").slider();
        ts.slider('setValue', mbData.distance);
        $("#curr_HCSR04").text(mbData.distance);
        $("#HCSR04_slider").on("slide", function(slideEvt) {
            $("#curr_HCSR04").text(slideEvt.value);
        });

        //neopixel
        $('#neopixel').hide();

        // 舵机
        ui.servoChart = echarts.init(document.getElementById('servo'));
        ui.servoOption = {
            tooltip : {
                formatter: "{b} : {c}%"
            },
            toolbox: {
                feature: {
                }
            },
            series: [
                {
                    name: '舵机',
                    type: 'gauge',
                    detail: {
                        formatter:'{value}',
                        fontSize: '10px',
                    },
                    data: [{value: 150, name: '舵机'}],
                    min: 0,
                    max: 180,
                    splitNumber: 4
                }
            ]
        };
        ui.servoChart.setOption(ui.servoOption, true);
        $('#servo').hide();
    },
    reset: function () {

    },
    bindBtnEvent: function (btn_id, mod_btn_arr) {
        $('#' + btn_id).on("mousedown mouseup click", function(e) {
            for (var i = 0; i < mod_btn_arr.length; i ++) {
                switch(e.type) {
                    case 'mousedown':
                        mod_btn_arr[i].pressed = true;
                        break;
                    case 'mouseup':
                        mod_btn_arr[i].pressed = false;
                        break;
                    case 'click':
                        mod_btn_arr[i].presses ++;
                        break;
                }
            }
        });
    },
    bindSliderEvent: function (sliderId, data, key) {
        var id = "#" + sliderId + "_slider";
        $(id).on('slide', function (slideEvt) {
            data[key] = slideEvt.value;
            $("#curr_" + sliderId).text(slideEvt.value);
        })
    },
    bindCompassEvent: function (sliderId, data, key) {
        ui.bindSliderEvent(sliderId, data, key);
    },
    bindTemperatureEvent: function (sliderId, data, key) {
        ui.bindSliderEvent(sliderId, data, key);
    },
    bindHCSR04Event: function (sliderId, data, key) {
        ui.bindSliderEvent(sliderId, data, key);
    },
    setLED: function (x, y, brightness) {
		$('.mb_led.mb_led_row_' + y + '.mb_led_col_' + x).removeClass('mb_led_brightness_1 mb_led_brightness_2 mb_led_brightness_3 mb_led_brightness_4 mb_led_brightness_5 mb_led_brightness_6 mb_led_brightness_7 mb_led_brightness_8 mb_led_brightness_9').addClass('mb_led_brightness_' + brightness);
	},
    output: function (s) {
        console.log(s);
    },
    updateMicrobitPins: function () {
        //not implement
    },
    updateNeopixel: function (leds) {
        var el = $('#neopixel');
        el.empty();
        for (var i = 0; i < leds.length; i ++) {
            var currLed = leds[i];
            var color = currLed.join(',');
            el.append('<img class="neopixel-led" style="background-color: rgb(' + color + ');">');
        }
        el.css('width', 35 * leds.length + 'px');
        $('#neopixel').show();
    },
    updateServo: function (degree) {
        ui.servoOption.series[0].data[0].value = degree;
        ui.servoChart.setOption(ui.servoOption, true);
        $('#servo').show();
    }
}

var sim = {
    runAsync: function (asyncFunc) {
        var p = new Promise(asyncFunc);
        var result;
        var susp = new Sk.misceval.Suspension();
        susp.resume = function() {
            return result;
        }
        susp.data = {
            type: "Sk.promise",
            promise: p.then(function(value) {
                result = value;
                return value;
            }, function(err) {
                result = "";
                console.log(err);
                return new Promise(function(resolve, reject){
                });
            })
        };
        return susp;
    }
}

$(function () {
    ui.init();
});
