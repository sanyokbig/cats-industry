import {Meteor} from 'meteor/meteor'
import {Jobs} from './jobs'

Meteor.methods({
    'jobs.add'(job){
        if ((+job.status === 1) && (moment() - moment(job.endDate) > 0)) {
            job.status = 3;
        }
        try {
            if (Jobs.findOne({jobID: job.jobID})) {
                Jobs.update({jobID: job.jobID}, {$set: job});
            } else {
                job.accessList=[];
                Jobs.insert(job);
            }
        } catch (e) {
            throw(e)
        }
    },
    'jobs.addList'(jobs){
        console.log('Trying to add ' + jobs.length + ' jobs');
        let success=error=0;
        for (let job of jobs) {
            try {
                Meteor.call('jobs.add', job);
                success++;
            } catch (e){
                console.log(e);
                errors++;
            }
        }
        console.log('Added: '+success+', Failed: '+error);
    },
    'jobs.updateAccessList'(jobID, accessList){
        try {
            Jobs.update({jobID: jobID}, {
                $set: {
                    accessList
                }
            })
        } catch(e){
            console.log(e);
        }
    }
});