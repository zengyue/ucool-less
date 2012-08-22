
/*
 * GET home page.
 */

var path = require('path'),
	less = require('less'),
	fs = require('fs'),
	childProcess = require("child_process"),
	exec = childProcess.exec,
	spawn = childProcess.spawn,
	lessc;

var basepath = 'Y:/u_supermall0802/apps/lpmall/supermall/list/1.0';

exports.index = function(req, res){
	var url = req.url,
		dirname = path.dirname(url),
		//将xxx.source.css 换成 xxx.css
		basename = path.basename(url).replace(/\.source\./,'.'),
		extname = path.extname(basename),
		filepath = path.join(basepath, dirname, basename),
		lessBasename,
		lessFilepath;


	//如果是css文件才去找.less文件
	if (extname === '.css') {
		lessBasename = basename.replace(/.css/, '.less');
		lessFilepath = path.join(basepath, dirname, 'less', lessBasename);

		//如果在同级目录的less文件夹中存在.less文件，则取.less文件进行编译输出
		path.exists(lessFilepath, function (exists) {
			if (exists) {
				exec('lessc "' + lessFilepath + '"', function (error, stdout, stderr) {
					if (error) {
						console.log('lessc error: ' + error);
					}
					if (stderr) {
						console.log('lessc stderr: ' + stderr);
					}
					//添加本地文件路径
					res.write('/*local filePath=');
					res.write(lessFilepath);
					res.write('*/\r\n');

					res.write(stdout);
					res.end();
				});
			}
			//如果不存在less文件则读取css文件
			else{
				fs.readFile(filepath, function (err, data) {
					if (err) {
						data = '';
					}
					res.write(data);
					res.end();
				});
			}
		});
	}
	else{
		fs.readFile(filepath, function (err, data) {
			if (err) {
				data = '';
			}
			res.write(data);
			res.end();
		});
	}
};