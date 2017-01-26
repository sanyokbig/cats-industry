import {Mongo} from 'meteor/mongo';

import SimpleSchema from 'simpl-schema';

export const Keys = new Mongo.Collection('keys');

const Schemas = Schemas || {};

Schemas.Key = new SimpleSchema({
    keyID: {
        type: Number,
        label: 'Key ID'
    },
    vCode: {
        type: String,
        label: 'Verification Code'
    },
    type: {
        type: String,
        label: 'Key type'
    },
    owner: {
        type: Number,
        label: 'Owner ID'
    },
    ownerName: {
        type: String,
        label: 'Owner Name'
    },
    industrialists: {
        type: Array,
        label: 'Industrialists'
    },
    'industrialists.$':{
        type: String
    }
});

Keys.attachSchema(Schemas.Key);
