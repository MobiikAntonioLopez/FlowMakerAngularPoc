// **************************************************
// This file is for AngularJs custom directives
// **************************************************

(function () {
    'use strict';

    var app = angular.module('directivesModule', []);

    //#region Reusable directives
    app.directive('lockScreen', function () {
        return { templateUrl: '/Scripts/app/directives/lockScreen/lockScreen.html' };
    });
    app.directive('alertMessage', function () {
        return { templateUrl: '/Scripts/app/directives/alertMessage/alertMessage.html' };
    });
    //#endregion

    //#region Custome directives
    app.directive('startApp', function () {
        return { templateUrl: '/Scripts/app/directives/startApp/startApp.html' };
    });

    app.directive('productoTable', function () {
        return { templateUrl: '/Scripts/app/directives/productoTable/productoTable.html' };
    });   
    //#endregion

})();