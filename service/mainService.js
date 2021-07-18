const fetch = require("node-fetch");
const constants = require("../lib/constants");
const validatorService = require("./validation/validatorService");
const commonService = require("./commonService");
const NodeCache = require("node-cache");
const nCache = new NodeCache();

/**
 * name: service.js
 * info: main service layer, this handles out the business logic part
 */
module.exports = {
  getNodeVersion: async () => {
    return { message: "Node version " + process.versions.node };
  },
  /**
   * Function: Fetches images data from antoher API and filters images data used for pagination
   * @param {*} parameters (size,offset)
   * @returns filtered images data
   */
  getImagesDataPagination: async (parameters) => {
    //validator for query paramters
    const { error } = validatorService.validatePaginationParameters(parameters);
    const valid = error == null;
    if (!valid) {
      const { details } = error;
      const errInfo = details.map((i) => i.message).join(",");
      return {
        error: errInfo,
        status: constants.BADREQUEST,
      };
    }
    //fetch query parameters
    var size = parseInt(parameters.size);
    var offset = parseInt(parameters.offset);

    //check for offset -if not present then assign default value
    if (isNaN(offset)) offset = 0;

    //calculate start index from where the elements will be picked
    var startIndex = offset * size;

    try {
      //check if cache has key alive, if yes - return the cached data after modification/filtering
      if (nCache.has(constants.CACHE_IMAGES_KEY)) {
        console.log("Cached images data used!!");
        var cachedData = nCache.get(constants.CACHE_IMAGES_KEY);
        //handle miss
        if (cachedData != undefined) return cachedData.splice(startIndex, size);
      }
      //fetch images data from other API
      var images = await fetch(constants.IMAGES_URL);
      if (images.status != 200) {
        return {
          error: "Bad Request: external images API",
          status: images.status,
        };
      }
      const data = await images.json();

      //set result for cache
      nCache.set(constants.CACHE_IMAGES_KEY, data, constants.CACHE_TTL);
      console.log("New images data Cached!!");

      // return desired data
      return data.splice(startIndex, size);
    } catch (err) {
      console.log(
        "Exception occured in function getImagesDataPagination: ",
        err
      );
      return {
        error: "Exception Occured",
        status: err,
      };
    }
  },

  /**
   * function: retrieves user at pre-defined ID and aggregated posts for that user
   * @returns user details and his relevant posts[List]
   */
  getNicholasData: async () => {
    try {
      //check for cached data, return if exists
      if (nCache.has(constants.NICHOLAS_KEY)) {
        var cachedData = nCache.get(constants.NICHOLAS_KEY);
        //handle miss
        if (cachedData != undefined) return cachedData;
      }
      //fetch users from other API
      const users = await commonService.getUserFromAPI();
      if (users.error) return users;
      //filter specific user with ID
      var user = users.filter((user) => user.id == constants.SPECIFIED_USER_ID);
      //if user not found or multiple users found on data fetched from API for specified ID
      //return appropriate message
      if (!user) {
        return {
          user: "",
          posts: [],
        };
      } else if (user.length > 1) {
        return {
          error: "User Conflict, multiple users exists on same ID!",
          status: constants.CONFLICT,
        };
      }

      //fetch posts from external API
      var posts = await commonService.getPostsFromAPI();
      if (posts.error) return posts;

      //filter posts on basis of userId
      const userPosts = posts.filter(
        (post) => post.userId == constants.SPECIFIED_USER_ID
      );
      //find posts that exists for userId : even if no posts exists, that is also a valid case
      var result = { user: user[0], posts: userPosts };
      //set cache data
      nCache.set(constants.NICHOLAS_KEY, result, constants.CACHE_TTL);
      return result;
    } catch (err) {
      console.log("Exception occured in function getNicholasData: ", err);
      return {
        error: "Exception Occured",
        status: err,
      };
    }
  },

  /**
   * function: finds users who work for Romaguera group companies and return the aggregate of posts
   * under the relevant userId(s)
   * @returns list of posts from users who work at Romaguera group
   */
  getRomagueraData: async () => {
    try {
      //check if cached data exists - return if yes
      if (nCache.has(constants.ROMAGUERA_KEY)) {
        var cachedData = nCache.get(constants.ROMAGUERA_KEY);
        //handle miss
        if (cachedData != undefined) return cachedData;
      }
      //fetch user data
      const users = await commonService.getUserFromAPI();
      if (users.error) return users;

      //filter user id's who work at Romaguera group companies
      var romagueraGroupUserIds = users
        .filter(
          (user) =>
            user.company.name.toString().indexOf(constants.ROMAGUERA_KEY) != -1
        )
        .map((x) => x.id);

      //fetch posts from external API
      var posts = await commonService.getPostsFromAPI();
      if (posts.error) return posts;

      //filter posts that contains userId(s)
      var result = posts.filter((post) =>
        romagueraGroupUserIds.includes(post.userId)
      );

      //cache data
      nCache.set(constants.ROMAGUERA_KEY, result, constants.CACHE_TTL);
      return result;
    } catch (err) {
      console.log("Exception occured in function getRomagueraData: ", err);
      return {
        error: "Exception Occured",
        status: err,
      };
    }
  },

  /**
   * function: saves todo after validation is passed and saves the newly created objects in memory cache
   * @param {*} todo : object
   * @returns response of other API, if success: the response will contain id:201
   */
  saveTodo: async (todo) => {
    try {
      //validate the body parameters
      const { error } = validatorService.todoValidator(todo);
      const valid = error == null;
      //if not valid, create appropriate message
      if (!valid) {
        const { details } = error;
        const errInfo = details.map((i) => i.message).join(",");
        return {
          error: "Bad request : Validation Failed",
          info: errInfo,
          status: constants.BADREQUEST,
        };
      }

      //create POST request (header, request)
      //since we have single post request this config is implemented in-function.
      const headers = {
        "Content-Type": constants.CONTENT_TYPE,
        charset: constants.CHAR_SET,
      };
      var response = await fetch(constants.TODO_POST_URL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(todo),
      });
      //check reponse status for external post request
      if (response.status != 201) {
        return {
          error: "Bad Request, todo save API endpoint",
          status: response.status,
        };
      }
      response = await response.json();

      //append result to node-cache and return
      if (nCache.has(constants.CACHE_NEW_TODOS_KEY)) {
        var newTodos = nCache.get(constants.CACHE_NEW_TODOS_KEY);
        newTodos.push(response);
        nCache.set(constants.CACHE_NEW_TODOS_KEY, newTodos);
      } else {
        //if not exists already
        var todoList = [response];
        nCache.set(constants.CACHE_NEW_TODOS_KEY, todoList);
      }
      return response;
    } catch (err) {
      console.log("Exception occured in function saveTodo: ", err);
      return {
        error: "Exception Occured",
        status: err,
      };
    }
  },

  /**
   * function: Sorts users city-wise * filters who don't have the following in their website domain ['.com','.net','.org']
   * @returns sorted user list
   */
  getSortedUsers: async () => {
    try {
      //check cache, if exists - return
      if (nCache.has(constants.CACHE_SORTED_USERS)) {
        var cachedUsers = nCache.get(constants.CACHE_SORTED_USERS);
        //handle miss
        if (cachedUsers != undefined) return cachedUsers;
      }
      //retrieve users
      var users = await commonService.getUserFromAPI();
      if (users.error) return users;
      //filter users on basis of website domain and sort according to city name
      var final = users
        .sort((a, b) =>
          a.address.city
            .toLowerCase()
            .localeCompare(b.address.city.toLowerCase())
        )
        .filter(commonService.substringFilter);
      //set cache data
      nCache.set(constants.CACHE_SORTED_USERS, final, constants.CACHE_TTL);
      return final;
    } catch (err) {
      console.log("Exception occured in function getSortedUsers: ", err);
      return {
        error: "Exception Occured",
        status: err,
      };
    }
  },

  /**
   * function: Retrieves newly created todos list from memory cache
   * @returns cached newly created todos list
   */
  getNewlyCreatedTodos: async () => {
    //retrieve todos list from cache
    var todos = await nCache.get(constants.CACHE_NEW_TODOS_KEY);
    if (todos) {
      return todos;
    }
    return { message: "No new todos created!" };
  },
};
