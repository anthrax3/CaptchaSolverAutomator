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
            // Save Captcha Locally
            .getAttribute("#validation_form > img", "src", function (result) {
                console.log(result.value);
                // Get the image link
                var image_url = result.value;
                //Download the image
                var response = request('GET', image_url, {
                    'headers': {
                        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) ' +
                        'Chrome/61.0.3163.91 Safari/537.36'
                    }
                });
                fs.writeFileSync(captcha_image_file_path, response.getBody(), 'binary');
                console.log("Captcha saved")
            })
            // Get Captcha Value
            .perform(function () {
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
                    browser.setValue('input[type="text"]', captcha_text)
                } catch (err) {
                    console.log("No Text found in the image")
                }
            })
            .pause()
        // .click("#validation_form > button")
        // .end();
    }
};