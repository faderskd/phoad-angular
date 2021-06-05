import {NativeScriptConfig} from '@nativescript/core';

export default {
    id: 'phoad.phoad',
    appResourcesPath: 'App_Resources',
    appPath: 'src',
    android: {
        v8Flags: '--expose_gc',
        markingMode: 'none'
    }
} as NativeScriptConfig;
