/// <reference path="../../typings/index.d.ts" />
import * as Tips from '../tips';
import * as Dialog from '../dialog';
import * as loader from '../loader';

let Board = window['nw'].require("firmata");
let Emitter = require("events").EventEmitter;
let util = require("util");
let defaultLed = 11;
let leftDir = 4;
let leftMotor = 5;
let rightMotor = 6;
let rightDir = 7;
let forwardLeftSpeed = 220;
let forwardRightSpeed = 220;
let backwardLeftSpeed = 150;
let backwardRightSpeed = 150;
let turnLeftFastSpeed = 180;
let turnLeftSlowSpeed = 100;
let turnRightFastSpeed = 180;
let turnRightSlowSpeed = 100;
let rightSpinSpeed = 180;
let leftSpinForwardSpeed = 180;
let leftSpinBackwardSpeed = 120;
let rightSpinForwardSpeed = 180;
let rightSpinBackwardSpeed = 120;
let forwardLight = 250;
let backwardLight = 50;

let codemaobox;
let codeport;
let btn_connect;  
let btn_disconnect;

/// window['nw'].require("nwjs-j5-fix").fix();

let Serial = function () {
  let rport = /usb|acm|^com/i;
  let serial = this;
  
  this.detect = function (callback) {
    let serialport;
    
    serialport = window['nw'].require("serialport");

    serialport.list(function (err, result) {
      let ports = result.filter(function (val) {
        let available = true;

        if (!rport.test(val.comName)) {
          available = false;
        }

        if (val.manufacturer.indexOf('Arduino') == -1) {
          available = false;
          console.log("no Arduino port found");
        } else {
          console.log("comName: " + val.comName);
        }

        console.log("available: " + available);

        return available;
      }).map(function (val) {
        return val.comName;
      });

      if (!ports.length) {
        console.log("try to reconnect");
        serial.detect.call(this, callback);

        return;
      }
      
      console.log("portInside: " + ports[0]);

      callback.call(this, ports[0]);
    }.bind(this));
  } 
};

let Controller = {
  CODEBOX: {
    initialize: {
      value: function () {
        this.board.pinMode(leftMotor, this.board.MODES.PWM);
        this.board.pinMode(rightMotor, this.board.MODES.PWM);
        this.board.pinMode(leftDir, this.board.MODES.OUTPUT);
        this.board.pinMode(rightDir, this.board.MODES.OUTPUT);
        this.board.pinMode(defaultLed, this.board.MODES.PWM);
        console.log("I am in the code of initialize.");
      }
    },
    forward: {
      writable: true,
      value: function () {
        // this.board.analogWrite(leftMotor, forwardLeftSpeed);
        // this.board.analogWrite(rightMotor, forwardRightSpeed);
        // this.board.digitalWrite(leftDir, this.board.LOW);
        // this.board.digitalWrite(rightDir, this.board.LOW);
        // this.board.analogWrite(defaultLed, forwardLight);       
        console.log("I am at the beginning of forward.");
        process.nextTick(this.board.analogWrite(leftMotor, forwardLeftSpeed));
        process.nextTick(this.board.analogWrite(rightMotor, forwardRightSpeed));
        process.nextTick(this.board.digitalWrite(leftDir, this.board.LOW));
        process.nextTick(this.board.digitalWrite(rightDir, this.board.LOW));
        process.nextTick(this.board.analogWrite(defaultLed, forwardLight));
        console.log("I am at the end of forward.");
      }
    },
    backward: {
      writable: true,
      value: function () {
        console.log("I am at the beginning of backward.");
        this.board.analogWrite(leftMotor, forwardLeftSpeed);
        this.board.analogWrite(rightMotor, forwardRightSpeed);
        this.board.digitalWrite(leftDir, this.board.HIGH);
        this.board.digitalWrite(rightDir, this.board.HIGH);
        this.board.analogWrite(defaultLed, backwardLight);
        console.log("I am at the end of backward.");
      }
    },
    turnLeft: {
      writable: true,
      value: function () {
        this.board.analogWrite(leftMotor, turnLeftSlowSpeed);
        this.board.analogWrite(rightMotor, turnLeftFastSpeed);
        this.board.digitalWrite(leftDir, this.board.LOW);
        this.board.digitalWrite(rightDir, this.board.LOW);
        this.board.analogWrite(defaultLed, 0);
        console.log("I am in the code of turnLeft.");
        // this.board.digitalWrite(rightMotor, this.board.HIGH);
        // console.log(this);
      }
    },      
    turnRight: {
      writable: true,
      value: function () {
        this.board.analogWrite(leftMotor, turnRightFastSpeed);
        this.board.analogWrite(rightMotor, turnRightSlowSpeed);
        this.board.digitalWrite(leftDir, this.board.LOW);
        this.board.digitalWrite(rightDir, this.board.LOW);
        this.board.analogWrite(defaultLed, 0);
        console.log("I am in the code of turnRight.");
        // this.board.digitalWrite(rightMotor, this.board.HIGH);
        // console.log(this);
      }
    },
    leftSpin: {
      writable: true,
      value: function () {
        this.board.analogWrite(leftMotor, leftSpinBackwardSpeed);
        this.board.analogWrite(rightMotor, leftSpinForwardSpeed);
        this.board.digitalWrite(leftDir, this.board.HIGH);
        this.board.digitalWrite(rightDir, this.board.LOW);
        this.board.analogWrite(defaultLed, 0);
        console.log("I am in the code of leftSpin");
        // this.board.digitalWrite(rightMotor, this.board.HIGH);
        // console.log(this);
      }
    },    
    rightSpin: {
      writable: true,
      value: function () {
        this.board.analogWrite(leftMotor, rightSpinForwardSpeed);
        this.board.analogWrite(rightMotor, rightSpinBackwardSpeed);
        this.board.digitalWrite(leftDir, this.board.LOW);
        this.board.digitalWrite(rightDir, this.board.HIGH);
        this.board.analogWrite(defaultLed, 0);
        console.log("I am in the code of rightSpin");
        // this.board.digitalWrite(rightMotor, this.board.HIGH);
        // console.log(this);
      }
    },      
    stop: {
      value: function () {
        this.board.analogWrite(leftMotor, 0);
        this.board.analogWrite(rightMotor, 0);
        this.board.digitalWrite(leftDir, this.board.LOW);
        this.board.digitalWrite(rightDir, this.board.LOW);
        this.board.analogWrite(defaultLed, 0);
        console.log("I am in the code of stop");
      }
    }
  }
}

