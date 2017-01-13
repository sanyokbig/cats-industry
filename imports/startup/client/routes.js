/**
 * Created by sanyokbig on 12.01.17.
 */
import {FlowRouter} from 'meteor/kadira:flow-router';
import {BlazeLayout} from 'meteor/kadira:blaze-layout';

import '../../ui/layouts/MainLayout';


FlowRouter.route('/',{
    name: 'main',
    action: ()=>{
        BlazeLayout.render('MainLayout');
    }
});