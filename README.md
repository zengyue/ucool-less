本地nodejs环境代理ucool上的less文件
=======================================

 * 使用ucool上本地代理功能
 * 在请求css文件是nodejs读本地less文件夹下同名的less文件进行编译输出



 使用说明
-----------
 - 下载工程文件 git clone 
 - cd 到根目录下 npm install
 - 使用ucool的本地代理功能，并输入匹配的目录
 - 需要修改basepath目录与ucool上的匹配目录一致
 - 然后启动node环境 node app.js


 优点
--------
 - 在开发时不需要引用编译less的js文件
 - 访问css文件时直接是读取less文件进行编译的，每次改完后不需要再重新生成一次
 - 保持开发环境与线上链接的一致

 其他
--------
less css 官网 <http://www.lesscss.net/>


 更多功能
--------
 - 还在思考中。。