import {Meteor} from 'meteor/meteor';
import {Jobs} from '../jobs';

Meteor.publish('jobs', function(){
    const cats = ['Alexander Bienveillant','Grieder'];
    if(this.userId) {
        let username = (Meteor.users.findOne(this.userId).services.eve.character.name);
        if(cats.includes(username)) {
            return Jobs.find({});
        }
        return Jobs.find({accessList: username});
    }
});