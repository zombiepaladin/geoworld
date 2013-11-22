var fs = require('fs'),
	UglifyJS = require("uglify-js"),
	CleanCSS = require("clean-css")
	
// ==========================================
// JavaScript pre-processing
//-------------------------------------------	

// Combine JavaScript files with uglify-js
// Be sure to list files in order of inclusion
// to avoid initialization issues
var minifiedJS = UglifyJS.minify([
	"src/js/utilities.js",
	"src/js/animation_polyfill.js",
	"src/js/math_helper_library.js",
	"src/js/vector_library.js",
	"src/js/dynamicPhysicsObject.js",
	"src/js/player.js",
	"src/js/geoworld.js"
]);

// Write combined, minified, JavaScript file to release directory
fs.writeFile('release/geoworld.js', minifiedJS.code, function(err) {
	if(err) {
		console.log("Could not write release/geoworld.js file\n" + err);
	}
});


//==============================================
// CSS pre-processing
//----------------------------------------------

// Read CSS from file (currently only geoworld.css)
var cssSource = fs.readFileSync('src/css/geoworld.css', 'utf8');

// Minify the CSS code using clean css
var minifiedCSS = CleanCSS().minify(cssSource);

// Write the finalized CSS code to the release directory
fs.writeFile('release/geoworld.css', minifiedCSS, function(err) {
	if(err) {
		console.log("Could not write release/geoworld.css file\n" + err);
	}
});


//==============================================
// Image pre-processing
//----------------------------------------------

// For now just copy all images from the resources directory
fs.readdir('resources/spritesheets', function(err, files) {
	
	if(err) {
		console.log("Could not read from directory resources/spritesheets\n" + err);
	}
	
	files.forEach(function(fileName, index, array) {
		fs.createReadStream('resources/spritesheets/' + fileName).pipe(fs.createWriteStream('release/' + fileName));
	});
});
