@ECHO OFF
SET param=%1

IF "%param%"=="/?" (
    ECHO This program allows to convert text file encoding from CP886 into UTF-8 in batch. 
    ECHO Please provide the relative path to the needed directory.
    EXIT /B
)
 
SET directory=%cd%\%param%

IF NOT EXIST %directory% (
ECHO The specified directory does not exist. Please provide the correct path.
EXIT /B
)
 
FOR /R %directory% %%f IN (*.txt) DO (
 IF NOT "%errorlevel%"=="1" (
     ECHO An error with code %errorlevel% occured.
     EXIT /B
 )
 iconv -f CP866 -t UTF-8 "%%f">>tmp.txt
 MOVE /Y tmp.txt "%%f" >nul
 )