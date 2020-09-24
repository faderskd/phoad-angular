import {NativeScriptConfig} from '@nativescript/core';

export default {
    id: 'org.nativescript.phoadangular',
    appResourcesPath: 'App_Resources',
    appPath: 'src',
    android: {
        v8Flags: '--expose_gc',
        markingMode: 'none'
    }
} as NativeScriptConfig;
