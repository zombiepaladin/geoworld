var fs = require('fs'),
	uglifyJS = require("uglify-js"),
	cleanCSS = require("clean-css"),
	manifest = require("./manifest.json");

// ==========================================
// JavaScript pre-processing
//-------------------------------------------	

// Combine JavaScript files with uglify-js
// File list is pulled from the manifest.json file
// Be sure to list files in order of inclusion
// to avoid initialization issues
var minifiedJS = uglifyJS.minify(manifest.javascripts);

// Write combined, minified, JavaScript file to release directory
fs.writeFile('release/geoworld.js', minifiedJS.code, function(err) {
	if(err) {
		console.error("Could not write release/geoworld.js file\n" + err);
		return;
	}
	console.log("wrote file: release/geoworld.js");
});


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
fs.readdir('resources/spritesheets', function(err, files) {
	
	if(err) {
		console.error("Could not read from directory resources/spritesheets\n" + err);
		return;
	}
	
	files.forEach(function(fileName, index, array) {
		fs.createReadStream('resources/spritesheets/' + fileName).pipe(fs.createWriteStream('release/' + fileName));
		console.log("wrote file: release/" + fileName);
	});
});