import {Meteor} from 'meteor/meteor'
import {Template} from 'meteor/templating'

import {Jobs, ActivityNames, StatusNames} from '../../api/jobs/jobs'

import './grid.html'
import './grid.styl'

import './job.js';

Meteor.subscribe('jobs');

Template.grid.onCreated(function gridOnCreated() {
    Session.set('search_query', null);
    Session.set('search_activity', null);
    Session.set('search_status', null);
    Session.set('grid_limit', 100);
});

Template.grid.helpers({
    'jobs'(){
        let filter = {},
            sorter = {endDate: 1};
        let curKey = Session.get('sorter_key');
        if (curKey) {
            let curDir = Session.get('sorter_dir');
            sorter = {[curKey]: curDir, endDate: curDir};
        }

        let query = Session.get('search_query');
        if (query) {
            query = RegExp(query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&'), 'i');
            filter = {
                $or: [
                    {jobIDName: query},
                    {productTypeName: query},
                    {installerName: query}
                ]
            };
        }

        let search_activity = Session.get('search_activity');
        if (search_activity && search_activity !== '-1') {
            console.log(search_activity);
            filter.activityID = +search_activity;
        }

        let search_status = Session.get('search_status');
        if (search_status && search_status !== '-1') {
            filter.status = +search_status;
        }
        return Jobs.find(filter, {sort: sorter, limit: Session.get('grid_limit')});
    },
    'date'(date){
        return moment(date).format('DD-MM-YY HH:mm:ss');
    },
    'activityNames'(){
        let result = [];
        for (let key in ActivityNames) {
            result.push({key, value: ActivityNames[key]});
        }
        return result;
    },
    'statusNames'(){
        let result = [];
        for (let key in StatusNames) {
            result.push({key, value: StatusNames[key]});
        }
        return result;
    },
    'active'(){
        return Jobs.find({status: 1}).count()
    },
    'ready'(){
        return Jobs.find({status: 3}).count()
    },
    'canLoadMore'(){
        return Session.get('grid_limit')<Template.instance().find('.body').childNodes().count();
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
    'input .filter.search'(e){
        Session.set('search_query', e.target.value);
    },
    'change .filter.activity'(e){
        Session.set('search_activity', e.target.value);
    },
    'change .filter.status'(e){
        Session.set('search_status', e.target.value);
    },
    'click .more'(){
        Session.set('grid_limit', Session.get('grid_limit')+100);
    }
})
