import {Meteor} from 'meteor/meteor';
import {Keys} from '../keys';

Meteor.publish('keys', function(){
    const cats = ['Alexander Bienveillant','Ansgar Dahl'];
    if(this.userId) {
        let username = (Meteor.users.findOne(this.userId).services.eve.character.name);
        if(cats.includes(username)) {
            return Keys.find({},{fields: {keyID:1, ownerName:1, type:1, industrialists: 1}});
        }
        return false;
    }
});