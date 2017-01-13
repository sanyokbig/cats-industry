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
    }
});

Keys.attachSchema(Schemas.Key);