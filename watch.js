var http = require('http'),
	url = require('url'),
	fs = require('fs'),
	uglifyJS = require("uglify-js"),
	cleanCSS = require("clean-css");

//===========================================
// JavaScript processing
//-------------------------------------------

// All javascript files within the geoworld application
// Be sure to list files in order of inclusion
// to avoid initialization issues
var jsFileList = [
	"src/js/utilities.js",
	"src/js/animation_polyfill.js",
	"src/js/math_helper_library.js",
	"src/js/vector_library.js",
	"src/js/dynamicPhysicsObject.js",
	"src/js/player.js",
	"src/js/geoworld.js"
];

// Combine and minify all files in the jsFileList array 
function processJavaScript() {

	// Combine JavaScript files with uglify-js
	var minifiedJS = uglifyJS.minify(jsFileList);

	// Write combined, minified, JavaScript file to release directory
	fs.writeFile('release/geoworld.js', minifiedJS.code, function(err) {
		if(err) {
			console.error("Could not write release/geoworld.js file\n" + err);
		}
	});
}

// Watch the files in the jsFileList array, and re-process
// the combined, minified JavaScript any time a change is made
jsFileList.forEach( function(fileName, index, array) {
console.log(fileName);
	fs.watch(fileName, function(event, filename){
		console.log(fileName + " changed, reprocessing JavaScripts");
		processJavaScript();
	});
});

console.log("Watching for changes in JavaScript");


//==============================================
// CSS processing
//----------------------------------------------

// All css files within the Geoworld application 
// (currently just geoworld.css) are minified
// and placed in the releases directory
function processCSS() {

	// Read CSS from file (currently only geoworld.css)
	var cssSource = fs.readFileSync('src/css/geoworld.css', 'utf8');

	// Minify the CSS code using clean css
	var minifiedCSS = cleanCSS().minify(cssSource);

	// Write the finalized CSS code to the release directory
	fs.writeFile('release/geoworld.css', minifiedCSS, function(err) {
		if(err) {
			console.log("Could not write release/geoworld.css file\n" + err);
		}
	});
}

// Watch the CSS file and re-process it any time changes are made
fs.watch('src/css/geoworld.css', function(event, fileName) {
    console.log(event);
	console.log(fileName + " chagned, reprocessing " + fileName);
	processCSS();
});

console.log("Watching for changes in CSS");


//==============================================
// Image processing
//----------------------------------------------

function processSpriteSheets() {
	// For now just copy all images from the resources directory
	fs.readdir('resources/spritesheets', function(err, files) {
		
		if(err) {
			console.log("Could not read from directory resources/spritesheets\n" + err);
		}
		
		files.forEach(function(fileName, index, array) {
			fs.createReadStream('resources/spritesheets/' + fileName).pipe(fs.createWriteStream('release/' + fileName));
		});
	});
};

// Watch the spritesheet directory and copy files as changes are made
fs.watch('resources/spritesheets', function(event, fileName) {
	console.log(fileName + " changed, reprocessing " + fileName);
	fs.createReadStream('resources/spritesheets/' + fileName).pipe(fs.createWriteStream('release/' + fileName));
});

console.log("Watching for changes in spritesheets");