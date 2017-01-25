/**
 * Created by sanyokbig on 12.01.17.
 */

import {HTTP} from 'meteor/http';

export const Ajax = {};

Ajax.getKeyInfo = (keyID, vCode)=>{
    return new Promise((resolve,reject)=>{
        try{
            HTTP.get('https://api.eveonline.com/account/APIKeyInfo.xml.aspx', {
                params: {keyID,vCode},
                timeout: 5000
            },(err,res)=>{
                if(err) {
                    let parsed = xml2js.parseStringSync(err.response.content);
                    reject(parsed)
                } else {
                    let parsed = xml2js.parseStringSync(res.content);
                    resolve(parsed);
                }
            });
        } catch (e){
            console.log('getKeyInfo.error');
            console.log(e);
            reject(e);
        }
    });
};

Ajax.getJobs = function(keyID,vCode,type,charID){
    //TODO Так же тянуть активные работы (IndustryJobs), добавлять и те, и другие
    return new Promise((resolve, reject)=>{
        let params = {
            keyID,
            vCode
        };
        charID||(params.charID=charID);
        try {
            HTTP.call('get', 'https://api.eveonline.com/' + type + '/IndustryJobs.xml.aspx', {
                    params,
                    timeout: 10000
                },(err, res) => {
                    if (err) {
                        let parsed = xml2js.parseStringSync(err.response.content);
                        reject(parsed)
                    } else {
                        xml2js.parseString(res.content,(err,res)=>{
                            resolve(res);
                        });
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
