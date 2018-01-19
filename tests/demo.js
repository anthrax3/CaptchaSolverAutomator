var fs = require('fs');
var request = require('sync-request');

if (!process.env.API_KEY)
    throw new Error("API KEY not defined");

if (!process.env.PASSWORD)
    throw new Error("2Captcha Password not defined");

const GOOGLE_VISION_API_URL = "https://vision.googleapis.com/v1/images:annotate?key=" + process.env.API_KEY;
const captcha_image_file_path = "/tmp/captcha.png";

module.exports = {
    '2Captcha Login': function (browser) {
        browser
            .url('https://2captcha.com/auth/login')
            .pause(2000)
            .setValue('input[type="email"]', 'roshinrulz28@gmail.com')
            .setValue('input[type="password"]', process.env.PASSWORD)
            .saveImage("#validation_form > img")  // Save Captcha Locally
            .solveAndEnterCaptcha('input[type="text"]')  // Solve and enter the Captcha
            .pause()
        // .click("#validation_form > button")
        // .end();
    }
};