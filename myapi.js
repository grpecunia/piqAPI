const http      = require('http');
const express   = require('express');
const gpio      = require('pi-gpio');
const Gpio = require("onoff").gpio;
const app       = express();

//test input pin

gpio.open(7, "input", function (err) {
  console.log("pin 7 is OPEN")
  // Open pin 7 for output
    gpio.read(7, function (err, value) {
      console.log("reading pin value")
      if (err) throw err;
      console.log(value); // The current state of the pin
    });
    gpio.close(7); // Close pin 7
    console.log("closing pin reading")
});


// // input port objects for our example
// var inputs = [    { pin: '7', gpio: '4', value: [] },
//                   // { pin: '22', gpio: '25', value: 0 }
//                 ];

// // -----------------------------------------------------------------------
// // open GPIO ports
// var i;
// for (i in inputs) {
//   console.log('opening GPIO port ' + inputs[i].gpio + ' on pin ' + inputs[i].pin + ' as input');
//   gpio.open(inputs[i].pin, "input", function (err) {
//     if (err) {
//       throw err;
//     }
//   });
//    // gpio.open
// } // if

// // /sys/devices/virtual/gpio/gpio%u/%s
// // nano quick2wire-gpio-admin/src/gpio-admin.c
// // int size = snprintf(path, PATH_MAX, "/sys/class/gpio/gpio%u/%s", pin, filename);


// // ------------------------------------------------------------------------
// // read and store the GPIO inputs on interval
// setInterval( function () {
//   gpio.read(inputs[0].pin, function (err, value) {
//     if (err) {
//       throw err;
//     }
//     console.log('read pin ' + inputs[0].pin + ' value = ' + value);
//     // update the inputs object
//     inputs[0].value = value.toString(); // store value as a string
//   });

//   gpio.read(inputs[1].pin, function (err, value) {
//     if (err) {
//       throw err;
//     }
//     console.log('read pin ' + inputs[1].pin + ' value = ' + value);
//     inputs[1].value = value.toString();
//   });
// }, 15000); // setInterval

  


// ------------------------------------------------------------------------
// configure Express to serve index.html and any other static pages stored 
// in the home directory
app.use(express.static(__dirname));

// Express route for incoming requests for a single input
app.get('/inputs/:id', function (req, res) {
  var i;

  console.log('received API request for port number ' + req.params.id);
  
  for (i in inputs){
    if ((req.params.id === inputs[i].gpio)) {
      // send to client an inputs object as a JSON string
      res.send(inputs[i]);
      return;
    }
  } // for

  console.log('invalid input port');
  res.status(403).send('dont recognise that input port number ' + req.params.id);
}); // apt.get()

// Express route for incoming requests for a list of all inputs
app.get('/inputs', function (req, res) {
  // send array of inputs objects as a JSON string
  console.log('all inputs');
  res.status(200).send(inputs);
}); // apt.get()

// Express route for any other unrecognised incoming requests
app.get('*', function (req, res) {
  res.status(404).send('Unrecognised API call');
});

// Express route to handle errors
app.use(function (err, req, res, next) {
  if (req.xhr) {
    res.status(500).send('Oops, Something went wrong!');
  } else {
    next(err);
  }
}); // apt.use()

// process.on('SIGINT', function() {
//   var i;

//   console.log("\nGracefully shutting down from SIGINT (Ctrl+C)");

//   console.log("closing GPIO...");
//   for (i in inputs) {
//     gpio.close(inputs[i].pin);
//   }
//   process.exit();
// });

// ------------------------------------------------------------------------
// Start Express App Server
//
app.listen(3000);
console.log('App Server is listening on port 3000');

