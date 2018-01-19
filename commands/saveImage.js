var request = require('sync-request');
var fs = require('fs');
const captcha_image_file_path = "/tmp/captcha.png";

exports.command = function (cssSelector) {
    return this
        .getAttribute(cssSelector, "src", function (result) {
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

};