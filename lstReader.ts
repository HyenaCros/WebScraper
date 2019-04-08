import {createReadStream, writeFileSync, readFile } from 'fs'
import * as readline from 'readline';

function format(str: string) {
    return str[0].toUpperCase() + str.substring(1).toLowerCase()
}

let lineNum = -1;
const feats = {};
const lineReader = readline.createInterface({
    input: createReadStream('cr_feats.lst')
});
lineReader.on('line', line => {
    lineNum++;
    if (line.startsWith('#') || line.startsWith('\"#') || lineNum < 8) return;
    let data = line.split('\t').filter((val) => {
        if (val) return val;
    });
    let feat: any = {}
    if (data.length > 0) {
        data.forEach((fragment, i) => {
            if (i == 0) feat.name = fragment;
            else {
                let [sub, ...rest] = fragment.split(':');
                feat[format(sub)] = rest.reduce((p, c) => p + ':' + c);
            }
        })
        let name = feat.name;
        delete feat.name;
        feats[name] = feat;
    }
    if (lineNum > 202) lineReader.close();
});
lineReader.on('close', () => {
    writeFileSync('cr_feats.json', JSON.stringify({ feats }, null, 4));
})