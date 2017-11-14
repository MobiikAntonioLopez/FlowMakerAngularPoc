// **************************************************
// This file is the gateway for intercept UI actions.
// **************************************************
// initialize: form(s) initialization
// validate: field(s) validation
// submitForm: form(s) submission
// doActions: form-indipendent actions (doAction)
// **************************************************

var formsHandle = {


    doActions: function (app, actionId, params, database) {
        var uiSimulated = false;
        console.log("Action request: " + actionId);
        switch (actionId) {
            //Start custome doActions
            //End custome doActions
            default:
                console.log("Action uncatched:" + actionId);
                uiSimulated = true;
                break;
        }

        if (uiSimulated && actionId && simulActions && (typeof simulActions[actionId] === 'function')) {
            simulActions[actionId](params, database);
        }
    },
    validate: function (root, formName, fieldName, fieldValue) {

        var uiSimulated = true;
        var errorMsg = "";

        if (root && root.APP_CONST && root.APP_MSG) {
            switch (formName) {
                //#region Start custome validations
                case 'userFormDemo':
                    uiSimulated = false;

                    switch (fieldName) {

                        case 'nameInput':
                            if (!fieldValue) {
                                errorMsg = root.getBoxedMessage('VALIDATION_TEXT_REQUIRED_FIELD');
                            }
                            else if (!this.isLowercaseAlphanumeric(fieldValue)) {
                                errorMsg = root.getBoxedMessage('VALIDATION_TEXT_ALPHANUMERIC_LOWERCASE_FIELD');
                            }
                            else if (!this.isLenghtInRange(fieldValue, root.getBoxedConstant('LENGTH_VALUE_003'), root.getBoxedConstant('LENGTH_VALUE_050'))) {
                                errorMsg = root.sprintf(root.getBoxedMessage('VALIDATION_TEXT_FIELD_RANGE'),
                                    [root.getBoxedConstant('LENGTH_VALUE_010'), root.getBoxedConstant('LENGTH_VALUE_050')]);
                            }

                            break;
                        case 'lastNameInput':
                            if (!fieldValue) {
                                errorMsg = root.getBoxedMessage('VALIDATION_TEXT_REQUIRED_FIELD');
                            }
                            else if (!this.isLowercaseAlphanumeric(fieldValue)) {
                                errorMsg = root.getBoxedMessage('VALIDATION_TEXT_ALPHANUMERIC_LOWERCASE_FIELD');
                            }
                            else if (!this.isLenghtInRange(fieldValue, root.getBoxedConstant('LENGTH_VALUE_003'), root.getBoxedConstant('LENGTH_VALUE_050'))) {
                                errorMsg = root.sprintf(root.getBoxedMessage('VALIDATION_TEXT_FIELD_RANGE'),
                                    [root.getBoxedConstant('LENGTH_VALUE_010'), root.getBoxedConstant('LENGTH_VALUE_050')]);
                            }
                            break;
                    }
                    break;

                    //#endregion
            }
        }

        if (uiSimulated && simulActions && simulActions.validate) {
            errorMsg = simulActions.validate(root, formName, fieldName, fieldValue);
        }

        return errorMsg;
    },
    initialize: function (ctrl, formName, database) {
        var uiSimulated = true;
        var errorMsg = "";


        //Start custome initialize
        //End custome initialize

        if (uiSimulated && simulActions && simulActions.formInit) {
            simulActions.formInit(ctrl, formName, database);
        }
    },
    submitForm: function (ctrl, formName, database, simulatedAction) {
        var uiSimulated = false;
        switch (formName) {
            //#region Start custome submit
            case 'userFormDemo':
                if (wsConnect && wsConnect.saveUserButton) {
                    wsConnect.saveUserButton(ctrl);
                }
                break;
                //#endregion

            default:
                uiSimulated = true;
        }
        if (uiSimulated && simulatedAction && simulActions && (typeof simulActions[simulatedAction] === 'function')) {
            simulActions[simulatedAction](ctrl, formName, database);
        }
    },
    isAlphanumeric: function (fieldValue) {
        return /^[a-zA-Z0-9]+$/.test(fieldValue);
    },
    isAlphanumericWithBlankSpaces: function (fieldValue) {
        return /^[a-zA-Z0-9\s]+$/.test(fieldValue);
    },
    isLowercaseAlphanumeric: function (fieldValue) {
        return /^[a-z0-9]+$/.test(fieldValue);
    },
    isUppercaseAlphanumericWithUnderscore: function (fieldValue) {
        return /^[A-Z0-9\u005F]+$/.test(fieldValue);
    },
    isUppercaseAlpha: function (fieldValue) {
        return /^[A-Z]+$/.test(fieldValue);
    },
    hasBlankSpaces: function (fieldValue) {
        return /\s/g.test(fieldValue);
    },
    isLenghtInRange: function (fieldValue, lenMin, lenMax) {
        var result = false;
        if (fieldValue && fieldValue.length) {
            result = (fieldValue.length >= lenMin) && (fieldValue.length <= lenMax);
        }
        return result;
    },
    isInterger: function (fieldValue) {
        return /^\d+$/.test(fieldValue);
    },
    isKeyElement: function (fieldValue) {
        return /^key+[\d]{6,6}$/.test(fieldValue)
    },
    isOriginalChain: function (fieldValue) {
        return /^[a-z0-9]+((\|[a-z0-9]+)*(\|\^\|[a-z0-9]+)*)*$/.test(fieldValue)
    }
};