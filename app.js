var express = require("express");
var app = express();
const routes = require("./routes/index");
const constants = require("./lib/constants");
var cors = require("cors");
/**
 * app.js: Entry file to our project,
 * contains configs, security, route direction and server details.
 */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//allowing for localhost, since not sure where it will be running
var whitelist = ["http://localhost"]; //white list consumers
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  //type - requests allowed
  methods: ["GET", "POST"],
  optionsSuccessStatus: constants.SUCCESS, // 200
  credentials: true, //Credentials are cookies, authorization headers or TLS client certificates.
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "device-remember-token",
    "Access-Control-Allow-Origin",
    "Origin",
    "Accept",
  ],
};

app.use(cors(corsOptions));

//since there is no common base for segreagation of modules
//all routes are redirected to index.js
app.use("/", routes);

//404: incorrect URL requests will be directed here
app.use((req, res, next) => {
  res.status(constants.NOTFOUND).json({
    status: constants.NOTFOUND,
    message:
      "Ohh you are lost, please check the URL/specification and try-again. :)",
  });
});

//starting server on specified port number
app.listen(constants.APP_PORT_NUMBER, function () {
  console.log("Vimond test app running on: " + constants.APP_PORT_NUMBER);
});
