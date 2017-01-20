/**
 * Created by sanyokbig on 20.01.17.
 */
import {Meteor} from 'meteor/meteor'
import {Template} from 'meteor/templating'

import {Jobs} from '../../api/jobs/jobs'

import './accessList.html'
import './accessList.styl'

Template.accessList.helpers({
    'list'(){
        let list = Session.get('accessList');

        return list.join('\n');
    }
});

Template.accessList.events({
    'submit .form'(e){
        e.preventDefault();
        let array = e.target.list.value.trim().split('\n'),
            id = Session.get('accessListJobID');
        Meteor.call('jobs.updateAccessList',id,array);
    },
    'reset .form'(e){
        Session.set('accessListOpen',false);
        Session.set('accessListID',null);
        Session.set('accessList',null);
    },
    'click .modal'(e){
        if(e.target.classList.contains('modal')) {
            Session.set('accessListOpen',false);
        }
    },
})