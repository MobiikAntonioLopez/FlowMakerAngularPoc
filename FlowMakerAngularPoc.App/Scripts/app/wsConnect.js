// This file is for simple http requests.
// If present, will be automatically initialized at 
// startup with a call to "setup" function.
// Can be used in conjunction with "database.js".

var wsConnect = new function () {
    var http;
    var rootScope;
    var scope;

    //#region Do not delete or change

    this.setup = function (httpParam, rootScopeParam, scopeParam) {
        http = httpParam;
        rootScope = rootScopeParam;
        scope = scopeParam;
    };
    var lockScreen = function () {
        if (rootScope) {
            rootScope.isLockScreen = true;
        }

    }
    var unLockScreen = function () {
        if (rootScope) {
            rootScope.isLockScreen = false;
        }
    }
    var refresh = function (scope) {
        if (scope && !scope.$$phase) {
            scope.$apply();
        }
    };
    var startSubmit = function (formCtrl) {
        if (formCtrl) {
            formCtrl.submitting = true;
        }
    };
    var endSubmit = function (formCtrl) {
        if (formCtrl) {
            formCtrl.submitting = false;
        }
    };
    var configDoRequest = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    var configDoStatusCode = function (statusCode) {
        if (statusCode === 200) {
        }
    }

    var doPost = function (requestUrl, jsonBody, succesBlock, formCtrl, errorBlock) {

        if (rootScope && http && requestUrl) {
            startSubmit(formCtrl);

            if (jsonBody === undefined || jsonBody === null) {
                jsonBody = {}
            }

            lockScreen();
            http.post(requestUrl, jsonBody, configDoRequest)
                .success(function (data, status, headers, config) {
                    unLockScreen();

                    var errMsg = rootScope.getBoxedMessage('MSG_CONNECT_ERR');
                    endSubmit(formCtrl);
                    if (data && (typeof data === 'object') && status == 200) {
                        errMsg = succesBlock(data, status, headers, config);
                    }

                    if (errMsg) {
                        if (errorBlock) {
                            var overrideMsg = errorBlock(data, status, headers, config);
                            if (overrideMsg) {
                                errMsg = overrideMsg;
                            };
                        };
                    }
                })
                .error(function (data, status, headers, config) {
                    unLockScreen();

                    var errMsg = rootScope.getBoxedMessage('MSG_CONNECT_ERR');
                    if (errorBlock) {
                        errMsg = errorBlock(data, status, headers, config);
                    }
                }
                );
        };
    };

    var doGet = function (requestUrl, jsonBody, succesBlock, formCtrl, errorBlock) {

        if (rootScope && http && requestUrl) {
            startSubmit(formCtrl);

            if (jsonBody === undefined || jsonBody === null) {
                jsonBody = {}
            }

            lockScreen();
            http.get(requestUrl, jsonBody, configDoRequest)
                .success(function (data, status, headers, config) {
                    unLockScreen();

                    var errMsg = rootScope.getBoxedMessage('MSG_CONNECT_ERR');
                    endSubmit(formCtrl);
                    if (data && (typeof data === 'object') && status == 200) {
                        errMsg = succesBlock(data, status, headers, config);
                    }

                    if (errMsg) {
                        if (errorBlock) {
                            var overrideMsg = errorBlock(data, status, headers, config);
                            if (overrideMsg) {
                                errMsg = overrideMsg;
                            };
                        };
                    }
                })
                .error(function (data, status, headers, config) {
                    unLockScreen();

                    var errMsg = rootScope.getBoxedMessage('MSG_CONNECT_ERR');
                    if (errorBlock) {
                        errMsg = errorBlock(data, status, headers, config);
                    }
                }
                );
        };
    };
    var showSucessMessage = function (text) {
        if (rootScope && rootScope.showSucessMessage) {
            rootScope.showSucessMessage(text);
        }
    }
    var showInfoMessage = function (text) {
        if (rootScope && rootScope.showInfoMessage) {
            rootScope.showInfoMessage(text);
        }
    }
    var showWarningMessage = function (text) {
        if (rootScope && rootScope.showWarningMessage) {
            rootScope.showWarningMessage(text);
        }
    }
    var showDangerMessage = function (text) {
        if (rootScope && rootScope.showDangerMessage) {
            rootScope.showDangerMessage(text);
        }
    }
    //#endregion

    //#region Start App

    var getAllProductsButtonSuccesBlock = function (data, status, headers, config) {
        if (data && data.length >= 0) {
            rootScope.db.data.dictionaryProducts = [];
            rootScope.db.data.dictionaryProducts = data;
            showInfoMessage(rootScope.getBoxedMessage('MSG_GET_PRODUCTS_SUCCESS'));
        }
        else {
            getAllProductsButtonErrorBlock(data, status, headers, config);
        }

    }
    var getAllProductsButtonErrorBlock = function (data, status, headers, config) {
        rootScope.db.data.dictionaryProducts = [];
        showDangerMessage(rootScope.getBoxedMessage('MSG_CONNECT_ERR'));
    }
    var getAllProductsButton = function () {
        doGet(
            rootScope.APP_CONST.URL.PRODUCTS,
            null,
            getAllProductsButtonSuccesBlock,
            null,
            getAllProductsButtonSuccesBlock);
    }
    this.getAllProductsButton = function () {
        getAllProductsButton();
    }

    //#endregion

    //#region UserForm
    var saveUserButtonSuccesBlock = function () {
    }

    var saveUserButtonErrorBlock = function () {
    }

    var saveUserButton = function (formCtrl) {
        if (formCtrl && formCtrl.nameInput && formCtrl.lastNameInput) {
            var jsonToSend = {
                Name: nameInput,
                LastName: lastNameInput
            }

            var requestUrl = rootScope.APP_CONST.URL.USER;

            var body = JSON.stringify(jsonToSend);
            doPost(
                requestUrl,
                body,
                saveUserButtonSuccesBlock,
                null,
                saveUserButtonErrorBlock);

        }
    }

    this.saveUserButton = function (formCtrl) {
        saveUserButton(formCtrl);
    }
    //#endregion
};