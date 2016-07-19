(function(f, define) {
    define(["../main", "./column-resizing", "./table-resize-handle", "./resizing-utils"], f);
})(function() {

(function(kendo, undefined) {
    var global = window;
    var parseFloat = global.parseFloat;

    var $ = kendo.jQuery;
    var extend = $.extend;
    var proxy = $.proxy;

    var browser = kendo.support.browser;
    var Editor = kendo.ui.editor;
    var Class = kendo.Class;
    var ColumnResizing = Editor.ColumnResizing;
    var TableResizeHandle = Editor.TableResizeHandle;
    var ResizingUtils = Editor.ResizingUtils;
    var constrain = ResizingUtils.constrain;
    var getElementWidth = ResizingUtils.getElementWidth;

    var DRAG = "drag";
    var NS = ".kendoEditorTableResizing";
    var CLICK = "click";
    var EAST = "east";
    var NORTH = "north";
    var NORTHEAST = "northeast";
    var NORTHWEST = "northwest";
    var SOUTH = "south";
    var SOUTHEAST = "southeast";
    var SOUTHWEST = "southwest";
    var WEST = "west";
    var TABLE = "table";
    var WIDTH = "width";

    var TableResizing = Class.extend({
        init: function(element, options) {
            var that = this;

            that.options = extend({}, that.options, options);
            that.handles = [];

            if ($(element).is(TABLE)) {
                that.element = element;
                that.columnResizing = new ColumnResizing(element, that.options);
                $(that.options.rootElement).on(CLICK + NS, TABLE, proxy(that.showResizeHandles, that));
            }
        },

        destroy: function() {
            var that = this;
            var element = that.element;
            var columnResizing = that.columnResizing;
            
            if (columnResizing) {
                columnResizing.destroy();
                that.columnResizing = null;
            }

            $(element).off(NS);
            that.element = null;

            $(that.options.rootElement).off(NS);

            that._destroyResizeHandles();
        },

        options: {
            rtl: false,
            rootElement: null,
            min: 50,
            handles: [{
                direction: EAST
            }, {
                direction: NORTH
            }, {
                direction: NORTHEAST
            }, {
                direction: NORTHWEST
            }, {
                direction: SOUTH
            }, {
                direction: SOUTHEAST
            }, {
                direction: SOUTHWEST
            }, {
                direction: WEST
            }]
        },

        resizingInProgress: function() {
            var that = this;
            var columnResizing = that.columnResizing;

            if (columnResizing) {
                return !!columnResizing.resizingInProgress();
            }

            return false;
        },

        resize: function(args) {
            var that = this;
            var deltas = extend({}, {
                deltaX: 0,
                deltaY: 0
            }, args);

            that._resize(deltas);
            that.showResizeHandles();
        },

        _resize: function(deltas) {
            var that = this;

            that._resizeWidth(deltas.deltaX);
        },

        _resizeWidth: function(deltaX) {
            var that = this;
            var element = $(that.element);
            var styleWidth = element[0].style[WIDTH];
            var elementWidth = element.width();
            var deltaWidth = parseFloat(deltaX);
            var currentWidth = styleWidth !== "" ? parseFloat(styleWidth) : 0;
            var constrainedWidth;

            if (currentWidth < elementWidth) {
                currentWidth = elementWidth;
            }

            constrainedWidth = constrain({
                value: currentWidth + deltaWidth,
                min: that.options.min,
                max: element.parent().outerWidth()
            });

            element.width(constrainedWidth);
        },

        showResizeHandles: function() {
            var that = this;

            //table resizing is natively supported in IE and Firefox
            if (!browser.msie && !browser.mozilla) {
                that._initResizeHandles();
                that._showResizeHandles();
            }
        },

        _initResizeHandles: function() {
            var that = this;
            var options = that.options;
            var resizeHandles = that.options.handles;
            var length = resizeHandles.length;
            var i;

            if (that.handles.length > 0) {
                return;
            }

            for (i = 0; i < length; i++) {
                that.handles.push(new TableResizeHandle(extend({
                    appendTo: options.rootElement,
                    resizableElement: that.element
                }, resizeHandles[i])));
            }

            that._bindToResizeHandlesEvents();
        },

        _destroyResizeHandles: function() {
            var that = this;
            var length = that.handles ? that.handles.length : 0;

            for (var i = 0; i < length; i++) {
                that.handles[i].destroy();
            }
        },

        _showResizeHandles: function() {
            var that = this;
            var handles = that.handles || [];
            var length = handles.length;
            var i;

            for (i = 0; i < length; i++) {
                that.handles[i].show();
            }
        },

        _bindToResizeHandlesEvents: function() {
            var that = this;
            var handles = that.handles || [];
            var length = handles.length;
            var i;

            for (i = 0; i < length; i++) {
                that.handles[i].bind(DRAG, proxy(that.resize, that));
            }
        }
    });

    extend(Editor, {
        TableResizing: TableResizing
    });

})(window.kendo);

}, typeof define == 'function' && define.amd ? define : function(a1, a2, a3){ (a3 || a2)(); });
