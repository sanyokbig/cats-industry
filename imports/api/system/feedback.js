import {Meteor} from 'meteor/meteor';

export function feedback(msg, time = 5000) {
    Meteor.clearTimeout(Session.get('feedback_timeout'));
    Session.set('feedback_show', true);
    Session.set('feedback_msg', msg);
    let timeout = setTimeout(() => {
        Session.set('feedback_show', false);
        Session.set('feedback_msg', null);
        Session.set('feedback_timeout', null);
    }, time);
    Session.set('feedback_timeout', timeout);
}