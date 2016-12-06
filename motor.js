var Board = require("firmata");
var Emitter = require("events").EventEmitter;
var util = require("util");
var chalk = require("chalk");
var defaultLed = 11;
var leftDir = 4;
var leftMotor = 5;
var rightMotor = 6;
var rightDir = 7;
var forwardLeftSpeed = 220;
var forwardRightSpeed = 220;
var backwardLeftSpeed = 150;
var backwardRightSpeed = 150;
var turnLeftFastSpeed = 180;
var turnLeftSlowSpeed = 100;
var turnRightFastSpeed = 180;
var turnRightSlowSpeed = 100;
var rightSpinSpeed = 180;
var leftSpinForwardSpeed = 180;
var leftSpinBackwardSpeed = 120;
var rightSpinForwardSpeed = 180;
var rightSpinBackwardSpeed = 120;
var forwardLight = 250;
var backwardLight = 50;

// board.on("ready", function () {
// 	board.pinMode(leftMotor, board.MODES.OUTPUT);
// 	board.pinMode(rightMotor, board.MODES.OUTPUT);
// 	setTimeout(function () {
// 		board.digitalWrite(leftMotor, board.HIGH);
// 		board.digitalWrite(rightMotor, board.HIGH);
// 	}, 2000);
// });

var Controller = {
	CODEBOX: {
		initialize: {
			value: function () {
				this.board.pinMode(leftMotor, this.board.MODES.PWM);
				this.board.pinMode(rightMotor, this.board.MODES.PWM);
				this.board.pinMode(leftDir, this.board.MODES.OUTPUT);
				this.board.pinMode(rightDir, this.board.MODES.OUTPUT);
				this.board.pinMode(defaultLed, this.board.MODES.PWM);
				console.log("I am in the code of initialize.");
				// setTimeout(function () {
				// 	this.board.digitalWrite(defaultLed, this.board.HIGH);
				// 	setTimeout(function () {
				// 		this.board.digitalWrite(defaultLed, this.board.LOW);
				// 	}, 5000); 	
				// }, 2000);
			}
		},
		forward: {
			writable: true,
			value: function () {
				this.board.analogWrite(leftMotor, forwardLeftSpeed);
				this.board.analogWrite(rightMotor, forwardRightSpeed);
				this.board.digitalWrite(leftDir, this.board.LOW);
				this.board.digitalWrite(rightDir, this.board.LOW);
				this.board.analogWrite(defaultLed, forwardLight);
				console.log("I am in the code of forward.");
				// this.board.digitalWrite(rightMotor, this.board.HIGH);
				// console.log(this);
			}
		},
		backward: {
			writable: true,
			value: function () {
				this.board.analogWrite(leftMotor, forwardLeftSpeed);
				this.board.analogWrite(rightMotor, forwardRightSpeed);
				this.board.digitalWrite(leftDir, this.board.HIGH);
				this.board.digitalWrite(rightDir, this.board.HIGH);
				this.board.analogWrite(defaultLed, backwardLight);
				console.log("I am in the code of backward.");
				// this.board.digitalWrite(rightMotor, this.board.HIGH);
				// console.log(this);
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
				// this.board.digitalWrite(leftMotor, this.board.LOW);
				this.board.analogWrite(leftMotor, 0);
				this.board.analogWrite(rightMotor, 0);
				this.board.digitalWrite(leftDir, this.board.LOW);
				this.board.digitalWrite(rightDir, this.board.LOW);
				this.board.analogWrite(defaultLed, 0);
				console.log("I am in the code of stop");
				// this.board.digitalWrite(rightMotor, this.board.LOW);
			}
		}
	}
}

var Motor = function (port) {
	this.board = new Board(port);
	this.isReady = false;
	var motor = this;
	var controller = null;

	Emitter.call(this);
	controller = Controller.CODEBOX;
	Object.defineProperties(this, controller);

	// this.board.on("ready", function () {
	// 	// motor.board.pinMode(leftMotor, motor.board.MODES.OUTPUT);
	// 	// motor.board.pinMode(rightMotor, motor.board.MODES.OUTPUT);
	// 	if (typeof this.initialize === "function") {
	// 		this.initialize();
	// 		console.log("Motor has been initialized.");
	// 	} 

	// 	ready();
	// });
	motor.board.on("ready", readyToGo);

	function readyToGo () {
		if (typeof motor.initialize === "function") {
			motor.initialize();
			console.log("Motor has been initialized.");
		}

		ready();
	}

	// if (typeof this.initialize === "function") {
	// 	this.initialize();
	// 	ready();
	// }

	function ready () {
		this.isReady = true;
		setTimeout(function () {
			motor.emit("ready");
		}, 2000);
		console.log(chalk.green("Motor is ready to go."));
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
	// this.board.analogWrite(leftMotor, forwardLeftSpeed);
	// this.board.analogWrite(rightMotor, forwardRightSpeed);
	// this.board.digitalWrite(leftMotor, this.board.HIGH);
	// this.board.digitalWrite(rightMotor, this.board.HIGH);
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
	// console.log(chalk.red("Motor is stop now."));
	
	return this;
};

module.exports = Motor;


