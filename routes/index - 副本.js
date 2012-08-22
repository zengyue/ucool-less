
/*
 * GET home page.
 */

var http = require('http'),
	https = require('https'),
	urlParse = require('url').parse,
	less = require('less');

exports.index = function(req, res){
	console.log(req.url);
	res.write('1111');
	res.end();
	return ;
	var url = 'http://u.taobao.net' + req.url;

	var sourceData = '',
		fileList;

	if (/.css/.test(url)) {
		getCssFile(getFileList(url), res);
	}else{
		sendHttpRequest(url, function (response) {
			var headers = response.headers,
				contentType = headers['content-type'] || 'text/plain';
			res.setHeader("Content-Type", contentType);
			response.setEncoding('binary');
			response.on('data', function (chunk) {
				res.write(chunk);
			});
			response.on('end',function(){
				res.end();
			});
		});
	}
	
};

function getFileList(url) {
	var options = urlParse(url),
		fileArray = [],
		fileStr,
		query = options.query;
	/*
	 * 这里处理以下几种情况
	 * http://assets.lp.alibaba.com/apps/lpmall/supermall/
	 * http://assets.lp.alibaba.com/apps/lpmall/supermall/list/1.0/list-min.js
	 * http://assets.lp.alibaba.com/apps/lpmall/supermall/list/1.0/list-min.js?t=1212
	 */
	if (!query || query.indexOf('?') === -1) {
		fileArray.push(options.pathname);
		return fileArray;
	}
	/*
	 * 这里处理下面这种情况
	 * http://assets.lp.alibaba.com/??s/kissy/1.1.6/kissy-min.js,apps/lpmall/supermall/list/1.0/list-min.js?t=20120718170420120524.js
	 */
	 fileStr = query.split('?')[1];
	 fileStr.split(',').forEach(function (item) {
		 fileArray.push(options.pathname + item);
	 });
	 return fileArray;
}

function changeLessPath(fileArray) {
	var file,
		lessPath = [];
	fileArray.forEach(function (file) {
		if (/\.css/.test(file)) {
			file = formatFilePath(file);
			lessPath.push(file.path + '/less/' + file.name + '.css');
		}
	});

	return lessPath;
}

function formatFilePath(filePath) {
	var file = {};
	if (!filePath) {
		return '';
	}
	file.name = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('.'));
	file.path = filePath.substring(0, filePath.lastIndexOf('/'));
	file.ext = filePath.substring(filePath.lastIndexOf('.') + 1);

	return file;
}

function sendHttpRequest(url, doResponse) {
	var options = urlParse(url),
		protocol = {
			'http:' : http,
			'https:' : https
		};
	http.get(options, function(response) {
		doResponse(response);
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});
}

function getCssFile(path, topResponse) {
	var host = 'http://u.taobao.net',
		lessPath = changeLessPath(path),
		fileData = '',
		fileDataArr = [],
		length = path.length;
	console.log(path);
	lessPath.forEach(function (file, index) {
		sendHttpRequest(host + file, function (response) {
			response.setEncoding('binary');
			response.on('data', function (chunk) {
				fileData += chunk;
			});
			response.on('end', function () {
				if (fileData.length > 0) {
					renderCss(fileData, function (css) {
						fileDataArr[index] = css;
						length--;
						cutLength(length, fileDataArr, topResponse);
					});
				}
				else{
					sendHttpRequest(host + path[index], function (res) {
						res.on('data', function (chunk) {
							fileData += chunk;
						});
						res.on('end', function (chunk) {
							fileDataArr[index] = fileData;
							length--;
							cutLength(length, fileDataArr, topResponse);
						});
					});
				}
			});
		});
	});
}

function renderCss(cssData, callback) {
	less.render(cssData, function (e, css) {
		callback(css);
	});
}

function cutLength(length, fileData, topResponse) {
	if (length <= 0) {
		console.log(fileData);
		topResponse.write(fileData.join(''));
		topResponse.end();
		console.log('----------');
	}
}