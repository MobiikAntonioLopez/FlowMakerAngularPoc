Condition = draw2d.shape.layout.VerticalLayout.extend({

    NAME: "Condition",

    init: function (attr) {

        var inputPort = new draw2d.InputPort({ bgColor: "#ffffff", stroke: 1, color: "#000000" });
        var outputPort = new draw2d.OutputPort({ bgColor: "#000000", stroke: 0 });

        this._super($.extend({ bgColor: "#E2EFDA", color: "#291F1F", stroke: 1, }, attr));


        this.classLabel = new draw2d.shape.basic.Label({
            text: "Condition capsule",
            stroke: 1,
            fontColor: "#ffffff",
            bgColor: "#8AC87A",
            radius: this.getRadius(),
            padding: 10,
            resizeable: true,
            //editor: new draw2d.ui.LabelInplaceEditor()
        });



        this.add(this.classLabel);
        //this.addEntity({ value: 'defaultResultValue' });
        //this.addEntity({ value: 'FALSE' });
        this.setHeight(200);
        this.addPort(inputPort, new draw2d.layout.locator.XYRelPortLocator(0, 50));
        this.classLabel.addPort(outputPort, new draw2d.layout.locator.RightLocator());

        this.userData = {
            flowData: {
                flow: '',
                type: 'JS_FLOW',
                condition : '',
                flowTo: '',
                results: []
            }
        };
    },


    /**
     * @method
     * Add an entity to the db shape
     * 
     * @param {String} txt the label to show
     * @param {Number} [optionalIndex] index where to insert the entity
     */
    addEntity: function (result, optionalIndex) {
        if (result != null) {
            var label = new draw2d.shape.basic.Label({
                text: result.value,
                stroke: 1,
                radius: 0,
                bgColor: null,
                padding: { left: 10, top: 20, right: 10, bottom: 10 },
                fontColor: "#4a4a4a",
                resizeable: true,
                minHeight: 70,
                height: 70,
            });

            var outputPort = new draw2d.OutputPort({ bgColor: "#000000", stroke: 0 });
            var _table = this;

            label.addPort(outputPort, new draw2d.layout.locator.RightLocator());

            label.userData =
                {
                    resultData : {
                        value : result.value,
                        flowTo: '',
                    }                    
                }


            if ($.isNumeric(optionalIndex)) {
                this.add(label, null, optionalIndex + 1);
            }
            else {
                this.add(label);
            }

            this.setHeight(100);

            return label;
        }
    },

    /**
     * @method
     * Remove the entity with the given index from the DB table shape.<br>
     * This method removes the entity without care of existing connections. Use
     * a draw2d.command.CommandDelete command if you want to delete the connections to this entity too
     * 
     * @param {Number} index the index of the entity to remove
     */
    removeEntity: function (index) {
        //this.remove(this.children.get(index + 1).figure);

        //this.remove(this.children.get(index + 1).figure);
        var removeCommand = new draw2d.command.CommandDelete(this.children.get(index + 1).figure);
        this.getCanvas().getCommandStack().execute(removeCommand);
    },

    /**
     * @method
     * Returns the entity figure with the given index
     * 
     * @param {Number} index the index of the entity to return
     */
    getEntity: function (index) {
        return this.children.get(index + 1).figure;
    },


    setCondition: function () {
        this.classLabel.setText(this.userData.flowData.condition);
    }


});
