import {Mongo} from 'meteor/mongo';

import SimpleSchema from 'simpl-schema';

export const StatusNames = {
    1: 'В процессе',
    2: 'Приостановлено',
    3: 'Готово',
    101: 'Доставлено',
    102: 'Отменено',
    103: 'Reverted'
}

export const Jobs = new Mongo.Collection('jobs');

const Schemas = Schemas || {};

Schemas.Job = new SimpleSchema({
    jobID: {
        type: Number,
        label: 'Job ID'
    },
    installerName: {
        type: String,
        label: 'Installer Name'
    },
    activityID: {
        type: Number,
        label: 'Activity ID'
    },
    productTypeName: {
        type: String,
        label: 'Installer Name'
    },
    status: {
        type: Number,
        label: 'Status'
    },
    startDate: {
        type: Date,
        label: 'Start Date'
    },
    endDate: {
        type: Date,
        label: 'End date'
    },
    completedDate: {
        type: Date,
        label: 'Completed Date'
    },
    accessList: {
        type: Array,
        label: 'Access List'
    },
    'accessList.$':{
        type: String
    }
});

Jobs.attachSchema(Schemas.Job);