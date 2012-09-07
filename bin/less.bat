@echo off

set filename=%1
set charset=%2

set lesspath=less/%filename%.less
set csspath=%filename%.css

echo %lesspath%

if not exist %lesspath% (
	echo "*****文件不存在！*****"
	goto End
)

call lessc %lesspath% > %csspath%
call native2ascii -encoding utf-8 %csspath% tmp.%csspath%
del %csspath%
call native2ascii -reverse tmp.%csspath% %csspath%
del tmp.%csspath%


:End
ENDLOCAL
pause