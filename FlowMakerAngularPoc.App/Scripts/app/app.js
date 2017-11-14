// FlowMakerAngularPoc entry point.
// Do not change anything in this JS

var APP_MSG, APP_CONST, databaseData, wsConnect, devActions, addUser, projectUploads;

(function () {
    'use strict';


    var app = angular.module('angularBox', ['ngRoute', 'ngCookies', 'ngSanitize', 'databaseModule', 'directivesModule', 'ngAnimate', 'ui.bootstrap', 'draw2d']),
        formCtrl,
        scope,
        rootScope,
        http,
        cookies;

    if (devActions && devActions.customFilters) {
        var customFilters = devActions.customFilters();
        if (customFilters) {
            var h = customFilters.length;
            for (var i = 0; i < h; i++) {
                app.filter(customFilters[i].name, customFilters[i].body);
            }
        }
    }

    if (devActions && devActions.customAnimations) {
        var customAnimations = devActions.customAnimations();
        if (customAnimations) {
            var h = customAnimations.length;
            for (var i = 0; i < h; i++) {
                app.animation('.' + customAnimations[i].name, customAnimations[i].body);
            }
        }
    }

    function checkData() {
        if (scope && rootScope && APP_CONST && APP_MSG) {
            rootScope.APP_CONST = JSON.parse(JSON.stringify(APP_CONST));
            rootScope.APP_MSG = JSON.parse(JSON.stringify(APP_MSG));
            APP_CONST = undefined;
            APP_MSG = undefined;
            rootScope.constantsLoaded = true;
            rootScope.$broadcast('languageChange', scope.language);
            rootScope.$apply();
        } else {
            setTimeout(checkData, 100);
        }
    }

    app.setLanguage = function (app, language) {
        if (scope) {
            if (cookies) {
                cookies['angularBoxLanguage'] = language;
            }
            scope.language = language;
            app.loadConstantsUI();
        }
    };

    app.getScope = function () {
        return scope;
    };

    app.getRootScope = function () {
        return rootScope;
    };

    app.getHttp = function () {
        return http;
    };

    app.loadConstantsUI = function () {
        if (scope && scope.language) {
            var importedMsgs = document.createElement('script'),
                importedConsts = document.createElement('script');
            importedMsgs.src = '/Scripts/app/constants/local-' + scope.language + '.js';
            importedConsts.src = '/Scripts/app/constants/general.js';

            APP_MSG = undefined;
            APP_CONST = undefined;

            document.head.appendChild(importedMsgs);
            document.head.appendChild(importedConsts);
            setTimeout(checkData, 100);
        } else {
            setTimeout(app.loadConstantsUI, 100);
        }
    };

    app.loadConstantsUI();

    app.config(['$httpProvider', function ($httpProvider) {
        console.log('*** CONFIGURE ***');
        $httpProvider.defaults.headers.common = {};
        $httpProvider.defaults.headers.post = {};
        //$httpProvider.defaults.headers.put = {};
        //$httpProvider.defaults.headers.patch = {};
        //$httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
    }]);

    app.run(['$rootScope', '$sce', function ($rootScope, $sce) {
        $rootScope.uiVars = {};
        $rootScope.getBoxedMessage = function (value) {
            var message = '';
            if ($rootScope && $rootScope.APP_MSG) {
                message = $rootScope.APP_MSG[value];
            }
            return message;
        };
        $rootScope.getBoxedConstant = function (value) {
            var message = '';
            if ($rootScope && $rootScope.APP_CONST) {
                message = $rootScope.APP_CONST[value];
            }
            return message;
        };
        $rootScope.sprintf = function (mask, elements) {
            var formattedString = mask;
            if (elements && elements.length > 0) {
                var len = elements.length;
                for (var i = 0; i < len; ++i) {
                    var regex = new RegExp('[{]' + i + '[}]', 'g');
                    formattedString = formattedString.replace(regex, elements[i]);
                }
            }
            return formattedString;
        }
        rootScope = $rootScope;
    }]);

    app.controller('ActionController', ['$scope', '$cookies', '$rootScope', '$http', '$filter', '$window', '$uibModal', '$sce', function ($scope, $cookies, $rootScope, $http, $filter, $window, $uibModal, $sce) {

        $scope.formName = 'noForm';

        if (!$scope.language) {
            $scope.language = 'es';
        }

        if (wsConnect && wsConnect.setup) {
            wsConnect.setup($http, $rootScope, $scope);
        }

        if (devActions && devActions.setup) {
            devActions.setup($rootScope, $window, $uibModal, $sce);
        }

        $rootScope.doAction = function (actionId, params) {
            if (formsHandle && (typeof formsHandle.doActions === 'function')) {
                formsHandle.doActions(app, actionId, params, rootScope ? rootScope.db : undefined);
            } else {
                console.log('[' + actionId + ']');
            }
        };
        $scope.database = function (databaseName) {
            $scope.$broadcast('databaseChange', databaseName);
        };

        cookies = $cookies;
        scope = $scope;
        http = $http;
    }]);

    app.controller('FormsCtrl', ['$scope', '$element', '$http',
        function ($scope, $element, $http) {
            formCtrl = this;
            this.http = $http;
            this.scope = scope;
            this.rootScope = rootScope;

            $scope.fieldErrors = {};

            this.init = function () {
                console.log('Initialing02:');
                initialize();
            }

            var initialize = function () {
                console.log('Initialing01:');
                if (formsHandle && (typeof formsHandle.initialize === 'function')) {
                    formsHandle.initialize(formCtrl, formCtrl.scope.formName);
                }
            };

            if ($element && $element[0]) {
                $scope.formName = $element[0].name;
            } else {
                $scope.formName = 'noForm';
            }

            initialize();

            this.submit = function (simulatedAction) {
                if (formsHandle && (typeof formsHandle.submitForm === 'function')) {
                    this.scope = scope;
                    this.rootScope = rootScope;
                    formsHandle.submitForm(this, $scope.formName, rootScope ? rootScope.db : undefined, simulatedAction);
                } else {
                    console.log('Submit form request:' + $scope.formName);
                }
            };

        }]);

    app.controller('EditorController', ['$scope', '$modal', function ($scope, $modal) {

        $scope.editor = {
            // ng-click Callbacks
            //
            // Open the FileOpenDialog and let the user select a new file for open
            //
            fileOpen: function () {
                var modalInstance = $modal.open({
                    templateUrl: 'src/controllers/FileOpenController.html',
                    controller: 'FileOpenController'
                });

                modalInstance.result.then(
    		        // [OK]
    		    	function (content) {
    		    	    $scope.editor.load(content);
    		    	},
	    		    // [Cancel]
	    		    function () {

	    		    }
	    	   );
            },
            //------------------------------------------------------------------------
            // Configuration of the editor
            //
            // 
            canvas: {
                // callback if a DOM node from the palette is dropped inside the canvas
                //
                onDrop: function (droppedDomNode, x, y, shiftKey, ctrlKey) {
                    var type = $(droppedDomNode).data("shape");
                    var figure = eval("new " + type + "();");
                    // create a command for the undo/redo support
                    var command = new draw2d.command.CommandAdd(this, figure, x, y);
                    this.getCommandStack().execute(command);
                }
            },

            // provide all figurs to show in the left hand palette
            // Used by the directrives/canvas.js
            palette: {
                figures: [
                    { class: "draw2d.shape.node.Start", name: "Start" },
                    { class: "draw2d.shape.node.End", name: "End" }
                ]
            }
        };
    }
    ]);

    app.directive('validate', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                formName: '='
            },
            link: function (scope, elm, attrs, ctrl) {

                scope.$on('languageChange', function (event, language) {
                    ctrl.$validate();
                });

                ctrl.$validators.validate = function (modelValue, viewValue) {
                    var isValid = true;

                    if (formsHandle && (typeof formsHandle.validate === 'function')) {
                        var errorMsg = formsHandle.validate(rootScope, scope.$parent.formName, attrs.name, viewValue);
                        isValid = (errorMsg.length === 0);
                        errorMsg = errorMsg.trim();
                        scope.$parent.fieldErrors[attrs.name] = errorMsg;
                    } else {
                        console.log('Warning: invalid validate function.');
                    }
                    return isValid;
                };
            }
        };
    });

    app.directive('boxedMessage', function ($rootScope) {
        return {
            restrict: 'A',
            template: function (iElement, iAttrs) {
                var returnValue = '?';
                if (iAttrs && iAttrs.boxedMessage) {
                    returnValue = '{{$root.APP_MSG.' + iAttrs.boxedMessage + '}}';
                }
                return returnValue;
            }
        };
    });

    app.directive('boxedHtmlMessage', function ($rootScope) {
        return {
            restrict: 'A',
            template: function (iElement, iAttrs) {
                var returnValue = '?';
                if (iAttrs && iAttrs.boxedHtmlMessage) {
                    returnValue = '<span ng-bind-html="$root.APP_MSG.' + iAttrs.boxedHtmlMessage + '"></span>';
                }
                return returnValue;
            }
        };
    });

    app.directive('boxedConstant', function ($rootScope) {
        return {
            restrict: 'A',
            template: function (iElement, iAttrs) {
                var returnValue = '?';
                if (iAttrs && iAttrs.boxedConstant) {
                    returnValue = '{{$root.APP_CONST.' + iAttrs.boxedConstant + '}}';
                }
                return returnValue;
            }
        };
    });

    app.directive('boxedHtmlConstant', function ($rootScope) {
        return {
            restrict: 'A',
            template: function (iElement, iAttrs) {
                var returnValue = '?';
                if (iAttrs && iAttrs.boxedHtmlConstant) {
                    returnValue = '<span ng-bind-html="$root.APP_MSG.' + iAttrs.boxedHtmlConstant + '"></span>';
                }
                return returnValue;
            }
        };
    });
})();