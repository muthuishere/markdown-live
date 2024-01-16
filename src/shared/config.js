import path from "path";

export let PORT = 9500;

export function getPort() {
    return PORT;
}
export function setPort(port) {
    PORT = port;

}

export function getIndexUrl() {
    return `http://localhost:${PORT}/`;
}

export function getFullPresentationUrl(filename) {
    const basename = path.basename(filename);
    let htmlFile = basename.replace(".md", ".html");
    return `http://localhost:${PORT}/` + htmlFile;
}