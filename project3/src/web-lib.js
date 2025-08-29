import * as path from "path";
import * as net from "net";
import * as fs from "fs";
import MarkdownIt from "markdown-it";

const MIME_TYPES = {
    "jpg" : "image/jpg",
    "jpeg" : "image/jpeg",
    "png" : "image/png",
    "html" : "text/html",
    "css" : "text/css",
    "txt" : "text/plain"
};

/**
 * returns the extension of a file name (for example, foo.md returns md)
 * @param fileName (String)
 * @return extension (String)
 */
function getExtension(fileName) {
    const formatPath = path.extname(fileName).toLowerCase();
    if (formatPath.startsWith(".")) {
        return formatPath.substring(1);
    }
    return formatPath;
}

/**
 * determines the type of file from a file's extension (for example,
 * foo.html returns text/html
 * @param: fileName (String)
 * @return: MIME type (String), undefined for unkwown MIME types
 */
function getMIMEType(fileName) {
    const ext = path.extname(fileName);
    return ext.length > 0 ? MIME_TYPES[ext.substring(1)] : null;
}

class Request {
    constructor(reqStr) {
        const [method, path] = reqStr.split(" ");
        this.method = method;
        this.path = path;
    }
}

class Response {

    static STATUS_CODES = {
        200 : "OK",
        308 : "Permanent Redirect",
        404 : "Page Not Found",
        500 : "Internal Server Error"
    };

    constructor(socket, statusCode = 200, version = "HTTP/1.1") {
        this.sock = socket;
        this.statusCode = statusCode;
        this.version = version;
        this.headers = {};
        this.body = null;
    }

    setHeader(name, value) {
        this.headers[name] = value;
    }

    status(statusCode) {
        this.statusCode = statusCode;
        return this;
    }

    send(body) {
        this.body = body ?? "";
      
        if (!Object.hasOwn(this.headers, "Content-Type")) {
            this.headers["Content-Type"] = "text/html";
        }

        const statusCodeDesc = Response.STATUS_CODES[this.statusCode];

        const headersString = Object.entries(this.headers).reduce((s, [name, value]) => {
            return s + `${name}: ${value} \r\n`;
        }, "");

        this.sock.write(`${this.version} ${this.statusCode} ${statusCodeDesc}\r\n`);
        this.sock.write(`${headersString}\r\n`);
        this.sock.write(this.body);

        this.sock.end();
    }
}

class HTTPServer {
    constructor(rootDirFull, redirectMap) {
        this.rootDirFull = rootDirFull;
        this.redirectMap = redirectMap;
        this.server = net.createServer(this.handleConnection.bind(this));
    }

    listen(port, host) {
        this.server.listen(port, host);
    }

    handleConnection(sock) {
        sock.on("data", data => {
            console.log(`Received data: ${data.toString()}`); 
            this.handleRequest(sock, data);
        });
    
        sock.on("error", (err) => {
            console.error("Socket Error:", err);
        });
    
        sock.on("close", () => {
            console.log("Connection closed");
        });
    }

    handleRequest(sock, binaryData) {
        
        const req = new Request(binaryData.toString());
        const res = new Response(sock);
        const reqPathFull = path.join(this.rootDirFull, req.path);

        //redirect
        if (this.redirectMap[req.path]) {

            const newPath = this.redirectMap[req.path];

            res.status(308);
            res.setHeader("Location", newPath);
            res.send(`Redirecting to <a href="${newPath}">${newPath}</a>`);
            return ;
        }

        fs.access(reqPathFull, fs.constants.F_OK, (err) => {
            if (err) {
                console.error(`File not found: ${req.path}`);
                res.status(404);
                res.send("404 Not Found");
                return;
            }
    
            //if directory
            fs.stat(reqPathFull, (err, stats) => {
                if (err) {
                    console.error(`Error accessing file: ${reqPathFull}`, err);
                    res.status(500);
                    res.send("500 Internal Server Error");
                    return;
                }
    
                if (stats.isDirectory()) {
                    // provide list in the directory (folder?)
                    fs.readdir(reqPathFull, { withFileTypes: true }, (err, files) => {
                        if (err) {
                            console.error(`Error reading directory: ${reqPathFull}`, err);
                            res.status(500);
                            res.send("500 Internal Server Error");
                            return;
                        }
                        
                        // unpacking the folder
                        let body = "<html><body><ul>";
                        files.forEach(file => {
                            let slash = "";
                            if (file.isDirectory()) {
                                slash = "/";
                            }
                            body += `<li><a href="${req.path}/${file.name}${slash}">${file.name}${slash}</a></li>`;
                        });
                        body += "</ul></body></html>";
    
                        res.status(200);
                        res.setHeader("Content-Type", "text/html");
                        res.send(body);
                    });
                } else {
                    // not a directory... markdown -> html, or static...
                    const fileExtension = getExtension(reqPathFull);
                    if (fileExtension === "md" || fileExtension === "markdown") {
                        fs.readFile(reqPathFull, 'utf-8', (err, data) => {
                            if (err) {
                                console.error(`Error reading file: ${reqPathFull}`, err);
                                res.status(500);
                                res.send("500 Internal Server Error");
                                return ;
                            }

                            console.log(`Markdown File: ${req.path}`);
                            const markdown = new MarkdownIt({ html: true });
                            const renderedHtml = markdown.render(data);
                            res.status(200);
                            res.setHeader("Content-Type", "text/html");
                            res.send(renderedHtml);
                        });
                    }
                    // provide static file
                    else {
                        fs.readFile(reqPathFull, (err, data) => {
                            if (err) {
                                console.error(`Error reading file: ${reqPathFull}`, err);
                                res.status(500);
                                res.send("500 Internal Server Error");
                                return;
                            }
        
                            res.status(200);
                            res.setHeader("Content-Type", getMIMEType(reqPathFull));
                            res.send(data);
                        });
                    }
                    
                }
            });
        });
    }

}


export {
    Request,
    Response,
    HTTPServer
};

// cd desktop/homework03-Youngsang-Cho1