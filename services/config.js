console.log("hio 1");

require('dotenv').config();
require('dotenv').config({ path: 'C:\Users\ASUS\spbot\env_variables.env' });

console.log("hio 2");
// Required environment variables
const ENV_VARS = [
    "PAGE_ID",
    "APP_ID",
    "PAGE_ACCESS_TOKEN",
    "APP_SECRET",
    "VERIFY_TOKEN",
    "APP_URL"
  ];

  module.exports = {
  // Page and Application information
  pageId: process.env.PAGE_ID,
  appId: process.env.APP_ID,
  pageAccessToken: process.env.PAGE_ACCESS_TOKEN,
  appSecret: process.env.APP_SECRET,
  verifyToken: process.env.VERIFY_TOKEN,

 
  // URL of your app domain
  appUrl: process.env.APP_URL,

  // Preferred port (default to 1337)
  port: process.env.PORT || 1337,

    // URL of your webhook endpoint
    get webhookUrl() {
        return this.appUrl + "/webhook";
      },

      checkEnvVariables: function() {
        ENV_VARS.forEach(function(key) {
          if (!process.env[key]) {
            console.log("WARNING: Missing the environment variable " + key);
          } else {
            // Check that urls use https
            if (["APP_URL"].includes(key)) {
              const url = process.env[key];
              if (!url.startsWith("https://")) {
                console.log(
                  "WARNING: Your " + key + ' does not begin with "https://"'
                );
              }
            }
          }
        });
      }
  };