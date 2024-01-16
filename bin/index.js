#!/usr/bin/env node

'use strict'

import {fileExists, getFullPath} from "../src/shared/os_utils.js";
import {stopSourceWatcher, watchFile} from "../src/sourcewatcher.js";
import {startServer} from "../src/server.js";
import path from "path";
import fs from "fs";
import {getOutputFolder} from "../src/shared/slidebuild.js";
import {startAppServer, stopAppServer} from "../src/AppServer.js";
import {getPort} from "../src/shared/config.js";

async function main(filename) {

    if(fileExists(filename)){

        process.on('SIGINT', cleanup);  // Ctrl+C in terminal
        process.on('SIGTERM', cleanup); // Termination request from the OS
        process.on('exit', cleanup);    // Normal exit
        //
        // const currentFolder = getFolderPathForFile(filename);
        // console.log("Current Folder " + currentFolder)
        // setProjectRunningFolder(currentFolder)


        const fullPathOfFileName = getFullPath(filename);
         watchFile(fullPathOfFileName);

        const folder = getOutputFolder();


        await startAppServer(folder,getPort())




    }else {
        console.log("File Does not Exist" + filename)
        process.exit(1);
    }

}


function cleanup() {
    console.log("Cleaning up before exit");
    stopSourceWatcher();
    stopAppServer();
    process.exit(0);
}

function  getMarkdownFileFromCurrentDirectory(){
    return new Promise((resolve, reject) => {
        const directory = process.cwd(); // Gets the current working directory

        fs.readdir(directory, (err, files) => {
            if (err) {
                reject('Error reading directory: ' + err);
                return;
            }

            const markdownFiles = files.filter(file => path.extname(file).toLowerCase() === '.md');

            if (markdownFiles.length === 0) {
                reject('No Markdown files found');
            } else if (markdownFiles.length > 1) {
                reject('More than one Markdown file found , choose a filename to be parameter');
            } else {
                resolve(path.join(directory, markdownFiles[0])); // Get the full path of the first file
            }
        });
    });

}

(async () => {


    try {
        let filename = null

        const params =process.argv.slice(2);
        if(params.length === 0){
            console.log(process.cwd())

            filename = await getMarkdownFileFromCurrentDirectory()

            console.log("Using file from current directory "+ filename)


        }else{

             filename = params[0];
        }

        if(filename === null){
            console.log("No file provided")
            process.exit(1);
        }

       await main(filename);


    }catch (err) {
        console.log("Error" , err)

        process.exit(1);
    }

})();