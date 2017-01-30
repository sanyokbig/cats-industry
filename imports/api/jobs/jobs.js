import {Mongo} from 'meteor/mongo';

import SimpleSchema from 'simpl-schema';

export const StatusNames = {
    0: 'Нет',
    1: 'В работе',
    2: 'Приостановлено',
    3: 'Готово',
    101: 'Завершено',
    102: 'Отменено',
    103: 'Реверсировано'
};

export const ActivityNames = {
    0: 'Нет',
    1: 'Производство',
    2: 'Исслед. Тех.',
    3: 'Исслед. ТЕ',
    4: 'Исслед. МЕ',
    5: 'Копирование',
    6: 'Дупликация',
    7: 'Реверс. инж.',
    8: 'Инвент'
};



export const Jobs = new Mongo.Collection('jobs');

const Schemas = Schemas || {};

Schemas.Job = new SimpleSchema({
    jobID: {
        type: String,
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
    runs: {
        type: Number,
        label: 'Runs'
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