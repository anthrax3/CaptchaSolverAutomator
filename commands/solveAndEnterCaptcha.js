var request = require('sync-request');
var fs = require('fs');
const captcha_image_file_path = "/tmp/captcha.png";
const GOOGLE_VISION_API_URL = "https://vision.googleapis.com/v1/images:annotate?key=" + process.env.API_KEY;

exports.command = function (cssSelector, encoded, loginPage) {
    var self = this;
    self.perform(function () {
        // Read image from /tmp
        if (loginPage){
            var imageFile = fs.readFileSync(captcha_image_file_path);
            encoded = new Buffer(imageFile).toString('base64');
        }
        // Send Post data to Google
        var response = request('POST', GOOGLE_VISION_API_URL, {
            json: {
                requests: {
                    image: {content: encoded},
                    features: [{type: 'DOCUMENT_TEXT_DETECTION', 'maxResults': 1}]
                }
            }
        });
        //console.log(body);
        try {
            var captcha_text = JSON.parse(response.getBody('utf8'))['responses'][0]['textAnnotations'][0]['description'];
            console.log('Captcha Text:' + captcha_text);
            captcha_text = captcha_text.replace("Enter the following:", "");
            console.log('New Captcha Text:' + captcha_text);
            if (loginPage){
                self.setValue(cssSelector, captcha_text)
            }
        } catch (err) {
            console.log('No Text Found');
            if (!loginPage)
                self.click('#send_btm > div.container-left > input') //Click on "Not A Captcha"
        }
        if (loginPage) {
            self.pause(2000);
            self.url(function (result) {
                if (result.value === 'https://2captcha.com/enterpage') {
                    self.assert.urlEquals('https://2captcha.com/enterpage');
                    console.log("Logged In!");
                } else {
                    // Retry Again
                    self.setValue('input[type="password"]', process.env.PASSWORD);
                    self.saveImage("#validation_form > img");
                    self.solveAndEnterCaptcha(cssSelector, null, true);
                }
            });
        }
    });
    return this
};