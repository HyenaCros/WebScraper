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
    const Item = [];
    let Type: any = 'unarmed';
    let pro: any = '';
    $('#table-6-9-goods-and-services').children().each(function (i) {//jquery selector #id . is for class
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
                let item: any = {};
                $(this).children().each(function (j) {
                    if (j == 0) {
                        if ($(this).attr('colspan') == '9') {
                            Type = $(this).text();
                        }
                        else {
                            item.name = $(this).text();
                            console.log($(this).text());
                        }

                    }
                    else if (j == 1) {
                        if ($(this).text() != '—') {
                            item.cost = $(this).text();
                        }
                    }
                    else if (j == 2) {
                        if ($(this).text() != '—') {
                            item.weight = $(this).text();
                        }
                    }
                    else if (j == 3) {
                        if ($(this).text() != '—') {
                            item.maxDexBonus = $(this).text();
                        }
                    }
                    else if (j == 4) {
                        if ($(this).text() != '—') {
                            item.ACP = $(this).text();
                        }
                    }
                    else if (j == 5) {
                        if ($(this).text() != '—') {
                            item.ArcaneSpellFailure = $(this).text();
                        }
                    }
                    else if (j == 6) {
                        if ($(this).text() != '—') {
                            item.speed30 = $(this).text();
                        }
                    }
                    else if (j == 7) {
                        if ($(this).text() != '—') {
                            item.speed20 = $(this).text();
                        }
                    }
                    else if (j == 8) {
                        if ($(this).text() != '—') {
                            item.weight = $(this).text();
                        }
                    }
                })
                //Item.push(item);
                if (Object.keys(item).length > 0) {
                    Item.push(item);
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
    writeFileSync("Items.json", JSON.stringify({ Item }, null, 4))//level is the data 
    //return session.run(query);// do not call till ready 
}).catch(err => {
    console.log(err);
}).then(() => {
    driver.close();
})
