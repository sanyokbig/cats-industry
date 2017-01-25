import {Meteor} from 'meteor/meteor';

import {Keys} from '../../keys/keys';
import {Jobs} from '../../jobs/jobs.js';

import '../../keys/methods';
import '../../jobs/methods';

import {Ajax} from '../../system/server/ajax';

Meteor.setTimeout(() => {
    for (let key of Keys.find({}).fetch()) {
        //Проверять ключ, если все ок, работаем
        try {
            Meteor.call('keys.update', key, (error, response) => {
                if (error) {
                    throw(error);
                }
                Ajax.getJobs(response)
                    .then(jobs => {
                        //Проходим по подтянутым работам и обновляем данные
                        Meteor.call('jobs.addList',jobs);
                    })
                    .catch(err => {
                        console.log(err.eveapi.error[0]._);
                    })

            });
        } catch (e) {
            console.log(e)
        }
    }
}, 1000);
