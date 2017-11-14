// This file is for simple http requests.
// If present, will be automatically initialized at 
// startup with a call to "setup" function.
// Can be used in conjunction with "database.js".

var devActions = new function () {

    var rootScope,
        windowJs,
        uibModal;

    //#region Generic functions

    var diacriticsMap = {};
    var modalTask;
    var modalSubTask;
    // Set true or false to activate each of the following notifications.
    var isShowSucessMessage = true;
    var isShowInfoMessage = true;
    var isShowWarningMessage = true;
    var isShowDangerMessage = true;
    // Load dictionary to replace letters with accents by letters without accents.
    var loadDiacriticsMapAsync = function () {

        if (rootScope.constantsLoaded === true) {

            var defaultDiacriticsRemovalMap = rootScope.getBoxedConstant('DEFAULT_DIACRITICS_REMOVAL_MAP');
            for (var i = 0; i < defaultDiacriticsRemovalMap.length; i++) {
                var letters = defaultDiacriticsRemovalMap[i].letters;
                for (var j = 0; j < letters.length ; j++) {
                    diacriticsMap[letters[j]] = defaultDiacriticsRemovalMap[i].base;
                }
            }

        } else {

            setTimeout(loadDiacriticsMapAsync, 1000);
        }
    }
    // Modal functions.
    var openModalFixed1024 = function (url) {
        if (uibModal) {
            modalTask = uibModal.open({
                animation: true,
                templateUrl: url,
                backdrop: 'static',
                keyboard: false,
                windowClass: 'modal-dialog-1024px'
            });
        };
    };
    var openModal = function (url) {
        if (uibModal) {
            modalTask = uibModal.open({
                animation: true,
                templateUrl: url,
                backdrop: 'static',
                keyboard: false
            });
        };
    };
    var closeModal = function () {
        if (modalTask) {
            modalTask.dismiss();
        };
    }
    // SubModal functions.
    var openSubModalFixed1024 = function (url) {
        if (uibModal) {
            modalSubTask = uibModal.open({
                animation: true,
                templateUrl: url,
                backdrop: 'static',
                keyboard: false,
                windowClass: 'modal-dialog-1024px z-index-1060'
            });
        };
    };
    var openSubModal = function (url) {
        if (uibModal) {
            modalSubTask = uibModal.open({
                animation: true,
                templateUrl: url,
                backdrop: 'static',
                keyboard: false,
                windowClass: 'z-index-1060'
            });
        };
    };
    var closeSubModal = function () {
        if (modalSubTask) {
            modalSubTask.dismiss();
        };
    }

    var showMessage = function (alertType, text) {
        var alert = {
            type: alertType,
            message: text
        }
        rootScope.db.data.alertMessage.push(alert);
    }

    // Alerts functions
    var showSucessMessage = function (text) {
        if (isShowSucessMessage) {
            showMessage(rootScope.getBoxedConstant('ALERT_TYPE.SUCESS'), text);
        }
    }
    var showInfoMessage = function (text) {
        if (isShowInfoMessage) {
            showMessage(rootScope.getBoxedConstant('ALERT_TYPE.INFO'), text);
        }
    }
    var showWarningMessage = function (text) {
        if (isShowWarningMessage) {
            showMessage(rootScope.getBoxedConstant('ALERT_TYPE.WARNING'), text);
        }
    }
    var showDangerMessage = function (text) {
        if (isShowDangerMessage) {
            showMessage(rootScope.getBoxedConstant('ALERT_TYPE.DANGER'), text);
        }
    }
    var closeAlertMessage = function (index) {
        rootScope.db.data.alertMessage.splice(index, 1);
    }
    // Text functions.
    var removeSpaces = function (text) {
        return text.replace(/\s/g, '');
    }
    var trimString = function (text) {
        return text.replace(/^\s+|\s+$/gm, '');
    }
    var removeDiacritics = function (text) {
        var outputText = text;
        if (diacriticsMap) {
            outputText = text.replace(/[^\u0000-\u007E]/g, function (a) {
                return diacriticsMap[a] || a;
            });
        }
        return outputText;
    }

    //#endregion

    //#region Product table Functions

    var getAllProductsButton = function () {

        if (rootScope.constantsLoaded === true) {
            if (wsConnect && wsConnect.getAllProductsButton) {
                wsConnect.getAllProductsButton();
            }
        } else {
            setTimeout(getAllProductsButton, 1000);
        }
    }

    //#endregion

    this.setup = function (rootScopeParam, windowParam, uibModalParam) {

        rootScope = rootScopeParam;
        windowJs = windowParam;
        uibModal = uibModalParam;

        if (rootScope) {

            //#region Generic functions

            // Load dictionary to replace letters with accents by letters without accents.
            loadDiacriticsMapAsync();
            // Modal functions.
            rootScope.openModalFixed1024 = function (url) {
                openModalFixed1024(url);
            };
            rootScope.openModal = function (url) {
                openModal(url);
            };
            rootScope.closeModal = function (url) {
                closeModal(url);
            };
            // SubModal functions.
            rootScope.openSubModalFixed1024 = function (url) {
                openSubModalFixed1024(url);
            };
            rootScope.openSubModal = function (url) {
                openSubModal(url);
            };
            rootScope.closeSubModal = function () {
                closeSubModal();
            };
            // Alerts functions
            rootScope.showSucessMessage = function (text) {
                showSucessMessage(text);
            }
            rootScope.showInfoMessage = function (text) {
                showInfoMessage(text);
            }
            rootScope.showWarningMessage = function (text) {
                showWarningMessage(text);
            }
            rootScope.showDangerMessage = function (text) {
                showDangerMessage(text);
            }
            rootScope.closeAlertMessage = function (index) {
                closeAlertMessage(index);
            }
            // Text functions.
            rootScope.removeSpaces = function (text) {
                return removeSpaces(text);
            }
            rootScope.trimString = function (text) {
                return trimString(text);
            }
            rootScope.removeDiacritics = function (text) {
                return removeDiacritics(text);
            }

            //#endregion

            //#region Start App Demo Functions
            rootScope.getAllProductsButton = function () {
                getAllProductsButton();
            }
            //#endregion

        };
    };

    this.customAnimations = function () {
        // Start custom animations 
        return [

        ];
        // End custom animations 
    };

    this.customFilters = function () {
        // Start custom filters 
        return [
            {
                name: 'unique',
                body: function () {

                    return function (items, filterOn) {

                        if (filterOn === false) {
                            return items;
                        }

                        if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
                            var hashCheck = {}, newItems = [];

                            var extractValueToCompare = function (item) {
                                if (angular.isObject(item) && angular.isString(filterOn)) {
                                    return item[filterOn];
                                } else {
                                    return item;
                                }
                            };

                            angular.forEach(items, function (item) {
                                var valueToCheck, isDuplicate = false;

                                for (var i = 0; i < newItems.length; i++) {
                                    if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                                        isDuplicate = true;
                                        break;
                                    }
                                }
                                if (!isDuplicate) {
                                    newItems.push(item);
                                }

                            });
                            items = newItems;
                        }
                        return items;
                    };
                }

            }
        ];
        // End custom filters 
    };

};