let Motor = function (port) {
  this.board = new Board(port);
  this.isReady = false;
  let motor = this;
  let controller = null;

  Emitter.call(this);
  controller = Controller.CODEBOX;
  Object.defineProperties(this, controller);

  motor.board.on("ready", readyToGo);  
  
  function readyToGo () {
    if (typeof motor.initialize === "function") {
      motor.initialize();
      console.log("Motor has been initialized.");
    }

    ready();
  }
  
  function ready () {
    motor.isReady = true;
    setTimeout(function () {
      motor.emit("ready");
    }, 2000);
    console.log("Motor is ready to go.");
  }

  function motorGo () {
    motor.forward();
  };

  function motorBack () {
    motor.backward();
  }

  function motorTurnLeft () {
    motor.turnLeft();
  }

  function motorTurnRight () {
    motor.turnRight();
  }

  function motorLeftSpin () {
    motor.leftSpin();
  }

  function motorRightSpin () {
    motor.rightSpin();
  }

  function motorStop () {
    motor.stop();
  };

  motor.addListener("codeboxGo", motorGo);
  motor.addListener("codeboxStop", motorStop);
  motor.addListener("codeboxBack", motorBack);
  motor.addListener("codeboxTurnLeft", motorTurnLeft);
  motor.addListener("codeboxTurnRight", motorTurnRight);
  motor.addListener("codeboxLeftSpin", motorLeftSpin);
  motor.addListener("codeboxRightSpin", motorRightSpin);
};

util.inherits(Motor, Emitter);

Motor.prototype.forward = function () {
  this.forward();

  return this;
};

Motor.prototype.backward = function () {
  this.backward();

  return this;
}

Motor.prototype.turnLeft = function () {
  this.turnLeft();

  return this;
}

Motor.prototype.turnRight = function () {
  this.turnRight();

  return this;
}

Motor.prototype.leftSpin = function () {
  this.leftSpin();

  return this;
}

Motor.prototype.rightSpin = function () {
  this.rightSpin();

  return this;
}

Motor.prototype.stop = function () {
  this.stop();
  
  return this;
};

/// Codemao platform part
export function init() {
  btn_connect = $('#btn-connect-robot');
  btn_disconnect = $('#btn-disconnect-robot');
  bindEvents();
}

function bindEvents() {
  btn_connect.on('click', connect);
  btn_disconnect.on('click', disconnect);
} 

function connect() {
  loader.show();

  codeport = new Serial();
  codeport.detect(function (port) {
    console.log("port: " + port);

    codemaobox = new Motor(port);

    codemaobox.on("ready", function() {
      Dialog.show({
        content:'连接成功'
      });
      loader.hide();
    });
  });
}

function disconnect() {
  codemaobox = null;
  Dialog.show({
    content:'连接已断开'
  });
}

export function go_forward() {
  setTimeout(function () {
    codemaobox.emit("codeboxGo");
  }, 200);
}

export function go_back() {
  codemaobox.emit("codeboxStop");
  setTimeout(function () {
    codemaobox.emit("codeboxBack");
  }, 200);
}

export function left_spin() {
  setTimeout(function () {
    codemaobox.emit("codeboxLeftSpin");
  }, 200);
}

export function right_spin() {
  setTimeout(function () {
    codemaobox.emit("codeboxRightSpin");
  }, 200);
}

export function turn_left() {
  setTimeout(function () {
    codemaobox.emit("codeboxTurnLeft");
  }, 200);
}

export function turn_right() {
  setTimeout(function () {
    codemaobox.emit("codeboxTurnRight");
  }, 200);
}

export function stop_all() {
  setTimeout(function () {
    codemaobox.emit("codeboxStop");
  }, 200);
}





