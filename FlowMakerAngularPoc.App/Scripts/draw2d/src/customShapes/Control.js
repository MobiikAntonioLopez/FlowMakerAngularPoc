Control = draw2d.shape.layout.VerticalLayout.extend({

    NAME: "Control",

    init: function (attr) {

        var inputPort = new draw2d.InputPort({ bgColor: "#ffffff", stroke: 1, color:"#000000" });
        var outputPort = new draw2d.OutputPort({ bgColor: "#000000", stroke: 0 });

        this._super($.extend({ bgColor: "#FFECC4", color: "#291F1F", stroke: 1, }, attr));


        this.classLabel = new draw2d.shape.basic.Label({
            text: "Control capsule",
            stroke: 1,
            fontColor: "#270B05",
            bgColor: "#ffd486",
            radius: this.getRadius(),
            padding: 10,
            resizeable: true,
            //editor: new draw2d.ui.LabelInplaceEditor()
        });



        this.add(this.classLabel);
        this.addEntity({label:'optionLabel',value:'optionValue',id:'optionId'});
        this.setHeight(200);
        this.addPort(inputPort, new draw2d.layout.locator.XYRelPortLocator(0,50));
        this.userData = {
            flowData: {
                flow: '',
                type: 'CTRLS',
                title: '',
                controls: [
                    {
                    ctrlType: 'CTRL_BUTTON',
                    ctrlGroup: []
                    }
                ]
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
    addEntity: function (button, optionalIndex) {
        if(button!=null&&label!==''){
        var label = new draw2d.shape.basic.Label({
            text: button.label,
            stroke: 1,
            radius: 0,
            bgColor: null,
            padding: { left: 10, top: 20, right: 10, bottom: 10 },
            fontColor: "#4a4a4a",
            resizeable: true,
            minHeight: 70,
            height:70,
        });

        var outputPort = new draw2d.OutputPort({ bgColor: "#000000", stroke: 0 });
        var _table = this;

        label.addPort(outputPort, new draw2d.layout.locator.RightLocator());
        //output.setName("output_" + label.id);

        //label.on("contextmenu", function (emitter, event) {
        //    $.contextMenu({
        //        selector: 'body',
        //        events:
        //        {
        //            hide: function () { $.contextMenu('destroy'); }
        //        },
        //        callback: $.proxy(function (key, options) {
        //            switch (key) {
        //                case "rename":
        //                    setTimeout(function () {
        //                        emitter.onDoubleClick();
        //                    }, 10);
        //                    break;
        //                case "new":
        //                    setTimeout(function () {
        //                        _table.addEntity("_new_").onDoubleClick();
        //                    }, 10);
        //                    break;
        //                case "delete":
        //                    // with undo/redo support
        //                    var cmd = new draw2d.command.CommandDelete(emitter);
        //                    emitter.getCanvas().getCommandStack().execute(cmd);
        //                default:
        //                    break;
        //            }

        //        }, this),
        //        x: event.x,
        //        y: event.y,
        //        items:
        //        {
        //            "rename": { name: "Rename" },
        //            "new": { name: "New Entity" },
        //            "sep1": "---------",
        //            "delete": { name: "Delete" }
        //        }
        //    });
        //});

        label.userData =
            {
                buttonData: {

                    label: button.label,
                    id: button.id,
                    flowTo: '',
                    value: button.value
                }
        }


        if ($.isNumeric(optionalIndex)) {
            this.add(label, null, optionalIndex + 1);
        }
        else {
            this.add(label);
        }

        this.setHeight(100);

        return label;}
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


    setTitle: function () {
        this.classLabel.setText(this.userData.flowData.title);
    }


});
