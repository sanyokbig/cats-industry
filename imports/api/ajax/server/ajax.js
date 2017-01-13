/**
 * Created by sanyokbig on 12.01.17.
 */

import {HTTP} from 'meteor/http';

export const Ajax = {};

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