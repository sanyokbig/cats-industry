import {Meteor} from 'meteor/meteor';

import {Keys} from '../../keys/keys';
import {Jobs} from '../../jobs/jobs.js';

import '../../keys/methods';
import '../../jobs/methods';

import {Ajax} from '../../system/server/ajax';

Meteor.methods({
    'update.jobs'(){
        for (let key of Keys.find({}).fetch()) {
            //Проверять ключ, если все ок, работаем

            Meteor.call('keys.update', key, (error, response) => {
                try {
                    if (error) {
                        throw(error);
                    }
                    Ajax.getJobs(response)
                        .then(jobs => {
                            if(jobs.length) {
                                console.log('Got ' + jobs.length + ' jobs after filtering');
                                //Проходим по подтянутым работам и обновляем данные
                                Meteor.call('jobs.addList', jobs);
                            } else {
                                console.log('Nothing to add');
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        })
                } catch (e) {
                    console.log(e)
                }

            });

        }
    },
    'update.jobsHistory'(){
        for (let key of Keys.find({}).fetch()) {
            //Проверять ключ, если все ок, работаем

            Meteor.call('keys.update', key, (error, response) => {
                try {
                    if (error) {
                        throw(error);
                    }
                    Ajax.getJobsHistory(response)
                        .then(jobs => {
                            console.log('Got ' + jobs.length + ' history jobs after filtering');
                            //Проходим по подтянутым работам и обновляем данные
                            Meteor.call('jobs.addList', jobs);
                        })
                        .catch(err => {
                            console.log(err.eveapi.error[0]._);
                        })
                } catch (e) {
                    console.log(e)
                }
            });

        }
    },
    'update.statuses'(){
        let i = 0;
        for (let job of Jobs.find({status: 1}).fetch()) {
            let diff = moment() - moment(job.endDate);
            if (diff > 0) {
                Jobs.update({_id: job._id}, {$set: {status: 3}});
                i++
            }
        }
        if (i) {
            console.log('Corrected ' + i + ' jobs');
        }
    }
});

Meteor.call('update.jobs');
Meteor.call('update.jobsHistory');

Meteor.setInterval(() => {
    //Обновление статусов каждый три минуты, ибо у ццп все как обычно - готовые, но не принятые работы не меняют статус на Готово
    Meteor.call('update.statuses');
}, 3 * 60 * 1000);

Meteor.setInterval(() => {
    //Тянуть активные работы каждые 15 минут
    Meteor.call('update.jobs');
}, 15 * 60 * 1000);

Meteor.setInterval(() => {
    //Тянуть историю работ каждый 6 часов
    Meteor.call('update.jobsHistory');
}, 6 * 60 * 60 * 1000);
