import {Meteor} from 'meteor/meteor'
import {Template} from 'meteor/templating'

import {Jobs} from '../../api/jobs/jobs'
import {Keys} from '../../api/keys/keys'

import {Cats} from '../../api/system/cat'
import {feedback} from '../../api/system/feedback'

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
    },
    'iscat'(){
        let user = Meteor.user();
        return user && Cats.includes(user.profile.name)
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
        Meteor.call('keys.add', e.target.keyID.value, e.target.vCode.value, (err, res)=>{
            if(err) {
                feedback('Ошибка!',3000)
            } else {
                feedback(res,3000)
            }
        });
    },
    'click .editIndustrialists'(e, inst){
        inst.state.set('edit', +inst.find('.keys>select').value);
    },
    'click .edit .yes'(e, inst){
        let chars = _.map(inst.find('textarea').value.trim().split(/\n|,/), (char) => {
            return char.trim();
        });
        Meteor.call('keys.updateIndustrialists', inst.state.get('edit'), chars,(err,res)=>{
            if(err) {
                feedback('Ошибка',3000)
            } else {
                feedback('Производственники успешно обновлены!',3000)
            }
        });
        inst.state.set('edit', null);
    },
    'click .edit .no'(e, inst){
        inst.state.set('edit', null);
    },
    'click .delete'(){
        feedback('Here it is!', 3000);
    },
    'click .update'(){
        Meteor.call('update.jobs',(err,res)=>{
            if(err) {
                feedback(err,3000)
            } else {
                feedback(res,3000)
            }
        });
    },
    'change .keys>select'(e, inst){
        inst.state.set('key', Keys.findOne({keyID: +e.target.value}));
    }
});
