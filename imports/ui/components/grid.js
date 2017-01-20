import {Meteor} from 'meteor/meteor'
import {Template} from 'meteor/templating'
import {Jobs} from '../../api/jobs/jobs'

import './grid.html'
import './grid.styl'
import './accessList.js'



Meteor.subscribe('jobs');

Template.grid.helpers({
    'jobs'(){
        return Jobs.find({})
    },
    'date'(date){
        return moment(date).format('DD-MM-YY HH:mm:ss');
    },
    'accessListOpen'(){
        return Session.get('accessListOpen')
    }
})

Template.grid.events({
    'click .access'(){
        console.log(this)
        Session.set('accessListOpen',true);
        Session.set('accessListJobID',this.jobID);
        Session.set('accessList',this.accessList);
    }
})