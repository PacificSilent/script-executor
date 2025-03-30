const express = require("express");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(express.static("public"));

const scriptsConfigPath = path.join(__dirname, "scripts-config.json");
let scriptsConfig = [];

const loadScriptsConfig = () => {
  try {
    const data = fs.readFileSync(scriptsConfigPath, "utf-8");
    scriptsConfig = JSON.parse(data);
  } catch (err) {
    console.error("Error loading scripts-config.json:", err);
  }
};

app.post("/execute", (req, res) => {
  let scriptsConfig;
  try {
    const data = fs.readFileSync(scriptsConfigPath, "utf-8");
    scriptsConfig = JSON.parse(data);
  } catch (err) {
    return res.status(500).json({
      message: "Error loading scripts-config.json",
      error: err.message,
    });
  }

  const { script, fps } = req.body;
  const scriptConfig = scriptsConfig.find((s) => s.name === script);
  if (!scriptConfig) {
    return res.status(400).json({ message: "Script not allowed or not found" });
  }

  if (scriptConfig.name === "global_fps_custom.bat" && fps) {
    const vbsContent = `Set WshShell = CreateObject("WScript.Shell")
  WshShell.Run "cmd.exe /c ${path.join(
    __dirname,
    "scripts",
    "global_fps_custom.bat"
  )} ${fps}", 0, False`;

    const tempVbsPath = path.join(__dirname, "scripts", "temp_fps.vbs");
    fs.writeFileSync(tempVbsPath, vbsContent);

    const proceso = spawn("wscript.exe", [tempVbsPath], {
      windowsHide: true,
      stdio: "pipe",
    });

    let output = "";
    proceso.stdout.on("data", (data) => {
      output += data.toString();
    });
    proceso.stderr.on("data", (data) => {
      output += data.toString();
    });
    proceso.on("error", (error) => {
      console.error(`Error executing script: ${error.message}`);
      res
        .status(500)
        .json({ message: "Error executing script", error: error.message });
    });
    proceso.on("close", (code) => {
      fs.unlinkSync(tempVbsPath);

      if (code === 0) {
        res.json({
          message: `Script "${scriptConfig.description}" executed successfully`,
          output,
        });
      } else {
        res.status(500).json({
          message: `Script finished with errors (code ${code})`,
          output,
        });
      }
    });
    return;
  }

  const vbsName = scriptConfig.name.replace(/\.bat$/i, ".vbs");
  const vbsScriptPath = path.join(__dirname, "scripts", vbsName);

  if (!fs.existsSync(vbsScriptPath)) {
    return res
      .status(404)
      .json({ message: "VBScript file for the script does not exist" });
  }

  const proceso = spawn("wscript.exe", [vbsScriptPath], {
    windowsHide: true,
    stdio: "pipe",
  });

  let output = "";
  proceso.stdout.on("data", (data) => {
    output += data.toString();
  });

  proceso.stderr.on("data", (data) => {
    output += data.toString();
  });

  proceso.on("error", (error) => {
    console.error(`Error executing script: ${error.message}`);
    res
      .status(500)
      .json({ message: "Error executing script", error: error.message });
  });

  proceso.on("close", (code) => {
    if (code === 0) {
      res.json({
        message: `Script "${scriptConfig.description}" executed successfully`,
        output,
      });
    } else {
      res.status(500).json({
        message: `Script finished with errors (code ${code})`,
        output,
      });
    }
  });
});

app.get("/scripts", (req, res) => {
  res.json(scriptsConfig);
});

loadScriptsConfig();

fs.watchFile(scriptsConfigPath, (curr, prev) => {
  console.log("scripts-config.json has changed. Reloading...");
  loadScriptsConfig();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
