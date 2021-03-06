import {Meteor} from 'meteor/meteor';

import {Keys} from './keys';
import {Ajax} from '../system/server/ajax';
import {Bit} from '../system/server/bit';
let Future = Npm.require('fibers/future');
Meteor.methods({
    'keys.add'(keyID, vCode){
        if(!Meteor.call('iscat')) throw('login');
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
                    key.ownerName = charInfo.characterName;
                    key.industrialists = [];
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
                future.return();
            })
            .catch(error => {
                future.return('Ошибка. Ключ не добавлен');
            });
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
                    future.return('Wrong mask: ' + keyInfo.accessMask);
                }
            })
            .catch(error => {
                future.return('Ошибка. Ключ не обновлен');
            });

        return future.wait();
    },
    'keys.updateIndustrialists'(keyID, industrialists){
        try {
            Keys.update({keyID: +keyID}, {
                $set: {
                    industrialists
                }
            })
            return true
        } catch(e){
            console.log(e);
            return 'Error'
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
});