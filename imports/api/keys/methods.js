import {Meteor} from 'meteor/meteor';

import {Keys} from './keys';

Meteor.methods({
    'keys.add'(keyID, vCode){
        if (!Meteor.isSimulation) {
            Ajax.getKeyInfo(keyID, vCode)
                .then(response => {
                    //TODO Добавление ключа
                })
                .catch(error => {

                })
        }
    }
})