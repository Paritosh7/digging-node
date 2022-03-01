#!/usr/bin/env node

"use strict";
var util = require("util");
var path = require("path");
var args = require("minimist")(process.argv.slice(2), {
  boolean: ["help", "in"],
  string: ["file"],
});
var fs = require("fs");
var getStdin = require("get-stdin");

console.log(args);
// console.log(__dirname);
// console.log(path.resolve(args.file));

var BASE_PATH = path.resolve(process.env.BASE_PATH || __dirname);

if (process.env.HELLO) {
  console.log(process.env.HELLO);
}

if (args.help) printHelp();
else if (args.file) {
  let filePath = path.join(BASE_PATH, args.file);
  fs.readFile(filePath, function onContentLoad(err, contents) {
    if (err) {
      error(err.message);
    } else {
      console.log(contents);
      process.stdout.write(contents);
      processFile(contents.toString());
    }
  });
} else if (args.in || args._.includes("-")) {
  getStdin().then(processFile).catch(error);
} else {
  error("Incorrect Usage", true);
}

function processFile(contents) {
  contents = contents.toUpperCase();
  console.log(contents);
}

function error(msg, includeHelp = false) {
  console.log(msg);
  if (includeHelp) {
    printHelp();
  }
}

function printHelp() {
  console.log("ex1 usage : ");
  console.log("   ex1.js --file={FILENAME}");
  console.log("");
  console.log("--help                               print this help");
  console.log("--file={FILENAME}                    process this file");
  console.log("--in, -                              process stdin");
  console.log("");
}
