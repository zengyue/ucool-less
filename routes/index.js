
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
		//��xxx.source.css ���� xxx.css
		basename = path.basename(url).replace(/\.source\./,'.'),
		extname = path.extname(basename),
		filepath = path.join(basepath, dirname, basename),
		lessBasename,
		lessFilepath;


	//�����css�ļ���ȥ��.less�ļ�
	if (extname === '.css') {
		lessBasename = basename.replace(/.css/, '.less');
		lessFilepath = path.join(basepath, dirname, 'less', lessBasename);

		//�����ͬ��Ŀ¼��less�ļ����д���.less�ļ�����ȡ.less�ļ����б������
		path.exists(lessFilepath, function (exists) {
			if (exists) {
				exec('lessc "' + lessFilepath + '"', function (error, stdout, stderr) {
					if (error) {
						console.log('lessc error: ' + error);
					}
					if (stderr) {
						console.log('lessc stderr: ' + stderr);
					}
					//��ӱ����ļ�·��
					res.write('/*local filePath=');
					res.write(lessFilepath);
					res.write('*/\r\n');

					res.write(stdout);
					res.end();
				});
			}
			//���������less�ļ����ȡcss�ļ�
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