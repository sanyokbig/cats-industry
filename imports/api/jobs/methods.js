import {Meteor} from 'meteor/meteor'
import {Jobs} from './jobs'

Meteor.methods({
    'jobs.add'(job){
        try {
            if (Jobs.findOne({jobID: +job.jobID})) {
                console.log('Updated: ' + job.jobID);
                Jobs.update({jobID: job.jobID}, {$set: job});
            } else {
                console.log('Inserted: ' + job.jobID);
                job.accessList=[];
                Jobs.insert(job);
            }
        } catch (e) {
            console.log(e);
        }
    },
    'jobs.addList'(jobs){
        for (let job of jobs) {
            Meteor.call('jobs.add', job);
        }
    },
    'jobs.updateAccessList'(jobID, accessList){
        try {
            Jobs.update({jobID: +jobID}, {
                $set: {
                    accessList
                }
            })
        } catch(e){
            console.log(e);
        }
    }
});