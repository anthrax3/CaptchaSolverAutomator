var request = require('sync-request');
const GOOGLE_VISION_API_URL = "https://vision.googleapis.com/v1/images:annotate?key=" + process.env.API_KEY;

if (!process.env.API_KEY)
    throw new Error("API KEY not defined");

if (!process.env.PASSWORD)
    throw new Error("2Captcha Password not defined");

module.exports = {
    '2Captcha Login': function (browser) {
        browser
            .url('https://2captcha.com/auth/login')
            .pause(2000)
            .setValue('input[type="email"]', 'roshinrulz28@gmail.com')
            .setValue('input[type="password"]', process.env.PASSWORD)
            .saveImage("#validation_form > img")  // Save Captcha Locally
            .solveAndEnterCaptcha('input[type="text"]', null, true)  // Solve and enter the Captcha
            // Log In button is automatically pressed somehow
            // self.click('#validation_form > button');

    },

    '2Captcha Cabinet' : function (browser) {
        browser
            .url('https://2captcha.com/cabinet')
            .click('#startSound') // Switch the sound on
            // Switch to normal mode because we can't solve ReCaptcha
            .click('#captcha_type')
            .keys(browser.Keys.DOWN_ARROW)
            .keys(browser.Keys.ENTER)
            //Start Captcha Solving session
            .click('body > div > div.main_content_worker > div > div:nth-child(1) > div > div.main_content_lines > div:nth-child(2) > div > div > div.body_option_edit > div.start_div_content > div > div.text-center.margin-bottom-30 > a')
            .solveCaptchaRecursively('#capimg')
    }
};