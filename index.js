const { spawn } = require("child_process");
const logger = require("./utils/log");

///////////////////////////////////////////////////////////
//========= Create website for dashboard/uptime =========//
///////////////////////////////////////////////////////////
const PORT = process.env.PORT || 8000;
const express = require("express");
const app = express();

// Define a route
app.get('/', (req, res) => {
    const result = `Remember to contact Facebook Lương Trường Khôi for file updates (free) Facebook: https://facebook.com/LunarKrystal.Dev`;
    res.send(result);
});
// Start the server
app.listen(PORT, () => {
    console.log(`[ SECURITY ] -> Server started on port: ${PORT}`);
});

function startBot(message) {
    (message) ? logger(message, "BOT STARTING") : "";

    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "main.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

   child.on("close",async (codeExit) => {
      var x = 'codeExit'.replace('codeExit',codeExit);
        if (codeExit == 1) return startBot("Restarting Bot, Please Wait...");
         else if (x.indexOf(2) == 0) {
           await new Promise(resolve => setTimeout(resolve, parseInt(x.replace(2,'')) * 1000));
                 startBot("Bot has been activated please wait a moment!!!");
       }
         else return; 
    });

    child.on("error", function (error) {
        logger("An error occurred: " + JSON.stringify(error), "[ Starting ]");
    });
};
startBot()
