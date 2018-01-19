var request = require('sync-request');
var fs = require('fs');
const captcha_image_file_path = "/tmp/captcha.png";
const GOOGLE_VISION_API_URL = "https://vision.googleapis.com/v1/images:annotate?key=" + process.env.API_KEY;

exports.command = function loop(cssSelector) {
    var self = this;
    self.url(function (result) {
        if (result.value === 'https://2captcha.com/enterpage') {
            self.assert.urlEquals('https://2captcha.com/enterpage');
            console.log("Logged In!");
            return self;
        }
        else {
            self.perform(function () {
                // Read image from /tmp
                var imageFile = fs.readFileSync(captcha_image_file_path);
                var encoded = new Buffer(imageFile).toString('base64');
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
                    self.setValue(cssSelector, 'captcha_text')
                } catch (err) {
                    console.log("No Captcha text found");
                }
            });
            self.click('#validation_form > button');
            self.pause(2000);
            // Retry Again
            self.setValue('input[type="password"]', process.env.PASSWORD);
            self.saveImage("#validation_form > img");
            self.solveAndEnterCaptcha(cssSelector)
        }
    });
    return this
};