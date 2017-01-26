import {Meteor} from 'meteor/meteor'
import {Template} from 'meteor/templating'

import {Jobs} from '../../api/jobs/jobs'
import {Keys} from '../../api/keys/keys'

import './header.html';
import './header.styl';

Meteor.subscribe('jobs');
Meteor.subscribe('keys');

Template.header.onCreated(function headerOnCreated() {
    this.state = new ReactiveDict();
});

Template.header.helpers({
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
    },
    'edit'(){
        return Template.instance().state.get('edit');
    },
    'industrialistsList'(){
        let keyID = Template.instance().state.get('edit');
        let inds = Keys.findOne({keyID}).industrialists;
        return inds.join(', ');
    }
});

Template.header.events({
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
        Meteor.call('keys.add', e.target.keyID.value, e.target.vCode.value);
    },
    'click .editIndustrialists'(e, inst){
        inst.state.set('edit', +inst.find('.keys>select').value);
    },
    'click .edit .yes'(e, inst){
        let chars = _.map(inst.find('textarea').value.trim().split(/\n|,/), (char) => {
            return char.trim();
        });
        Meteor.call('keys.updateIndustrialists', inst.state.get('edit'), chars);
        inst.state.set('edit', null);
    },
    'click .edit .no'(e, inst){
        inst.state.set('edit', null);
    }
});