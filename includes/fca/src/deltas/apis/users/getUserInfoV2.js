"use strict";

/**
 * Compatibility wrapper for getUserInfoV2
 * This wraps the new getUserInfo API to maintain backward compatibility
 */
module.exports = function (defaultFuncs, api, ctx) {
  return function getUserInfoV2(userIDs, callback) {
    // Use the new getUserInfo API
    if (api.getUserInfo) {
      return api.getUserInfo(userIDs, callback);
    } else {
      const error = new Error("getUserInfoV2: getUserInfo API not available");
      if (callback) return callback(error);
      return Promise.reject(error);
    }
  };
};
