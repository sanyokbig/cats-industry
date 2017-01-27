import {Template} from 'meteor/templating'
import {ReactiveDict} from 'meteor/reactive-dict'
import {StatusNames, ActivityNames} from '../../api/jobs/jobs'

import './job.html'



Template.job.onCreated(function jobOnCreated() {
    this.state = new ReactiveDict();
});

Template.job.helpers({
    'date'(date){
        return moment(date).format('DD-MM-YY HH:mm:ss');
    },
    'statusName'(status){
        return StatusNames[+status]
    },
    'activityName'(activityID){
        return ActivityNames[+activityID]
    },
    'edit'(){
        return Template.instance().state.get('edit');
    },
    'left'(date){
        let diff = moment(TimeSync.serverTime(null, 1000)) - moment(date);
        if (diff > 0) {
            return
        }
        return moment.duration(diff).format();
    }
});

Template.job.events({
    'click .access-list'(e, inst){
        inst.state.set('edit', true);
    },
    'keypress .access-list input'(e, inst){
        if (e.which === 13) {
            let chars = _.map(e.target.value.trim().split(','), (char) => {
                return char.trim();
            });
            Meteor.call(
                'jobs.updateAccessList',
                inst.data.jobID,
                chars
            );
            inst.state.set('edit', false);
        }
    }
})
