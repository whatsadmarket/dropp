var step_out = require("request");
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads/users');
    },
    filename: function (req, file, callback) {
        callback(null, `${req.params.id}.jpg`);
    }
});

var upload = multer({ storage : storage});

function makePostCall(data_, endpoint, auth_token = '', expected_json = true) {
    options = getHeaders(data_, endpoint, auth_token);
    return new Promise(function(resolve, reject) {
        step_out.post(options, (err, res, body) => {
            if (err) {
                console.log(`ErrorBody: ${err}`);
				reject(err);
			} else {
                // console.log(`ResponseBody: ${body}`);
                if (expected_json) {
                    resolve(JSON.parse(body));
                } else {
                    resolve(body);
                }
			}
        });
    });
}

function makeGetCall(data_, endpoint, auth_token = '', expected_json = true) {
    options = getHeaders(data_, endpoint, auth_token);
    return new Promise(function(resolve, reject) {
        step_out.get(options, (err, res, body) => {
            if (err) {
                console.log(`ErrorBody: ${err}`);
				reject(err);
			} else {
                //Handle server errors
                if (body.includes('html')) {
                    console.log(`Unexpected! :${body}`);
                    resolve({ status:403, message:'Unexpected Response' });
                } else {
                    // console.log(`ResponseBody: ${body}`);
                    if (expected_json) {
                        resolve(JSON.parse(body));
                    } else {
                        resolve(body);
                    }
                }
            }
        });
    });
}

function talkBack(res, code, word, json_ = false) {
    if (!json_) {
        res.writeHead(code, {'Content-type' : 'text/plain'});
        res.end(word);
        return;
    }
    res.json(word);
}

function outPut(res, source, errors = false) {
    if (res.status == 500 || res.status == 403 || res.status == 401) {
        talkBack(res, 401, { success:false, response: `An error occurred. ${res.message}`}, true);
        return false;
    }

    else {
        if (!errors) {
            talkBack(res, 200, { success:true, message:source.message, data:source.data }, true);
        } else {
            talkBack(res, 401, { success:false, response: `Something's wrong. ${source.message}` }, true);
        }
        // } else if ("status" in source) {
        //     talkBack(res, 401, { success:false, response: `An error occurred. ${source.message}. Token may have expired` }, true);
        // }
    }
}
module.exports = {
    'talk' : talkBack,
    'call' : makeGetCall,
    'out' : outPut,
    'upload' : upload
}