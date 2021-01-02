"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var restify = require("restify");
var server = restify.createServer({
    name: 'meat-api',
    version: '1.0.0'
});
server.use(restify.plugins.queryParser());
server.get('/info', [
    function (req, resp, next) {
        if (req.userAgent() && req.userAgent().includes('MSIE 7.0')) {
            var error = new Error();
            error.statusCode = 400;
            error.message = 'Please, update you browser.';
            return next(error);
        }
        ;
    }, function (req, resp, next) {
        resp.json({
            browser: req.userAgent(),
            method: req.method,
            url: req.url,
            path: req.path(),
            query: req.query,
        });
        return next;
    }
]);
server.listen(3000, function () {
    console.log("API in running on http://localhost:3000");
});
//# sourceMappingURL=main.js.map