import {Meteor} from 'meteor/meteor'
import {Template} from 'meteor/templating'

import {Jobs, ActivityNames} from '../../api/jobs/jobs'

import './grid.html'
import './grid.styl'

import './job.js';

Meteor.subscribe('jobs');

Template.grid.helpers({
    'jobs'(){
        let filter = {},
            sorter = {endDate: 1};
        let curKey = Session.get('sorter_key');
        if(curKey) {
            let curDir = Session.get('sorter_dir');
            sorter = {[curKey]: curDir};
        }

        filter.productTypeName = new RegExp(Session.get('product_search'),'i');
        filter.installerName = new RegExp(Session.get('installer_search'),'i');

        let activity_search = Session.get('activity_search');
        if(activity_search && activity_search !== '-1') {
            console.log(activity_search);
            filter.activityID = +activity_search;
        }
        return Jobs.find(filter,{sort: sorter});
    },
    'date'(date){
        return moment(date).format('DD-MM-YY HH:mm:ss');
    },
    'activityNames'(){
        let result = [];
        for (let key in ActivityNames)  {
            result.push({key,value:ActivityNames[key]});
        }
        return result;
    }
});

Template.grid.events({
    'click .head .cell'(e){
        let tgtKey = e.target.dataset.sortKey;
        let curKey = Session.get('sorter_key');
        if (curKey) {
            //Ключ существует, сравниваем с текущим
            if (curKey === tgtKey) {
                //Инвертируем сортировку
                let curDir = Session.get('sorter_dir');
                Session.set('sorter_dir', -curDir);
            } else {
                //Сортируем с новым ключом
                Session.set('sorter_key', tgtKey);
                Session.set('sorter_dir', 1);
            }
        } else {
            Session.set('sorter_key', tgtKey);
            Session.set('sorter_dir', 1);
        }
    },
    'input .filter.product>input'(e){
        Session.set('product_search', e.target.value);
    },
    'input .filter.installer>input'(e){
        Session.set('installer_search', e.target.value);
    },
    'change .filter.activity'(e){
        Session.set('activity_search', e.target.value);
    }
})
