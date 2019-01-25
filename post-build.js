const fs = require("fs");

console.log("Copying template to output folder ...");
fs.copyFileSync("./package-template.json", "./dist/package-template.json");
