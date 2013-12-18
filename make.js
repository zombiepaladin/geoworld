var fs = require('fs'),
  path = require('path'),
  uglifyJS = require("uglify-js"),
  cleanCSS = require("clean-css"),
  manifest = require("./manifest.json");

// ==========================================
// Ensure the release directory exists
//-------------------------------------------	

if (!fs.existsSync('release')) {
  console.log("Creating release directory since it does not exist yet...");
  fs.mkdirSync('release');
}

// ==========================================
// JavaScript pre-processing
//-------------------------------------------	

//Disabling this for now because it make debugging a nightmare.
//TODO: Add source map generation and have people use that.
//      (I am refraining from doing that for now because some people complained about source maps not working right.)

// Combine JavaScript files with uglify-js
// File list is pulled from the manifest.json file
// Be sure to list files in order of inclusion
// to avoid initialization issues
//var minifiedJS = uglifyJS.minify(manifest.javascripts);

// Write combined, minified, JavaScript file to release directory
//fs.writeFile('release/geoworld.js', minifiedJS.code, function(err) {
//  if(err) {
//    console.error("Could not write release/geoworld.js file\n" + err);
//    return;
//  }
//  console.log("wrote file: release/geoworld.js");
//});

manifest.javascripts.forEach(function (fileName, index, array) {
  fs.createReadStream(fileName).pipe(fs.createWriteStream('release/' + path.basename(fileName)));
  console.log("wrote file: release/" + path.basename(fileName));
});


//==============================================
// CSS pre-processing
//----------------------------------------------

// Read CSS from files listed in manifest object (currently only geoworld.css)
var cssSource = "";
manifest.stylesheets.forEach(function (fileName, index, array) {
  cssSource = cssSource.concat(fs.readFileSync('src/css/geoworld.css', 'utf8'));
});

// Minify the CSS code using clean css
var minifiedCSS = cleanCSS().minify(cssSource);

// Write the finalized CSS code to the release directory
fs.writeFile('release/geoworld.css', minifiedCSS, function (err) {
  if (err) {
    console.error("Could not write release/geoworld.css file\n" + err);
    return;
  }
  console.log("wrote file: release/geoworld.css");
});


//==============================================
// Image pre-processing
//----------------------------------------------

// For now just copy all images from the resources directory
function processImageDirectory(dir) {
  fs.readdir(dir, function (err, files) {

    if (err) {
      console.error("Could not read from directory " + dir + "\n" + err);
      return;
    }

    files.forEach(function (fileName, index, array) {
      fs.createReadStream(dir + '/' + fileName).pipe(fs.createWriteStream('release/' + fileName));
      console.log("wrote file: release/" + fileName);
    });
  });
}
processImageDirectory('resources/spritesheets');
processImageDirectory('resources/tilesets');
processImageDirectory('resources/text');
processImageDirectory('resources/backgrounds');


//==============================================
// HTML pre-processing
//----------------------------------------------

// For now just copy all HTML files from the src directory
fs.readdir('src/html', function (err, files) {

  if (err) {
    console.error("Could not read from directory src/html\n" + err);
    return;
  }

  files.forEach(function (fileName, index, array) {
    fs.createReadStream('src/html/' + fileName).pipe(fs.createWriteStream('release/' + fileName));
    console.log("wrote file: release/" + fileName);
  });
});

//==============================================
// Level pre-processing
//----------------------------------------------
levels_list = [];
highestLevel = 0;
highestPhases = [];

manifest.levels.forEach(function (level, index, array) {
  var phaseNum = level[0];
  var subphaseNum = level[1];
  var levelFile = level[2];
  var levelName = "level_" + phaseNum.toString() + "_" + subphaseNum.toString();

  if (levels_list[phaseNum] == undefined) {
    levels_list[phaseNum] = [];
  }

  levels_list[phaseNum][subphaseNum] = levelName;

  if (phaseNum > highestLevel) {
    highestLevel = phaseNum;
  }

  if (highestPhases[phaseNum] == undefined || subphaseNum > highestPhases[phaseNum]) {
    highestPhases[phaseNum] = subphaseNum;
  }

  // Write the level file to the release directory:
  var outFile = fs.createWriteStream('release/' + levelFile);

  //Pre-pend the level name and an equals sign so the json gets parsed as javascript.
  //(In the future the json should get loaded when it is neaded using ajax or something similar.)
  outFile.write(levelName + " = ");

  //Pipe level data to destination file:
  fs.createReadStream('resources/levels/' + levelFile).pipe(outFile);
  console.log("wrote file: release/" + levelFile);
});

//Generate level listing and save it to the release directory:
var levelMetaDataFile = fs.createWriteStream('release/levels_list.json');
levelMetaDataFile.write('levels_list = ' + JSON.stringify(levels_list));
console.log("write levels list file");
