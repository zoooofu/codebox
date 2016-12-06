var Serial = function () {
	// var used = [];
	// var attempts = [];
	var rport = /usb|acm|^com/i;
	var serial = this;
	// var priv = new Map();
	
	this.detect = function (callback) {
		var serialport;
		
		serialport = require("serialport");

		serialport.list(function (err, result) {
			var ports = result.filter(function (val) {
				var available = true;

				if (!rport.test(val.comName)) {
					available = false;
				}

				// if (Serial.used.includes(val.comName)) {
				// 	available = false;
				// }

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
				// if (!Serial.attempts[Serial.used.length]) {
				// 	Serial.attempts[Serial.used.length] = 0;

				// 	this.info("Board", "Looking for connected device.");
				// }

				// Serial.attempts[Serial.used.length]++;

				// this.info("Board", "Looking for connected device.");
				console.log("try to reconnect");
				serial.detect.call(this, callback);

				return;
			}

			// this.info("Device", ports);

			// port = ports[0];
			
			console.log("portInside: " + ports[0]);

			// priv.set(portAvailable, ports[0]);

			// console.log("portAvailable: " + priv.get(portAvailable));

			callback.call(this, ports[0]);

			// return ports[0];
			// callback.call(this, ports[0]);
		}.bind(this));

		// var port = priv.get(portAvailable);

		// console.log("port: " + port);

		// return port;
	} 
};

module.exports = Serial;


