import {Meteor} from 'meteor/meteor'
import {Template} from 'meteor/templating'
import {Jobs} from '../../api/jobs/jobs'
import './grid.html'
import './grid.styl'

Meteor.subscribe('jobs');

Template.grid.helpers({
    'jobs'(){
        return Jobs.find({})
    }
})