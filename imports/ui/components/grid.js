import {Meteor} from 'meteor/meteor'
import {Template} from 'meteor/templating'
import {Jobs, StatusNames, ActivityNames} from '../../api/jobs/jobs'

import './grid.html'
import './grid.styl'
import './accessList.js'

Meteor.subscribe('jobs');

Template.grid.helpers({
    'jobs'(){
        let filter = {},
            sorter = {};
        let curKey = Session.get('sorter_key');
        if(curKey) {
            let curDir = Session.get('sorter_dir');
            sorter = {[curKey]: curDir};
        }
        filter.productTypeName = new RegExp(Session.get('grid_search'),'i');
        return Jobs.find(filter,{sort: sorter});
    },
    'date'(date){
        return moment(date).format('DD-MM-YY HH:mm:ss');
    },
    'accessListOpen'(){
        return Session.get('accessListOpen')
    },
    'statusName'(status){
        return StatusNames[status]
    },
    'activityName'(activityID){
        return ActivityNames[activityID]
    },
    'left'(date){
        return moment.duration(moment(date)-moment(TimeSync.serverTime(null,1000))).format();
    }
});

Template.grid.events({
    'click .access-list'(){
        Session.set('accessListOpen',true);
        Session.set('accessListJobID',this.jobID);
        Session.set('accessList',this.accessList);
    },
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
    'input .filter>input'(e){
        Session.set('grid_search', e.target.value);
    }
})
