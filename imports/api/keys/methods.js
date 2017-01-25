import {Meteor} from 'meteor/meteor';

import {Keys} from './keys';
import {Ajax} from '../system/server/ajax';
import {Bit} from '../system/server/bit';
let Future = Npm.require('fibers/future');
Meteor.methods({
    'keys.add'(keyID, vCode){
        let future = new Future();
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
                    //TODO Реализовать ввод списка юзеров в корп ключ
                    //TODO Переименовать users во что-то более понятное
                    key.users = [];
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
                    future.return(key.type);
                }
                future.return('gh');
            })
            .catch(error => {
                console.log(error.eveapi.error[0]._);
            })
        return future.wait();
    },
    'keys.update'(key){
        let future = new Future();
        console.log('Updating ' + key.keyID);
        Ajax.getKeyInfo(key.keyID, key.vCode)
            .then(response => {
                response = response.eveapi.result[0].key[0];
                console.log('Success');
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
                        console.log(key.type + ' => ' + newType);
                        key.type = newType;
                        try {
                            Keys.update(key._id, {$set: key});
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    future.return(key);
                } else {
                    //Маска не подходит, пропускаем
                    future.throw('Wrong mask: ' + keyInfo.accessMask);
                }
            })
            .catch(error => {
                future.throw(error.eveapi.error[0]._);
            });

        return future.wait();
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
