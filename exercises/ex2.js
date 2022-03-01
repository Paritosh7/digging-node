#!/usr/bin/env node

"use strict";
var util = require("util");
var path = require("path");
var args = require("minimist")(process.argv.slice(2), {
  boolean: ["help", "in", "out", "compress", "uncompress"],
  string: ["file"],
});
var fs = require("fs");
var Transform = require("stream").Transform;
var zlib = require("zlib");

console.log(args);
// console.log(__dirname);
// console.log(path.resolve(args.file));

var BASE_PATH = path.resolve(process.env.BASE_PATH || __dirname);

var OUTFILE = path.join(BASE_PATH, "out.txt");

if (process.env.HELLO) {
  console.log(process.env.HELLO);
}

if (args.help) printHelp();
else if (args.file) {
  let stream = fs.createReadStream(path.join(BASE_PATH, args.file));
  processFile(stream);
} else if (args.in || args._.includes("-")) {
  processFile(process.stdin);
} else {
  error("Incorrect Usage", true);
}

function processFile(inStream) {
  var readableStream = inStream;

  if (args.uncompress) {
    let gunzipStream = zlib.createGunzip();
    readableStream = readableStream.pipe(gunzipStream);
  }

  console.warn("start");

  var upStream = new Transform({
    transform(chunk, encoding, callback) {
      console.log("Being called again!");
      this.push(chunk.toString().toUpperCase());
      callback();
    },
  });

  console.warn("end");

  readableStream = readableStream.pipe(upStream);

  if (args.compress) {
    let gzipStream = zlib.createGzip();
    readableStream = readableStream.pipe(gzipStream);
    OUTFILE = `${OUTFILE}.gz`;
  }

  var targetStream;
  if (args.out) {
    targetStream = process.stdout;
  } else {
    targetStream = fs.createWriteStream(OUTFILE);
  }

  readableStream.pipe(targetStream);
}

function error(msg, includeHelp = false) {
  console.log(msg);
  if (includeHelp) {
    printHelp();
  }
}

function printHelp() {
  console.log("ex2 usage : ");
  console.log("   ex2.js --file={FILENAME}");
  console.log("");
  console.log("--help                               print this help");
  console.log("--file={FILENAME}                    process this file");
  console.log("--in, -                              process stdin");
  console.log("--out                                print to  stdout");
  console.log("--compress                           gzip the output");
  console.log("--uncompress                         unzip the input");
  console.log("");
}
