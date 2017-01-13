import {Meteor} from 'meteor/meteor'
import {Template} from 'meteor/templating'

import './main.html';

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
    }
});