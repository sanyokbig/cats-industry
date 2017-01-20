import {Meteor} from 'meteor/meteor';
import {Jobs} from '../jobs';

Meteor.publish('jobs', ()=>{
    //TODO Публикорвать тольок коту и пилотам в аксесс листе
    const cats = ['Alexander Bienveillant','Ansgar Dahl'];
    let finder = {};
    console.log('PUBLISHED');
    return Jobs.find(finder);
});