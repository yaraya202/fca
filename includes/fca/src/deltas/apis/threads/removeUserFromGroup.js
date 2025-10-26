"use strict";

/**
 * Compatibility wrapper for removeUserFromGroup
 * This wraps the new gcmember API to maintain backward compatibility
 * with the old FCA's removeUserFromGroup function
 */
module.exports = function (defaultFuncs, api, ctx) {
  return function removeUserFromGroup(userID, threadID, callback) {
    // Validate inputs
    if (!userID) {
      const error = new Error("removeUserFromGroup: userID is required");
      if (callback) return callback(error);
      return Promise.reject(error);
    }
    
    if (!threadID) {
      const error = new Error("removeUserFromGroup: threadID is required");
      if (callback) return callback(error);
      return Promise.reject(error);
    }

    // Use the new gcmember API with "remove" action
    if (api.gcmember) {
      return api.gcmember("remove", userID, threadID, callback);
    } else {
      const error = new Error("removeUserFromGroup: gcmember API not available");
      if (callback) return callback(error);
      return Promise.reject(error);
    }
  };
};
