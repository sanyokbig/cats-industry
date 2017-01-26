import {Meteor} from 'meteor/meteor';
import {Keys} from '../keys';

Meteor.publish('keys', function(){
    //TODO Публикорвать тольок коту и пилотам в аксесс листе
    const cats = ['Alexander Bienveillant','Ansgar Dahl'];
    if(this.userId) {
        let username = (Meteor.users.findOne(this.userId).services.eve.character.name);
        if(cats.includes(username)) {
            return Keys.find({});
        }
        return false;
    }
});