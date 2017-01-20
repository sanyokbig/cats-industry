import {Meteor} from 'meteor/meteor'
import {Template} from 'meteor/templating'

import {Jobs} from '../../api/jobs/jobs'

import './main.html';
import '../components/grid.js';

Meteor.subscribe('jobs');

Template.main.helpers({
    'isCat'(){
        return Meteor.user().profile.name === 'Alexander Bienveillant'
    },
    'completed'(){
        return 2;
    },
    'total'(){
        return 5;
    },
    'settings'(){
        return {
            collection: Jobs,
            fields: ['owner']
        }
    }
});

Template.main.events({
    'click .login'(){
        Meteor.loginWithEve({
            requestPermissions: ['publicData']
        }, (err) => {
            if (err) {
                console.log(err);
            }
        });
    },
    'click .logout'(){
        Meteor.logout();
    },
    'submit .add'(e){
        e.preventDefault();
        Meteor.call('keys.add',e.target.keyID.value,e.target.vCode.value);
    }
});