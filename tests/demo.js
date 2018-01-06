var fs = require('fs');
var request = require('request');
const GOOGLE_VISION_API_URL = "https://vision.googleapis.com/v1/images:annotate?key=" + process.env.API_KEY

module.exports = {
  'Demo test Google' : function (browser) {
    browser
      .url('http://www.google.com')
      .waitForElementVisible('body', 1000)
      .getAttribute("#hplogo", "src", function(result) {
            console.log(result.value)
            // Get the image link
            var image_url = result.value
            var _encoded;
            //Download the image
            request.get({url: image_url, encoding: 'binary'}, function (error, response, imageBinary) {
                if (!error && response.statusCode == 200)
                    //Encode the image binary to base64
                    //var wstream = fs.createWriteStream('/tmp/doodle.png')
                    //wstream.write(imageBinary);
                    fs.writeFile("/tmp/doodle.png", imageBinary, 'binary', function(err) {
                        if(err)
                          console.log(err);
                        else
                          console.log("The file was saved!");
                      });
             })
            var imageFile = fs.readFileSync('/tmp/doodle.png');
            encoded = new Buffer(imageFile).toString('base64');
            //Send Post data to Google
            request.post(
                GOOGLE_VISION_API_URL,
                { json: {
                        requests: {
                                    image: {content: encoded},
                                    features: [{type: 'DOCUMENT_TEXT_DETECTION', 'maxResults': 1}]
                                  }
                        }
                },
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log(response)
                        //var json_response = body['responses']
	                    var captcha_text = json_response[0]['textAnnotations'][0]['description']
                        console.log(captcha_text);
                    }
                }
            );
      })
      .end();
  }
};