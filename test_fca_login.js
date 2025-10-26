const login = require("./includes/fca");
const fs = require("fs");

console.log("Testing kashif-raza-fca login...");

const appState = JSON.parse(fs.readFileSync("appstate.json", "utf8"));

console.log("AppState loaded, attempting login...");

login({ appState }, (err, api) => {
    if (err) {
        console.error("Login error:", err);
        process.exit(1);
    }
    
    console.log("Login successful!");
    console.log("User ID:", api.getCurrentUserID());
    console.log("Available APIs:", Object.keys(api).filter(k => typeof api[k] === 'function').slice(0, 20));
    
    // Test group management APIs
    console.log("\nTesting critical APIs:");
    console.log("- removeUserFromGroup:", typeof api.removeUserFromGroup);
    console.log("- gcmember:", typeof api.gcmember);
    console.log("- addUserToGroup:", typeof api.addUserToGroup);
    console.log("- changeAdminStatus:", typeof api.changeAdminStatus);
    console.log("- getThreadInfo:", typeof api.getThreadInfo);
    
    process.exit(0);
});
