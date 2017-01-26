import {Meteor} from 'meteor/meteor'
import {Template} from 'meteor/templating'

import {Jobs} from '../../api/jobs/jobs'
import {Keys} from '../../api/keys/keys'

import './main.html';
import './main.styl';
import '../components/grid.js';

Meteor.subscribe('jobs');
Meteor.subscribe('keys');

Template.main.helpers({
    'keys'(){
        return Keys.find({});
    },
    'isCat'(){
        return Meteor.user().profile.name === 'Alexander Bienveillant'
    },
    'isCorpKey'(){

    },
    'settings'(){
        return {
            collection: Jobs,
            fields: ['owner']
        }
    },
    'total'(){
        return Jobs.find({}).count()
    },
    'active'(){
        return Jobs.find({status: 1}).count()
    },
    'ready'(){
        return Jobs.find({status: 3}).count()
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
        console.log('adding key');
        Meteor.call('keys.add',e.target.keyID.value,e.target.vCode.value);
    }
});