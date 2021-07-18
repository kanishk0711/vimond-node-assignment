const constants = require("../lib/constants");
const fetch = require("node-fetch");
/**
 * name: common.js
 * info: contains all the common functionalities frequently used by the services, only service layer will access these functions
 */
module.exports = {
  /**
   * Get users data from external API
   * @returns user list
   */
  getUserFromAPI: async () => {
    var users = await fetch(constants.USERS_URL);
    if (users.status != 200) {
      return {
        error: "Bad Request, API endpoint for users not success",
        status: users.status,
      };
    }
    return await users.json();
  },

  /**
   * Get posts data from external API
   * @returns posts list
   */
  getPostsFromAPI: async () => {
    var posts = await fetch(constants.POSTS_URL);
    if (posts.status != 200) {
      return {
        error: "Bad Request, API endpoint for posts not success",
        status: posts.status,
      };
    }
    return await posts.json();
  },

  /**
   * Filter : To find if any of the element ['.com','.net','.org'] exists in user's website domain
   * @param {*} user
   * @returns true if domain contains .com / false if it doesn't
   */
  substringFilter: (user) => {
    var excludeOrganizations = constants.EXCLUDE_WEBSITE_DOMAINS;
    return (
      !excludeOrganizations.filter((val) => user.website.indexOf(val) >= 0)
        .length > 0
    );
  },
};
