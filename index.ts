import cheerio from 'cheerio';
import Axios from 'axios';
import { v1 as neo4j } from 'neo4j-driver';
import { createReadStream, writeFileSync, readFile } from 'fs'
import * as readline from 'readline';

const driver = neo4j.driver('bolt://hyenacros.com:7687', neo4j.auth.basic('neo4j', 'cheesecake'));
const session = driver.session();



const url = 'http://legacy.aonprd.com/coreRulebook/classes/sorcerer.html#sorcerer';
Axios.get(url).then(res => {
    const $: JQueryStatic = cheerio.load(res.data);
    const levels = [];
    $('#table-3-15-sorcerer-spells-known tbody tr').each(function (i) {
        const level = [];
        $(this).children().each(function (j) {
            if (j > 0) {
                const spells = Number.parseInt($(this).text());
                if (spells) level.push(spells);
            }
        })
        levels.push(level);
    });
    let query = `match (c:Class {name: 'Sorcerer'})`
    levels.forEach((level, i) => {
        query += `, (c)-->(l${i + 1}:ClassLevel {level: ${i + 1}})`
    });
    query += '\n';
    levels.forEach((level, i) => {
        query += `set l${i + 1}.knownSpells = [${level}]\n`;
    });
    return session.run(query);
}).catch(err => {
    console.log(err);
}).then(() => {
    driver.close();
})
