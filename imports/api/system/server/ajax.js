/**
 * Created by sanyokbig on 12.01.17.
 */

import {HTTP} from 'meteor/http';

export const Ajax = {};

Ajax.getKeyInfo = (keyID, vCode)=>{
    return new Promise((resolve,reject)=>{
        HTTP.get('https://api.eveonline.com/account/APIKeyInfo.xml.aspx', {
            params: {keyID,vCode}
        },(err,res)=>{
            if(err) {
                let parsed = xml2js.parseStringSync(err.response.content);
                reject(parsed)
            } else {
                let parsed = xml2js.parseStringSync(res.content);
                resolve(parsed);
            }
        });
    });
};

Ajax.getJobs = function(keyID,vCode,type,charID){
    return new Promise((resolve, reject)=>{
        let params = {
            keyID,
            vCode
        };
        charID||(params.charID=charID);
        try {
            HTTP.call('get', 'https://api.eveonline.com/' + type + '/IndustryJobs.xml.aspx', {
                    params
                }, (err, res) => {
                    if (err) {
                        throw new Error(err);
                    } else {
                        let xml = xml2js.parseStringSync(res);
                        resolve(xml);
                    }
                }
            );
        } catch (e){
            console.log('getJobs.error');
            console.log(e);
            reject(e);
        }
    });
};