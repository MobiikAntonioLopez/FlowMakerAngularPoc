

Info = draw2d.shape.basic.Rectangle.extend({

    

    NAME: "Info",

    init: function (attr, setter, getter) {

        var FOREIGN_OBJECT_ID_PREFIX = 'fo-';
        var INFO_CONTENT_ID_PREFIX = 'info-';

        var that = this;

        this._super($.extend({ width: 120, height: 120, bgColor: "#f0f0ff" }, attr));

        var child = new draw2d.shape.basic.Rectangle(
            {
                bgColor: "#4df6ba",
                alpha: 0.0
            });

        var inputPort = new draw2d.InputPort({ bgColor: "#ffffff", stroke: 1, color: "#000000" });
        var outputPort = new draw2d.OutputPort({ bgColor: "#000000", stroke: 0 });

        child.on("move", function (foreignObjectContainer) {

            that.foreignObjectId = FOREIGN_OBJECT_ID_PREFIX + foreignObjectContainer.getParent().id;
            that.infoContentId = INFO_CONTENT_ID_PREFIX + foreignObjectContainer.getParent().id

            var canvas = foreignObjectContainer.canvas.paper.canvas;
            var foreignObject = document.getElementById(that.foreignObjectId);
            var infoContent = document.getElementById(that.infoContentId);
            var contentWidth = ((foreignObjectContainer.getParent().getWidth()-20) > 0) ?  foreignObjectContainer.getParent().getWidth()-20 : 0;
            var contentHeight = ((foreignObjectContainer.getParent().getHeight() - 20) > 0) ? foreignObjectContainer.getParent().getHeight() - 20 : 0;

            if (!foreignObject) {
                foreignObject = document.createElementNS(canvas.namespaceURI, "foreignObject");
                foreignObject.setAttribute('id', that.foreignObjectId);
            }

            if (!infoContent) {

                infoContent = document.createElement('div');
                infoContent.id = that.infoContentId;
                infoContent.style.overflow = 'hidden';
            }


            foreignObject.setAttribute('x', foreignObjectContainer.getParent().getX() + 10);
            foreignObject.setAttribute('y', foreignObjectContainer.getParent().getY() + 10);
            foreignObject.setAttribute('width',contentWidth);
            foreignObject.setAttribute('height', contentHeight);
            infoContent.style.width = contentWidth + "px";
            infoContent.style.height = contentHeight + "px";

            foreignObject.appendChild(infoContent);
            canvas.appendChild(foreignObject);
        });
        
        this.add(child, new draw2d.layout.locator.CenterLocator());
        this.userData = {
            flowData: {
                flow: '',
                type: 'INFO',
                flowTo: '',
                html:'',
            }
        };

        this.addPort(inputPort, new draw2d.layout.locator.LeftLocator());
        this.addPort(outputPort, new draw2d.layout.locator.RightLocator());

        //this.createPort("output");
        //this.createPort("input");
    },

    setHtmlContent: function(){
        var infoContent = document.getElementById(this.infoContentId);
        infoContent.innerHTML = this.userData.flowData.html;
    }

});