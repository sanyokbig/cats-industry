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
    this.state.set('key',{});
});

Template.header.helpers({
    'keys'(){
        return Keys.find({});
    },
    'isCat'(){
        return Meteor.user().profile.name === 'Alexander Bienveillant'
    },
    'editDisabled'(){
        let key = Template.instance().state.get('key');
        return (key.type !== 'corp');
    },
    'edit'(){
        let inst = Template.instance();
        return (inst.state.get('edit') && inst.state.get('key').type === 'corp');
    },
    'industrialistsList'(){
        //let keyID = Template.instance().state.get('edit');
        //let inds = Keys.findOne({keyID}).industrialists;
        let inds = Template.instance().state.get('key').industrialists;
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
    },
    'click .update'(){
        Meteor.call('update.jobs');
    },
    'change .keys>select'(e, inst){
        inst.state.set('key', Keys.findOne({keyID: +e.target.value}));
    }
});