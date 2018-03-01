/* eslint-env jasmine, node */

let fs = require("fs");

const CWD = process.cwd();

beforeAll(function(){

    this.loadClass = (path) => {
        let pathToLoad = `${CWD}/${path}`;
        console.log(`Loading: ${pathToLoad}`);
        let data = fs.readFileSync(pathToLoad, "utf8");
        let loaded = eval(`(${data.toString()})`);
        console.log(`Loaded: "${loaded.name}"`);
        return loaded;
    };

});

