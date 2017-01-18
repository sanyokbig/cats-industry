import {Meteor} from 'meteor/meteor';

import {Keys} from '../../keys/keys';
import '../../keys/methods';
//import {Jobs} from '../../jobs/jobs.js';
import {Ajax} from '../../system/server/ajax';

//TODO Пробуем подтянуть работы с каждого ключа и записать в работы.

Meteor.setTimeout(() => {
    for (let key of Keys.find({}).fetch()) {
        //TODO Проверять ключ, если все ок, работаем

        // Meteor.call('keys.update', key, (error,result) => {
        //     //console.log(error,result);
        // });
        /*
        try {
            Ajax.getJobs(key.keyID, key.vCode, key.type, key.owner)
                .then(res => {
                    console.log(res.eveapi.result[0].rowset[0].$);
                })
                .catch(err => {
                    console.log(err.eveapi.error[0]._);
                })
        } catch (e) {
            console.log(e)
        }*/
    }
}, 1000);
