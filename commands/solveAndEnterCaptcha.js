var request = require('sync-request');
var fs = require('fs');
const captcha_image_file_path = "/tmp/captcha.png";
const GOOGLE_VISION_API_URL = "https://vision.googleapis.com/v1/images:annotate?key=" + process.env.API_KEY;

exports.command = function (cssSelector) {
    var self = this;
    while(true) {
        self.url(function (result) {
            // return the current url
            console.log(result);
            if (result === 'https://2captcha.com/enterpage') {
                return true;
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
                        console.log(captcha_text);
                        self.setValue(cssSelector, captcha_text)
                    } catch (err) {
                        console.log("No Captcha text found")
                    }
                });
            }
        });
    }
    return this
};