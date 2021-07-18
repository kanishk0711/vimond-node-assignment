/**
 * index.js: controller, route-api script. Contains all the routes of our application, except 404 -> exists in app.js
 */
var express = require("express");
var app = express();
var service = require("../service/mainService");
var constants = require("../lib/constants");

/** route GET /ping
 * info: health check
 */
app.get("/ping", (req, res) => {
  res.status(constants.SUCCESS).json({ message: "pong!" });
});

/** route GET /version
 * info: retrieves current node version
 */
app.get("/version", async (req, res) => {
  try {
    var result = await service.getNodeVersion();
    res.status(constants.SUCCESS).json(result);
  } catch (err) {
    console.log(err);
    res.status(constants.INTERNAL_SERVER_ERROR).json(err);
  }
});

/** route GET /images
 * info: pagination implementation, to get range of data
 * accepts: query parameters - size and offset;
 */
app.get("/images", async (req, res) => {
  try {
    const result = await service.getImagesDataPagination(req.query);
    if (result.error) {
      res.status(result.status).json({ error: result.error });
      return;
    } else res.status(constants.SUCCESS).json(result);
  } catch (err) {
    console.log(err);
    res.status(constants.INTERNAL_SERVER_ERROR).json(err);
  }
});

/** route GET /Nicholas
 * info: retrieves user data with specified user ID in constants and aggregate all of the user's posts
 */
app.get("/Nicholas", async (req, res) => {
  try {
    const result = await service.getNicholasData();
    if (result.error) {
      res.status(result.status).json({ message: result.error });
      return;
    } else res.status(constants.SUCCESS).json(result);
  } catch (err) {
    console.log(err);
    res.status(constants.INTERNAL_SERVER_ERROR).json(err);
  }
});

/** route GET /Romaguera
 * info: Collect all users who work at Romaguera group companies and further aggregates their posts
 */
app.get("/Romaguera", async (req, res) => {
  try {
    const result = await service.getRomagueraData();
    if (result.error) {
      res.status(result.status).json({ message: result.error });
      return;
    } else res.status(constants.SUCCESS).json(result);
  } catch (err) {
    console.log(err);
    res.status(constants.INTERNAL_SERVER_ERROR).json(err);
  }
});

/** route POST /todo
 * info: makes post request to another api, receives json response with added 'id' parameter, on success.
 * accpets: body paramters
 */
app.post("/todo", async (req, res) => {
  try {
    const result = await service.saveTodo(req.body);
    if (result.error) {
      res
        .status(result.status)
        .json({ message: result.error, info: result.info });
      return;
    } else res.status(constants.CREATED).json(result);
  } catch (err) {
    console.log(err);
    res.status(constants.INTERNAL_SERVER_ERROR).json(err);
  }
});

/** route GET /sorted-users
 * info: sorts user city-wise who don't have the following in their website domain ['.com','.net','.org']
 */
app.get("/sorted-users", async (req, res) => {
  try {
    const result = await service.getSortedUsers();
    if (result.error) {
      res
        .status(result.status)
        .json({ message: result.error, info: result.info });
      return;
    } else res.status(constants.SUCCESS).json(result);
  } catch (err) {
    console.log(err);
    res.status(constants.INTERNAL_SERVER_ERROR).json(err);
  }
});

/** route GET /new-todos
 * info: to retrieve newly created todos
 */
app.get("/new-todos", async (req, res) => {
  try {
    const result = await service.getNewlyCreatedTodos();
    res.status(constants.SUCCESS).json(result);
  } catch (err) {
    console.log(err);
    res.status(constants.INTERNAL_SERVER_ERROR).json(err);
  }
});

module.exports = app;
