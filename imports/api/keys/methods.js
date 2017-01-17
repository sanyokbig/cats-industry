import {Meteor} from 'meteor/meteor';

import {Keys} from './keys';
import {Ajax} from '../system/server/ajax';
import {Bit} from '../system/server/bit';

Meteor.methods({
    'keys.add'(keyID, vCode){
        if (!Meteor.isSimulation) {
            Ajax.getKeyInfo(keyID, vCode)
                .then(response => {
                    response = response.eveapi.result[0].key[0];
                    let keyInfo = response.$,
                        charInfo = response.rowset[0].row[0].$,
                        key = {};
                    //Актуальность маски
                    if (Bit.mask(keyInfo.accessMask, 128)) {
                        key.keyID = +keyID;
                        key.vCode = vCode;
                        key.owner = +charInfo.characterID;
                        if (keyInfo.type === 'Character') {
                            key.type = 'char';
                        } else {
                            key.type = 'corp';
                        }
                        console.log(key);
                        //TODO Проверить правильность добавления ключа
                        Keys.insert(key);
                    }
                })
                .catch(error => {
                    console.log(error.eveapi.error[0]._);
                })
        }
    }
})