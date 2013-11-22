var http = require('http'),
	url = require('url'),
	fs = require('fs'),
	uglifyJS = require("uglify-js"),
	cleanCSS = require("clean-css"),
	manifest = require("./manifest.json");

//===========================================
// JavaScript processing
//-------------------------------------------

// Watch the files in the manifest.javascripts array
//  and re-process the combined, minified JavaScript any time a change is made
manifest.javascripts.forEach( function(fileName, index, array) {

	fs.watch(fileName, function(event, filename){	
		console.log(fileName + " changed, reprocessing JavaScripts");
		
		// Combine JavaScript files with uglify-js
		var minifiedJS = uglifyJS.minify(jsFileList);

		// Write combined, minified, JavaScript file to release directory
		fs.writeFile('release/geoworld.js', minifiedJS.code, function(err) {
			if(err) {
				console.error("Could not write release/geoworld.js file\n" + err);
				return;
			}
			console.log("wrote file: release/geoworld.js");
		});
		
	});
});

console.log("Watching for changes in JavaScript");


//==============================================
// CSS processing
//----------------------------------------------

// Watch the files in the manifest.stylesheets array file and re-process it any time changes are made
manifest.stylesheets.forEach(function(fileName, index, array) {

	fs.watch(fileName, function(event, fileName) {
		console.log(fileName + " changed, reprocessing " + fileName);
		
		// Read CSS from filenames in the manifest
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
	});
	
});

console.log("Watching for changes in CSS");


//==============================================
// Image processing
//----------------------------------------------

// Watch the spritesheet directory and copy files as changes are made
fs.watch('resources/spritesheets', function(event, fileName) {

	// If a file exists, copy it 
	// note -- removing a file does not delete it from releases!
	if(fileName !== null) {
		console.log(fileName + " changed, reprocessing " + fileName);
		fs.createReadStream('resources/spritesheets/' + fileName).pipe(fs.createWriteStream('release/' + fileName));
	}
});

console.log("Watching for changes in spritesheets");