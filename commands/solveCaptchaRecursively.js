exports.command = function(cssSelector){
    var self = this;
    console.log('Waiting for Captcha...');
    self.waitForElementPresent(cssSelector, 1000000, false, function () {
        self.getAttribute('#capimg', "src", function (result) {
            var data_base64 = result.value;
            var encoded = data_base64.split(",")[1];
            self.solveAndEnterCaptcha('#code', encoded, null);
            self.solveCaptchaRecursively(cssSelector);
        })
    })
};