import * as webLib from './web-lib.js';
import * as path from "path";
import * as fs from "fs";

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

const configPath = path.join(__dirname, 'config.json');

fs.readFile(configPath, 'utf-8', (err, data) => {
    if (err) {
        console.error("Error reading config.json:", err);
        return;
    }
    try {
        console.log("Successfully read config.json");

        const processedData = JSON.parse(data);
        const rootDir = processedData["root_directory"];
        const fullPath = path.join(__dirname, "..", rootDir);
        const redirectMap = processedData["redirect_map"] || {};
    
        const server = new webLib.HTTPServer(fullPath, redirectMap);

        server.listen(3000, '127.0.0.1');
        console.log(`Server is running at http://127.0.0.1:3000`);
        console.log(`Serving files from: ${fullPath}`);
    
    }
    catch (error) {
        console.error("Error parsing config.json", error);
    }
});


// TODO: configure and start server
// cd desktop/homework03-Youngsang-Cho1