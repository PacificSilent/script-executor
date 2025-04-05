Set WshShell = WScript.CreateObject("WScript.Shell")
WScript.Sleep 500
' Envía el atajo Ctrl+Alt+S
WshShell.SendKeys "^%s"