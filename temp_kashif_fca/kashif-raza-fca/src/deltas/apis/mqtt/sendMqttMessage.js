"use strict";

/**
 * Compatibility wrapper for sendMqttMessage
 * This wraps the new sendMessageMqtt API to maintain backward compatibility
 */
module.exports = function (defaultFuncs, api, ctx) {
  return function sendMqttMessage(...args) {
    // Use the new sendMessageMqtt API
    if (api.sendMessageMqtt) {
      return api.sendMessageMqtt(...args);
    } else {
      const callback = typeof args[args.length - 1] === 'function' ? args[args.length - 1] : null;
      const error = new Error("sendMqttMessage: sendMessageMqtt API not available");
      if (callback) return callback(error);
      return Promise.reject(error);
    }
  };
};
