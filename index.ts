import cheerio from 'cheerio';//just jquery for node
import Axios from 'axios';// http request library 
import { v1 as neo4j } from 'neo4j-driver';//for the data base
import { createReadStream, writeFileSync, readFile } from 'fs'//used to play with files
import * as readline from 'readline';
import { print } from 'util';
const driver = neo4j.driver('bolt://hyenacros.com:7687', neo4j.auth.basic('neo4j', 'cheesecake'));
const session = driver.session();
const url = 'http://legacy.aonprd.com/coreRulebook/equipment.html';//for pulling the sorcers spell to change use the correct page
Axios.get(url).then(res => {
    const $: JQueryStatic = cheerio.load(res.data);//dont change
    const ArmorOrShield = [];
    let Type: any = 'unarmed';
    let pro: any = '';
    $('#table-6-6-armor-and-shields').children().each(function (i) {//jquery selector #id . is for class
        if ($(this).is('thead')) {
            $(this).children().each(function (k) {
                $(this).children().each(function (j) {
                    if (j == 0) {
                        //pro = $(this).text();
                        //console.log("this is pro" + pro);
                    }

                })
            })

        }
        if ($(this).is('tbody')) {
            $(this).children().each(function (k) {
                let armor: any = {};
                $(this).children().each(function (j) {
                    if (j == 0) {
                        if ($(this).attr('colspan') == '9') {
                            Type = $(this).text();
                        }
                        else {
                            armor.type1 = Type;
                            armor.name = $(this).text();
                            console.log($(this).text());
                        }

                    }
                    else if (j == 1) {
                        if ($(this).text() != '—') {
                            armor.cost = $(this).text();
                        }
                    }
                    else if (j == 2) {
                        if ($(this).text() != '—') {
                            armor.bonus = $(this).text();
                        }
                    }
                    else if (j == 3) {
                        if ($(this).text() != '—') {
                            armor.maxDexBonus = $(this).text();
                        }
                    }
                    else if (j == 4) {
                        if ($(this).text() != '—') {
                            armor.ACP = $(this).text();
                        }
                    }
                    else if (j == 5) {
                        if ($(this).text() != '—') {
                            armor.ArcaneSpellFailure = $(this).text();
                        }
                    }
                    else if (j == 6) {
                        if ($(this).text() != '—') {
                            armor.speed30 = $(this).text();
                        }
                    }
                    else if (j == 7) {
                        if ($(this).text() != '—') {
                            armor.speed20 = $(this).text();
                        }
                    }
                    else if (j == 8) {
                        if ($(this).text() != '—') {
                            armor.weight = $(this).text();
                        }
                    }
                })
                //ArmorOrShield.push(armor);
                if (Object.keys(armor).length > 0) {
                    ArmorOrShield.push(armor);
                }
            })

        }

    });
    /*let query = `match (c:Class {name: 'Sorcerer'})`
    levels.forEach((level, i) => {
        query += `, (c)-->(l${i + 1}:ClassLevel {level: ${i + 1}})`
    });
    query += '\n';
    levels.forEach((level, i) => {
        query += `set l${i + 1}.knownSpells = [${level}]\n`;
    });*/
    writeFileSync("Armor.json", JSON.stringify({ ArmorOrShield }, null, 4))//level is the data 
    //return session.run(query);// do not call till ready 
}).catch(err => {
    console.log(err);
}).then(() => {
    driver.close();
})
