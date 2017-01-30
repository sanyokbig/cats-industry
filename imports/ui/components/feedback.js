import {Meteor} from 'meteor/meteor'
import {Template} from 'meteor/templating'

import './feedback.html'
import './feedback.styl'

Template.feedback.onCreated(() => {
    Session.set('feedback_show', false);
    Session.set('feedback_msg', '');
})

Template.feedback.helpers({
    'show'(){
        return Session.get('feedback_show');
    },
    'msg'(){
        return Session.get('feedback_msg');
    }
});

Template.feedback.events({
    'click .feedback'(){

    }
});

