// FlowMakerAngularPoc entry point.
// Do not change anything in this JS

var APP_MSG, APP_CONST, databaseData, wsConnect, devActions, addUser, projectUploads;

(function () {
    'use strict';

    var d2 = angular.module('draw2d', []);

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

    app.controller('EditorController', ['$scope', '$uibModal', function ($scope, $uibModal) {

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
                    //{ class: "draw2d.shape.node.Start", name: "Start" },
                    //{ class: "draw2d.shape.node.End", name: "End" },
                    { class: "Info", name: "Info", cssClass: "palette_node_info" },
                    //{ class: "draw2d.shape.analog.OpAmp", name: "draw2d.shape.analog.OpAmp" }, 
                    { class: "Condition", name: "Condition", cssClass: "palette_node_condition" },
                    { class: "Control", name: "Control", cssClass: "palette_node_control" }
                ]
            }
        };

        $scope.setHtmlContent = function () {
            $scope.editor.selection.figure.setHtmlContent();
        };

        $scope.setTitle = function () {
            $scope.editor.selection.figure.setTitle();
        };

        //$scope.buttonSetValue = function () {


        //}
        //$scope.debug = function () {

        //    console.log("debug");
        //    console.log($scope.editor.selection.children);
        //}

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

    d2.directive("draw2dCanvas", ["$window", "$parse", "$timeout", function ($window, $parse, $timeout) {

        return {
            restrict: 'E,A',
            link: function (scope, element, attrs, controller) {

                // provide the scope properties and override the defaults with the user settings
                //
                scope.editor = $.extend(true, {
                    canvas: {
                        width: 2000,
                        height: 2000,
                        onDrop: function (droppedDomNode, x, y, shiftKey, ctrlKey) { }
                    },
                    palette: {
                        figures: []
                    },
                    state: {
                        dirty: false,
                        canUndo: false,
                        canRedo: false
                    },
                    selection: {
                        className: null,
                        figure: null,
                        attr: null,
                        userData: null,
                        children: {

                            data: null
                        }
                    }

                }, scope.editor);

                // init the Draw2D Canvas with the given user settings and overriden hooks
                //
                var canvas = new draw2d.Canvas(element.attr("id"), scope.editor.canvas.width, scope.editor.canvas.height);
                canvas.setScrollArea("#" + element.attr("id"));
                canvas.onDrop = $.proxy(scope.editor.canvas.onDrop, canvas);

                // update the scope model with the current state of the
                // CommandStack
                var stack = canvas.getCommandStack();
                stack.addEventListener(function (event) {
                    $timeout(function () {
                        scope.editor.state.canUndo = stack.canUndo();
                        scope.editor.state.canRedo = stack.canRedo();
                    }, 0);
                });

                // Update the selection in the model
                // and Databinding Draw2D -> Angular
                var changeCallback = function (emitter, attribute) {
                    if(emitter!=null)
                    var children =  emitter.getChildren().data;
                    $timeout(function () {
                        //if (scope.editor.selection.attr !== null) {
                            //scope.editor.selection.attr[attribute] = emitter.attr(attribute);
                        //}
                        if (scope.editor.selection.children.data !== null && children.length != scope.editor.selection.children.data.length) {
                            scope.editor.selection.children.data = emitter.getChildren().data;
                        }

                    }, 0);
                };
                canvas.on("select", function (canvas, event) {

                    var figure = event.figure;
                    if (figure instanceof draw2d.Connection) {
                        return; // silently
                    }

                    $timeout(function () {
                        if (figure !== null) {
                            var innerForeignObject = document.getElementById("info-" + figure.id);
                            scope.editor.selection.className = figure.NAME;
                            //scope.editor.selection.attr = figure.attr();
                            scope.editor.selection.children.data = figure.getChildren().data;
                            if (innerForeignObject) {

                                figure.userData.flowData.html =  innerForeignObject.innerHTML ;
                                scope.editor.selection.userData = figure.getUserData();
                            }
                            scope.editor.selection.userData = figure.getUserData();
                        }
                        else {
                            scope.editor.selection.className = null;
                            //scope.editor.selection.attr = null;
                            scope.editor.selection.children.data =  null;
                        }

                        // unregister and register the attr listener to the new figure
                        //
                        if (scope.editor.selection.figure !== null) { scope.editor.selection.figure.off("change", changeCallback); }
                        scope.editor.selection.figure = figure;
                        if (scope.editor.selection.figure !== null) { scope.editor.selection.figure.on("change", changeCallback); }
                    }, 0);
                });

                // Databinding: Angular UI -> Draw2D
                // it is neccessary to call the related setter of the draw2d object. "Normal" Angular 
                // Databinding didn't work for draw2d yet
                //
                //scope.$watchCollection("editor.selection.attr", function (newValues, oldValues) {

                //    if (oldValues !== null && scope.editor.selection.figure != null) {
                //        // for performance reason we post only changed attributes to the draw2d figure
                //        //
                //        var changes = draw2d.util.JSON.diff(newValues, oldValues);
                //        scope.editor.selection.figure.attr(changes);
                //    }
                //});

                scope.$watchCollection("editor.selection.userData", function (newValues, oldValues) {

                    if (oldValues !== null && scope.editor.selection.figure != null) {
                        // for performance reason we post only changed attributes to the draw2d figure
                        //
                        var changes = draw2d.util.JSON.diff(newValues, oldValues);
                        $.extend(scope.editor.selection.figure.userData,changes);
                    }
                });

                //scope.$watchCollection("editor.selection.children.data", function (newValues, oldValues) {

                //    if (oldValues !== null && scope.editor.selection.figure != null && newValues.length !== scope.editor.selection.figure.children.length) {
                //        // for performance reason we post only changed attributes to the draw2d figure
                //        //
                //        var changes = draw2d.util.JSON.diff(newValues, oldValues);
                //        $.extend(scope.editor.selection.figure.children.data, changes);
                //    }
                //});

                // push the canvas function to the scope for ng-action access
                //
                scope.editor.undo = $.proxy(stack.undo, stack);
                scope.editor.redo = $.proxy(stack.redo, stack);
                scope.editor["delete"] = $.proxy(function () {
                    var node = this.getCurrentSelection();
                    var command = new draw2d.command.CommandDelete(node);
                    this.getCommandStack().execute(command);
                }, canvas);
                scope.editor.load = $.proxy(function (json) {
                    canvas.clear();
                    var reader = new draw2d.io.json.Reader();
                    reader.unmarshal(canvas, json);
                }, canvas);
            }
        };
    }]);

    d2.directive("draw2dPalette", ["$window", "$parse", '$timeout', function ($window, $parse, $timeout) {
        return {
            restrict: 'E,A',
            link: function (scope, element, attrs, controller) {

                // $timeout is used just to ensure that the template is rendered if we want access them
                // (leave the render cycle)
                $timeout(function () {
                    $(".draw2d_droppable").draggable({
                        appendTo: "body",
                        stack: "body",
                        zIndex: 27000,
                        helper: "clone",
                        drag: function (event, ui) {
                        },
                        stop: function (e, ui) {
                        },
                        start: function (e, ui) {
                            $(ui.helper).addClass("shadow");
                        }
                    });
                }, 0);
            },
            template: "<div ng-repeat='figure in editor.palette.figures' data-shape='{{figure.class}}'  class='palette_node_element draw2d_droppable {{figure.cssClass}}'>{{figure.name}}</div>"
        };
    }]);



})();