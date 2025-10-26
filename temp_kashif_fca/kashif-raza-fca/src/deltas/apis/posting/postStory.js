"use strict";

/**
 * Compatibility wrapper for postStory
 * This wraps the new story API to maintain backward compatibility
 */
module.exports = function (defaultFuncs, api, ctx) {
  return function postStory(...args) {
    // Use the new story API
    if (api.story) {
      return api.story(...args);
    } else {
      const callback = typeof args[args.length - 1] === 'function' ? args[args.length - 1] : null;
      const error = new Error("postStory: story API not available");
      if (callback) return callback(error);
      return Promise.reject(error);
    }
  };
};
