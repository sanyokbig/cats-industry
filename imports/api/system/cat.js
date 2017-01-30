import {Meteor} from 'meteor/meteor';

export const Cats = ['Alexander Bienveillant', 'Grieder'];

Meteor.methods({
    'iscat'(){
        let user = Meteor.user();
        return user && Cats.includes(user.profile.name)
    }
})