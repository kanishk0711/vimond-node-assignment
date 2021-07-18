/**
 * constants.js: Contains constants used throughout the app
 */
module.exports = Object.freeze({
  //application config
  CONTENT_TYPE: "application/json",
  CHAR_SET: "utf-8",
  APP_PORT_NUMBER: 8040,

  //EXTERNAL API URL's
  IMAGES_URL: "https://jsonplaceholder.typicode.com/photos",
  USERS_URL: "https://jsonplaceholder.typicode.com/users",
  POSTS_URL: "https://jsonplaceholder.typicode.com/posts",
  TODO_POST_URL: "https://jsonplaceholder.typicode.com/todos",

  //Cache and other keys used
  CACHE_IMAGES_KEY: "images",
  CACHE_USERS_KEY: "users",
  CACHE_POSTS_KEY: "posts",
  CACHE_SORTED_USERS: "sorted-users",
  CACHE_NEW_TODOS_KEY: "newTodos",
  ROMAGUERA_KEY: "Romaguera", //used for multiple cases, hence named different
  NICHOLAS_KEY: "nicholas", //used for multiple cases, hence named different

  //list for website filtering
  EXCLUDE_WEBSITE_DOMAINS: [".com", ".net", ".org"],

  //status codes
  SUCCESS: 200,
  CREATED: 201,
  BADREQUEST: 400,
  NOTFOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,

  //miscellaneous
  CACHE_TTL: 10,
  SPECIFIED_USER_ID: 8,
});
