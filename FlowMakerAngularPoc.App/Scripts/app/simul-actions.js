// **************************************************
// This file is for UI simulated actions
// **************************************************

var simulActions = { // *** Do not change this declaration ***

    // **************************************************
    // Define your functions here
    // **************************************************
    // e.g.:myAction: function (formData, formName, db) {
    //          // put your javascript code here
    //      },
    //      myOtherAction: function (urlAddress) {
    //          // put your javascript code here
    //      }
    // **************************************************
    // When a function is called by a form ng-submit
    // i.e. local.submit('myAction')
    // passed parameters always are:
    // formData: object, used to retrieve form data 
    //           i.e. formData.userName
    // formName: string, the name of the form
    // db:       a reference to the database object 
    //           (may be undefined)
    // ***************************************************
    // When a function is called by a "doAction"
    // i.e. ng-click="doAction('uiRemoveItem',[$index])"
    // passed parameters always are:
    // params:   array, containing all parameters
    //           (may be undefined)
    // db:       a reference to the database object 
    //           (may be undefined)
    // ***************************************************

    // **************************************************
    // This is the default form validation gateway for UI
    // **************************************************
    validate: function (root, formName, fieldName, fieldValue) {
        var errorMsg = "";

        // **************************************************
        // Put your validation logic here.
        // **************************************************

        return errorMsg;
    },
    // **************************************************

    // **************************************************
    // This is the default form init gateway for UI
    // **************************************************
    formInit: function (ctrl, formName, database) {

        // **************************************************
        // Init your forms here
        // **************************************************

    }
};