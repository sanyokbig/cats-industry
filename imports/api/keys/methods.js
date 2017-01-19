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
                        if (Keys.findOne({keyID: key.keyID})) {
                            console.log(key);
                            Keys.update({keyID: key.keyID}, {$set: key});
                        } else {
                            Keys.insert(key);
                        }
                    }
                })
                .catch(error => {
                    console.log(error.eveapi.error[0]._);
                })
        }
    },
    'keys.update'(key){
        //TODO проверить маску, обновить тип ключа, удалить, если ошибка доступа или маска не та
        if (!Meteor.isSimulation) {
            Ajax.getKeyInfo(key.keyID, key.vCode)
                .then(response => {
                    response = response.eveapi.result[0].key[0];
                    let keyInfo = response.$,
                        charInfo = response.rowset[0].row[0].$,
                        newType;
                    //Актуальность маски
                    if (Bit.mask(keyInfo.accessMask, 128)) {
                        if (keyInfo.type === 'Character') {
                            newType = 'char';
                        } else {
                            newType = 'corp';
                        }
                        if (newType !== key.type) {
                            console.log('updating key');
                            console.log(key);
                            Keys.update(key._id, {$set: key});
                        } else {
                            console.log('key is good');
                            return 'gone'
                        }
                    } else {
                        //Маска не подходит, пропускаем
                        console.log('Маска не подходит, пропускаем');
                    }
                })
                .catch(error => {
                    console.log(error.eveapi.error[0]._);
                })
        }

    },
    'keys.remove'(_id){
        try {
            Keys.remove({_id});
            console.log('Key removed');
        } catch (err) {
            console.log(err);
        }
    }
})
