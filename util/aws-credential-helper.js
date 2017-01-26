'use strict';

var AWS = require('aws-sdk');

var credentialHelper = {};

function getMetadataCredentialProvider() {
    return function () {
        if (process.env.AWS_CONTAINER_CREDENTIALS_RELATIVE_URI) {
            return new AWS.ECSCredentials();
        } else {
            return new AWS.EC2MetadataCredentials();
        }
    };
}

function getIniCredentialProvider(options) {
    var params = options || {};

    if (process.env.AWS_SHARED_CREDENTIALS_FILE) {
        params.filename = process.env.AWS_SHARED_CREDENTIALS_FILE;
    }

    return function () {
        return new AWS.SharedIniFileCredentials(params);
    };
}

credentialHelper.getCredentials = function (options) {
    var providers = [
//        function () { return new AWS.EnvironmentCredentials('AWS'); },
        function () { return new AWS.EnvironmentCredentials('AMAZON'); },
    ];

    if (options.profile !== null) {
        providers.push(getIniCredentialProvider({profile: options.profile}));
    }

    providers.push(getIniCredentialProvider());
    providers.push(getMetadataCredentialProvider());

    var chain = new AWS.CredentialProviderChain(providers);

    var credentials = {};

    chain.resolve(function (err, data) {
        if (!err) {
            credentials = data;
        }
    });

    return credentials;
};

module.exports = credentialHelper;
