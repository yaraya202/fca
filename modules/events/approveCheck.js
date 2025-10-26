
module.exports.config = {
    name: "approveCheck",
    eventType: ["log:subscribe"],
    version: "1.0.0",
    credits: "Kashif Raza",
    description: "Check group approval when bot joins - DISABLED"
};

module.exports.run = async function({ api, event, Users }) {
    // This event is disabled to avoid conflicts with the main approval system
    // All approval checking is now handled in listen.js
    return;
};
