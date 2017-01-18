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
        //TODO Корректно возвращать промис
        //return new Promise((res,rej)=>{});
        return new Promise((resolve,reject)=>{
            Ajax.getKeyInfo(key.keyID, key.vCode)
                .then(response => {
                    response = response.eveapi.result[0].key[0];
                    let keyInfo = response.$;
                    //Актуальность маски
                    if (Bit.mask(keyInfo.accessMask, 128)) {
                        if (keyInfo.type === 'Character') {
                            key.type = 'char';
                        } else {
                            key.type = 'corp';
                        }
                        Keys.update({keyID: key.keyID}, {$set: key});
                        resolve(123);
                    } else {
                        Meteor.call('keys.remove', key._id);
                        resolve(0);
                    }
                })
                .catch(error => {
                    console.log(error.eveapi.error[0]._ + '. Key ' +key.keyID+ 'will be deleted');
                    Meteor.call('keys.remove', key._id);
                    resolve(0);
                })
        });

    },
    'keys.remove'(_id){
        try {
            Keys.remove({_id});
            console.log('Key removed');
        } catch (err){
            console.log(err);
        }
    }
})
