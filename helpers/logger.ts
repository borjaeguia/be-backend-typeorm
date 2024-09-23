import * as log4js from 'log4js';
import { logConf } from '../config';

var logFolder = `${__dirname}/../../logs/server.log`;

var loggerConfiguration = {
    appenders: {
        file: { 
            type: 'file',
            filename: logFolder,
            layout: {
                type: 'pattern',
                pattern: '[%[%5.5p%]] - %m%'
            }
        },
        console: { 
            type: 'console',
            layout: {
                type: 'pattern',
                pattern: '[%[%5.5p%]] - %m%'
            }
        },
    },
    categories: {
        default: { 
            appenders: ['console','file'], 
            level: logConf.level
        }
    }
};

log4js.configure(loggerConfiguration);

export default log4js;