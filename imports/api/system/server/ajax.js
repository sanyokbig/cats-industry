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
                timeout: 30000
            }, (err, res) => {
                if (err) {
                    reject(err);
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
                    timeout: 30000
                }, (err, res) => {
                    if (err) {
                        throw(err);
                    } else {
                        xml2js.parseString(res.content, (err, res) => {
                            let jobs = res.eveapi.result[0].rowset[0].row || [],
                                result = [];

                            console.log('Got ' + jobs.length + ' jobs');
                            if (jobs) {
                                for (let job of jobs) {
                                    if (!key.industrialists.length || (key.industrialists.indexOf(job.$.installerName) !== -1)) {
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

Ajax.getJobsHistory = function (key) {
    return new Promise((resolve, reject) => {
        let params = {
            keyID: key.keyID,
            vCode: key.vCode,
            charID: key.charID
        };
        try {
            HTTP.call('get', 'https://api.eveonline.com/' + key.type + '/IndustryJobsHistory.xml.aspx', {
                    params,
                    timeout: 60000
                }, (err, res) => {
                    if (err) {
                        throw(err);
                    } else {
                        xml2js.parseString(res.content, (err, res) => {
                            let jobs = res.eveapi.result[0].rowset[0].row || [],
                                result = [];
                            console.log('Got ' + jobs.length + ' history jobs');
                            if (jobs) {
                                for (let job of jobs) {
                                    if (!key.industrialists.length || (key.industrialists.indexOf(job.$.installerName) !== -1)) {
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
            console.log('getJobsHistory.error');
            console.log(e);
            reject(e);
        }
    });
};