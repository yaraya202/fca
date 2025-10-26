"use strict";

/**
 * Main entry point for kashif-raza-fca
 * This provides backward compatibility with the old fca-horizon-remastered interface
 */

const { login } = require('./module/index');

// Export login function as default export to match old FCA interface
module.exports = login;
