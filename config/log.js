/**
 * Built-in Log Configuration
 * (sails.config.log)
 *
 * Configure the log level for your app, as well as the transport
 * (Underneath the covers, Sails uses Winston for logging, which
 * allows for some pretty neat custom transports/adapters for log messages)
 *
 * For more information on the Sails logger, check out:
 * https://sailsjs.com/docs/concepts/logging
 */

let appName = 'SAILS_DEMO';

function getEnv(name, def){
    let envName = `${appName}_${name}`;
    let ret = process.env[envName];
    if(!ret){
        return def;
    }
    return ret;
}

let env = process.env.NODE_ENV || 'production';
let levelDic = {development: 'debug', production: 'info', test: 'debug'};
let lv = levelDic[env];
if(!lv){
    lv = 'production';
}

let winston = require('winston');
let customLogger = new winston.Logger({
    transports: [
        new (winston.transports.Console)({
            level: 'debug', // or verbose
            colorize: true
        }),
        new (winston.transports.File)({
            level: lv,
            filename: getEnv('LOG_PATH', '/data/logs') + `/${appName.toLowerCase()}.${lv}.log`,
            json: false,
            maxsize: 1024000000,		// 10G max size
            maxFiles: 3,			// 3 log files max
            tailable: true,
            timestamp: function() {
                var d = (new Date()+'').split(' ');
                return [d[3], d[1], d[2], d[4]].join(' ');
            } // timestamp()
        })
    ]
});


module.exports.log = {

  /***************************************************************************
  *                                                                          *
  * Valid `level` configs: i.e. the minimum log level to capture with        *
  * sails.log.*()                                                            *
  *                                                                          *
  * The order of precedence for log levels from lowest to highest is:        *
  * silly, verbose, info, debug, warn, error                                 *
  *                                                                          *
  * You may also set the level to "silent" to suppress all logs.             *
  *                                                                          *
  ***************************************************************************/

  // level: 'info'
//	level: 'silly',
	level: lv,

	colors: false,  // To get clean logs without prefixes or color codings
	custom: customLogger
};
