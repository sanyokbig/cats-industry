import {Meteor} from 'meteor/meteor';
import {Jobs} from '../jobs';

Meteor.publish('jobs', function(){
    //TODO Публикорвать тольок коту и пилотам в аксесс листе
    const cats = ['Alexander Bienveillant','Ansgar Dahl'];
    if(this.userId) {
        let username = (Meteor.users.findOne(this.userId).services.eve.character.name);
        if(cats.includes(username)) {
            return Jobs.find({});
        }
        return Jobs.find({accessList: username});
    }
});