var Motor = require("./motor");
var Serial = require("./serial");
var chalk = require("chalk");
// var Emitter = require("events").EventEmitter;

// var myPort = null;
// var serial = null;

var serial = new Serial();
var motor = null;

serial.detect(function (port) {
	console.log("port: " + port);

	motor = new Motor(port);

	motor.on("ready", function () {
		console.log("motor is ready now");
	});
});

setTimeout(function toggle() {
	motor.emit("codeboxLeftSpin");
	setTimeout(function () {
		motor.emit("codeboxRightSpin");
		setTimeout(toggle, 2000);
	}, 2000);
}, 10000);

// var motor = new Motor(myPort);	

// var isReadyToGo = false;

// motor.on("ready", function () {
// 	motor.forward();
// 	setTimeout(function () {
// 		// motor.stop();
// 		console.log(chalk.red("Motor is stop now."));
// 		motor.emit("codeboxStop");
// 	}, 5000);
// });

// motor.on("ready", test);

// function test() {
// 	motor.forward();
// 	setTimeout(function () {
// 		motor.stop();
// 		console.log(chalk.red("Motor is stop now."));
// 	}, 10000);
// }

// console.log(motor);

// motor.on("ready", function () {
// 	// motor.emit("codeboxGo");
// 	var motor = this;
// 	// isReadyToGo = true;
// 	test();
// 	// console.log(motor);

// 	// motor.emit("isReadyToGo");

// 	// motor.turnLeft();
// 	// setTimeout(function () {
// 	// 	motor.turnRight();
// 	// }, 3000);

// 	function test () {
// 		go();
// 		setTimeout(function () {
// 			back();
// 			setTimeout(test, 1000);
// 		}, 1000);
// 	}

// 	function go () {
// 		motor.emit("codeboxGo");
// 	}

// 	function back () {
// 		motor.emit("codeboxBack");
// 	}

// 	function stop () {
// 		motor.emit("codeboxStop");
// 	}
// });

// setTimeout(start, 8000);

// function start () {
// 	motor.emit("codeboxGo");
// }






