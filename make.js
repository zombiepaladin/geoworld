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

// Command line switch for debug mode (since source maps don't work with breakpoints)
if (process.argv[2] === "debug" || process.argv[2] === "d") {
	manifest.javascripts.forEach(function (fileName, index, array) {
		fs.createReadStream(fileName).pipe(fs.createWriteStream('release/' + path.basename(fileName)));
		console.log("wrote file: release/" + path.basename(fileName));
	});
}
else {
	// Combine JavaScript files with uglify-js
	// File list is pulled from the manifest.json file
	// Be sure to list files in order of inclusion
	// to avoid initialization issues
	var minifiedJS = uglifyJS.minify(manifest.javascripts, manifest.testJavascriptOptions);
	var sourceMapFix = "\n //# sourceMappingURL="+manifest.testJavascriptOptions.outSourceMap;


	// Write combined, minified, JavaScript file to release directory
	// To see source, turn on source maps in your browser if they aren't already: http://net.tutsplus.com/tutorials/tools-and-tips/source-maps-101/
	fs.writeFile('release/geoworld.js', minifiedJS.code + sourceMapFix, function(err) {
	  if(err) {
		console.error("Could not write release/geoworld.js file\n" + err);
		return;
	  }
	  console.log("wrote file: release/geoworld.js");
	});
	fs.writeFile('release/out.js.map', minifiedJS.map, function(err){
	  if(err){
		console.error("Could not write release/out.js.map\n "+err);
		return;
	  }
	  console.log("wrote file: release/out.js.map");
	});
}


//==============================================
// CSS pre-processing
//----------------------------------------------


// Read CSS from files listed in manifest object (currently only geoworld.css)
var cssSource = "";
manifest.stylesheets.forEach(function(fileName, index, array) {
  cssSource = cssSource.concat(fs.readFileSync('src/css/geoworld.css', 'utf8'));
});

// Minify the CSS code using clean css
var minifiedCSS = cleanCSS().minify(cssSource);

// Write the finalized CSS code to the release directory
fs.writeFile('release/geoworld.css', minifiedCSS, function(err) {
  if(err) {
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
fs.readdir('src/html', function(err, files) {
  
  if(err) {
	console.error("Could not read from directory src/html\n" + err);
	return;
  }
  
  files.forEach(function(fileName, index, array) {
	fs.createReadStream('src/html/' + fileName).pipe(fs.createWriteStream('release/' + fileName));
	console.log("wrote file: release/" + fileName);
  });
});


//==============================================
// Level pre-processing
//----------------------------------------------

//For now, levels are just copied into the release directory
manifest.levels.forEach(function (fileName, index, array) {
  fs.createReadStream('resources/levels/' + fileName).pipe(fs.createWriteStream('release/' + fileName));
  console.log("wrote file: release/" + fileName);
});
