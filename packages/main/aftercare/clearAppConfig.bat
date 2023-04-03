@echo off

:isExistProcess
set /a has=0
for /f "tokens=1-2 delims= " %%i in ('tasklist') do (
    if %%j == %2 (
        if "%%i" == "electron.exe" (
            echo %%i %%j
            set /a has=1
        )
    )
)
echo %has% %1 %2
if %has% == 1 goto isExistProcess
rmdir /s /q %1
echo %3
start %3