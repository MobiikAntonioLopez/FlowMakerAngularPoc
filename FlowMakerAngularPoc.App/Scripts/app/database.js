// **************************************************
// This file manage UI database load. Optionally can 
// be used in conjunction with "wsConnect.js" to 
// manage basic real http database actions. 
// **************************************************

// Do not change anything in this JS

(function () {
    var app = angular.module('databaseModule', []),
        store,
        scope,
        rootScope,
        http;

    function checkData() {
        if (databaseData) {
            store.data = databaseData;
            if (rootScope) {
                rootScope.databaseLoaded = true;
            }
            scope.$apply();
        } else {
            setTimeout(checkData, 100);
        }
    }

    app.directive('database', function () {
        function loadDatabase(newDatabaseName) {
            if (store) {
                store.databaseName = newDatabaseName;
            }
            var imported = document.createElement('script');
            databaseData = null;
            imported.src = '/Scripts/app/database/' + newDatabaseName + '.js';
            document.head.appendChild(imported);
            setTimeout(checkData, 100);
        }

        function refreshDatabase() {
            if (store && store.databaseName) {
                loadDatabase(store.databaseName);
            }
        }

        return {
            restrict: 'A',
            controller: ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
                store = this;
                scope = $scope;
                rootScope = $rootScope;
                http = $http;
                if ($rootScope) {
                    $rootScope.db = this;
                }
                this.scope = scope;
                this.rootScope = rootScope;
                this.data = {};

                this.getDatabaseName = function () {
                    return this.databaseName;
                };

                this.getField = function (fieldName) {
                    var fieldValue;
                    if (this.data) {
                        fieldValue = this.data[fieldName];
                    }
                    return fieldValue;
                };

                this.set = function (databaseName) {
                    loadDatabase(databaseName);
                };

                this.refresh = function () {
                    refreshDatabase();
                };

                this.setValue = function (varName, value) {
                    if (this.data && this.data[varName]) {
                        this.data[varName] = value;
                    }
                };

                this.pushItem = function (varName, value) {
                    if (this.data && this.data[varName] && this.data[varName].push) {
                        this.data[varName].push(value);
                    }
                };

                this.removeItemAt = function (varName, itemNumber) {
                    if (this.data && this.data[varName] && this.data[varName].splice) {
                        this.data[varName].splice(itemNumber, 1);
                    }
                };

            }],
            link: function (scope, iElement, iAttrs) {
                iAttrs.$observe('database', function (value) {
                    loadDatabase(value);
                });
            },
            controllerAs: 'db'
        };

    });

    app.directive('dbField', function ($rootScope) {
        return {
            restrict: 'A',
            template: function (iElement, iAttrs) {
                var returnValue = '?';
                if (iAttrs && iAttrs.dbField) {
                    returnValue = '{{db.data.' + iAttrs.dbField + '}}';
                }
                return returnValue;
            }
        };
    });

    app.directive('dbHtmlField', function ($rootScope) {
        return {
            restrict: 'A',
            template: function (iElement, iAttrs) {
                var returnValue = '?';
                if (iAttrs && iAttrs.dbHtmlField) {
                    returnValue = '<span ng-bind-html="db.data.' + iAttrs.dbHtmlField + '"></span>';
                }
                return returnValue;
            }
        };
    });

})();