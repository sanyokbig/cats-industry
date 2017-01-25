/**
 * Created by sanyokbig on 12.01.17.
 */

import {HTTP} from 'meteor/http';
let Future = Npm.require('fibers/future');

export const Ajax = {};

Ajax.getKeyInfo = (keyID, vCode) => {
    return new Promise((resolve, reject) => {
        try {
            HTTP.get('https://api.eveonline.com/account/APIKeyInfo.xml.aspx', {
                params: {keyID, vCode},
                timeout: 5000
            }, (err, res) => {
                if (err) {
                    //let parsed = xml2js.parseStringSync(err.response.content);
                    reject(err)
                } else {
                    let parsed = xml2js.parseStringSync(res.content);
                    resolve(parsed);
                }
            });
        } catch (e) {
            console.log('getKeyInfo.error');
            console.log(e);
            reject(e);
        }
    });
};


Ajax.getJobs = function (key) {
    return new Promise((resolve, reject) => {
        let params = {
            keyID: key.keyID,
            vCode: key.vCode,
            charID: key.charID
        };
        try {
            HTTP.call('get', 'https://api.eveonline.com/' + key.type + '/IndustryJobs.xml.aspx', {
                    params,
                    timeout: 10000
                }, (err, res) => {
                    if (err) {
                        //let parsed = xml2js.parseStringSync(err.response.content);
                        reject(err)
                    } else {
                        xml2js.parseString(res.content, (err, res) => {
                            let jobs = res.eveapi.result[0].rowset[0].row,
                                result = [];
                            if (jobs) {
                                for (let job of jobs) {
                                    if(!key.users.length || (job.installerName in key.users)) {
                                        result.push(job.$);
                                    }
                                }
                            }
                            resolve(result);
                        });
                    }
                }
            );
        } catch (e) {
            console.log('getJobs.error');
            console.log(e);
            reject(e);
        }
    });
};