import {Meteor} from 'meteor/meteor';

import {Keys} from '../../keys/keys.js';
//import {Jobs} from '../../jobs/jobs.js';
import {Ajax} from '../../system/server/ajax';

//TODO Пробуем подтянуть работы с каждого ключа и записать в работы.


Meteor.setTimeout(() => {
    for (let key of Keys.find({}).fetch()) {
        try {
            Ajax.getJobs(key.keyID, key.vCode, key.type, key.owner)
                .then(res => {
                    console.log(res);
                })

        } catch (e) {
            console.log(e)
        }
    }
}, 1000);