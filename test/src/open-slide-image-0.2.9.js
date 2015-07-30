/**
 About License
 **/
var SlideMgr = {

    container : {
        ele : null,
        width : null,
        height : null
    },
    canvas : {
        context2d : null,
        ele : null
    },

    start : null,
    end : null,
    prefix : null,
    extendType : null,

    current_frame : null,

    frame_container : [],

    scroll : {
        clicked : null,
        clicked_offset : null,
        position : null,
        width : null,
        height : null,
        background : null,
        cursor : null,
        ele : null
    },

    render_interval : null,
    render_queue : [],

    load_info : {
        ele_blocker : null,
        ele_percent : null
    },

    layer_counter : null,
    layer_type : {
        TEXT : 'text',
        IMG : 'img'
    },

    util : {},

    img_manager : {
        img_container : []
    },

    move_elapse : 50

};

(function(window, document, SlideMgr){

    SlideMgr.setConfig = function(cfg){
        var container_width = Number(SlideMgr.util.getStyle(cfg.container, 'width').match(/(?:\d*\.)?\d+/));
        var container_height = Number(SlideMgr.util.getStyle(cfg.container, 'height').match(/(?:\d*\.)?\d+/));
        SlideMgr.container.ele = cfg.container;
        SlideMgr.container.width = container_width;
        SlideMgr.container.height = container_height;
        SlideMgr.start = cfg.start;
        SlideMgr.end = cfg.end;
        SlideMgr.prefix = cfg.prefix;
        SlideMgr.extendType = cfg.extendType;
        SlideMgr.render_interval = cfg.render_interval ? cfg.render_interval : 50;
        SlideMgr.animate_interval = cfg.animate_interval ? cfg.animate_interval : 10;
        SlideMgr.initialize(cfg);
    };

    SlideMgr.initialize = function(cfg){
        var canvas = document.createElement('canvas');
        canvas.setAttribute('width', SlideMgr.container.width);
        canvas.setAttribute('height', SlideMgr.container.height);
        canvas.style.float = 'left';
        canvas.style.position = 'relative';
        SlideMgr.canvas.ele = canvas;
        SlideMgr.canvas.context2d = canvas.getContext('2d');
        SlideMgr.container.ele.appendChild(canvas);
        SlideMgr.current_frame = SlideMgr.start;
        SlideMgr.ele_counter = 0;
        SlideMgr.createScroll({
            color : cfg.scrollColor
        });

        document.addEventListener('mousemove', function(event){
            if(SlideMgr.scroll.clicked){
                var y = (event.clientY - SlideMgr.container.ele._osi_documentOffsetTop) - SlideMgr.scroll.clicked_offset;
                var translate_ratio = (SlideMgr.end - SlideMgr.start) / (SlideMgr.container.height - SlideMgr.scroll.height);
                var current_frame;
                if(y < 0) y = 0;
                else if(y > (SlideMgr.container.height - SlideMgr.scroll.height)) y = (SlideMgr.container.height - SlideMgr.scroll.height);
                current_frame = Math.floor(y * translate_ratio) + SlideMgr.start;
                SlideMgr.scroll.ele.style.top = y + 'px';
                SlideMgr.current_frame = current_frame;
                SlideMgr.render_queue.splice(0, SlideMgr.render_queue.length);
                SlideMgr.render_queue.push(current_frame);
                SlideMgr.manageElement();
            }
        });

        document.addEventListener('mouseup', function(){
            SlideMgr.scroll.clicked = false;
        });

        /*SlideMgr.container.ele.addEventListener('resize', function(){
            console.log('container resize');
        });*/
        SlideMgr.container.ele.onresize = function(){
            console.log('container resize');
        }

        _osi_addWheelListener(SlideMgr.container.ele, function(event){
            if((SlideMgr.current_frame <= SlideMgr.end) && (SlideMgr.current_frame >= SlideMgr.start)){
                event.deltaY > 0 ? SlideMgr.current_frame++ : SlideMgr.current_frame--;
                if(SlideMgr.current_frame > SlideMgr.end) SlideMgr.current_frame = SlideMgr.end;
                if(SlideMgr.current_frame < SlideMgr.start) SlideMgr.current_frame = SlideMgr.start;
            }
            SlideMgr.render_queue.push(SlideMgr.current_frame);
            SlideMgr.moveScroll();
            SlideMgr.manageElement();
        });

        SlideMgr.load(cfg.callback);

        setInterval(SlideMgr.render, SlideMgr.render_interval);
        setInterval(SlideMgr.animate, SlideMgr.animate_interval);
        //requestAnimationFrame(SlideMgr.render);
        //requestAnimationFrame(SlideMgr.animate);
    };

    SlideMgr.move = function(frame_number){
        var dy = frame_number > SlideMgr.current_frame ? 1 : -1;
        var i = SlideMgr.current_frame + dy;

        /*(function(fnum){
            var translate_ratio = (SlideMgr.container.height - SlideMgr.scroll.height) / (SlideMgr.end - SlideMgr.start);
            var top = (frame_number - SlideMgr.start) * translate_ratio;
            var a =  -3 * (Number(SlideMgr.scroll.ele.style.top.match(/(?:\d*\.)?\d+/)) - top) / SlideMgr.move_elapse;
            var i = 0;
            var ntop = top;
            var _move = function(){
                if( i == SlideMgr.move_elapse){
                    SlideMgr.scroll.ele.style.top = top;
                }else{
                    ntop += (a) * i * i;
                    SlideMgr.scroll.ele.style.top = ntop + 'px';
                    i++;
                    requestAnimationFrame(_move);
                }
                console.log(SlideMgr.scroll.ele.style.top);
            };
            requestAnimationFrame(_move);
        })(frame_number);*/

        (function(fnum){
            var translate_ratio = (SlideMgr.container.height - SlideMgr.scroll.height) / (SlideMgr.end - SlideMgr.start);
            var ntop = (fnum - SlideMgr.start) * translate_ratio; //new top position
            var otop = Number(SlideMgr.scroll.ele.style.top.match(/(?:\d*\.)?\d+/)); //old top position
            var unit = (ntop - otop) / SlideMgr.move_elapse;
            var i = 0;

            console.log('fitst : ' + ntop);
            console.log('first : ' + otop);

            var _move = function(){
                if( i == SlideMgr.move_elapse){
                    SlideMgr.scroll.ele.style.top = ntop + 'px';
                }else{
                    console.log('otop : ' + otop);
                    console.log('unit : ' + unit);
                    console.log('i : ' + i);
                    console.log((otop + unit * i) + 'px');
                    SlideMgr.scroll.ele.style.top = (otop + unit * i) + 'px';
                    i++;
                    setTimeout(_move, 5);
                    //requestAnimationFrame(_move);
                }
            };
            //requestAnimationFrame(_move);
            setTimeout(_move, 50);
        })(frame_number);

        for(; i!=frame_number; i+=dy){
            SlideMgr.render_queue.push(i);
            SlideMgr.current_frame = i;
        }

    };

    SlideMgr.load = function(callback){
        var blocker = document.createElement('div');
        var percent = document.createElement('div');
        var img = new Image();
        img.src = SlideMgr.prefix + SlideMgr.start + '.' + SlideMgr.extendType;
        img.onload = (function(idx, callback){
            SlideMgr._load_chain(idx + 1, callback);
        })(SlideMgr.start, callback);
        var frame = {};
        frame.img = img;
        frame.ele_container = [];
        frame.events = [];
        SlideMgr.frame_container.push(frame);

        blocker.style.background = 'black';
        blocker.style.width = SlideMgr.container.width + 'px';
        blocker.style.height = SlideMgr.container.height + 'px';
        blocker.style.position = 'absolute';
        blocker.style.left = SlideMgr.container.ele._osi_documentOffsetLeft + 'px';
        blocker.style.top = SlideMgr.container.ele._osi_documentOffsetTop + 'px';
        blocker.setAttribute('class', 'blocker');

        percent.style.color = 'white';
        percent.style.fontSize = '10pt';
        percent.style.textAlign = 'center';
        percent.style.lineHeight = SlideMgr.container.height + 'px';

        SlideMgr.load_info.ele_blocker = blocker;
        SlideMgr.load_info.ele_percent = percent;

        blocker.appendChild(percent);
        SlideMgr.container.ele.appendChild(blocker);
    };

    SlideMgr._load_chain = function(idx, callback){
        var percent = Math.floor(idx/SlideMgr.end * 100);

        if(idx <= SlideMgr.end){
            var img = new Image();
            img.src = SlideMgr.prefix + idx + '.' + SlideMgr.extendType;
            img.onload = (function(idx, callback){
                SlideMgr.renewPercent(percent);
                SlideMgr.render_queue.push(idx);
                setTimeout(SlideMgr._load_chain, 10, idx + 1, callback);
            })(idx, callback);
            var frame = {};
            frame.img = img;
            frame.ele_container = [];
            frame.events = [];
            SlideMgr.frame_container.push(frame);
        }else{
            SlideMgr.render_queue.push(SlideMgr.start);
            (function(){
                var opacity = 1.0;
                var blocker = document.getElementsByClassName('blocker')[0];
                var animate = function(){
                    if(opacity > 0){
                        opacity = opacity - 0.01;
                        blocker.style.opacity = opacity;
                        requestAnimationFrame(animate);
                    }else{
                        blocker.style.display = 'none';
                    }
                };
                requestAnimationFrame(animate);
            })();
            if(callback) callback();
        }
    };

    SlideMgr.addText = function(cfg){
        var showAt = cfg.show.at;
        var showAnimationFrame = cfg.show.animationFrame;
        var sx = cfg.show.sx;
        var sy = cfg.show.sy;
        var sOpacity = cfg.show.opacity;

        var hideAt = cfg.hide.at;
        var hideAnimationFrame = cfg.hide.animationFrame;
        var ex = cfg.hide.ex;
        var ey = cfg.hide.ey;
        var eOpacity = cfg.hide.opacity;

        var x = cfg.x;
        var y = cfg.y;
        var rgb = cfg.rgb;
        var fontSize = cfg.fontSize;
        var fontFamily = cfg.fontFamily;
        var text = cfg.text;
        var opacity = cfg.opacity ? cfg.opacity : 1.0;

        /* calculate show animation
        --------------------------------------------*/
        var ston = {}; // configuration object start to normal
        ston.unitX = (x - sx) / showAnimationFrame;
        ston.unitY = (y - sy) / showAnimationFrame;
        ston.unitOpacity = (opacity - sOpacity) / showAnimationFrame;

        /* calculate hide animation
         --------------------------------------------*/
        var ntoe = {}; //configuration object normal to end
        ntoe.unitX = (ex - x) / hideAnimationFrame;
        ntoe.unitY = (ey - y) / hideAnimationFrame;
        ntoe.unitOpacity = (eOpacity - opacity) / hideAnimationFrame;

        var showEnd = showAt + showAnimationFrame;
        var hideEnd = hideAt + hideAnimationFrame;

        var layerId = SlideMgr.layer_counter++;

        //show animation
        for(var i = showAt; i<showEnd; i++){
            var _s_opacity = sOpacity + ston.unitOpacity * (i - showAt);
            var _s_layer = {
                id : layerId,
                type : SlideMgr.layer_type.TEXT,
                text : text,
                font : fontSize + ' ' + fontFamily,
                x : sx + ston.unitX * (i - showAt),
                y : sy + ston.unitY * (i - showAt),
                rgba : 'rgba(' + rgb + ',' + _s_opacity + ')'
            };
            if(SlideMgr.frame_container[i - SlideMgr.start]) SlideMgr.frame_container[i - SlideMgr.start].ele_container.push(_s_layer);
        }

        //normal condition
        var normalLayer = {
            id : layerId,
            type : SlideMgr.layer_type.TEXT,
            text : text,
            x : x,
            y : y,
            font : fontSize + ' ' + fontFamily,
            rgba : 'rgba(' + rgb + ',' + opacity + ')'
        };
        for(var j = showEnd; j<hideAt; j++){
            if(SlideMgr.frame_container[j - SlideMgr.start]) SlideMgr.frame_container[j - SlideMgr.start].ele_container.push(normalLayer);
        }

        //hide animation
        for(var k = hideAt; k<hideEnd; k++){
            var _e_opacity = opacity + ntoe.unitOpacity * (k - hideAt);
            var _e_layer = {
                id : layerId,
                type : SlideMgr.layer_type.TEXT,
                text : text,
                font : fontSize + ' ' + fontFamily,
                x : x + ntoe.unitX * (k - hideAt),
                y : y + ntoe.unitY * (k - hideAt),
                rgba : 'rgba(' + rgb + ',' + _e_opacity + ')'
            };
            if(SlideMgr.frame_container[k - SlideMgr.start]) SlideMgr.frame_container[k - SlideMgr.start].ele_container.push(_e_layer);
        }

    };

    SlideMgr.addImage = function(cfg){

        var img = SlideMgr.img_manager.getImage(cfg.src);

        var showAt = cfg.show.at;
        var showAnimationFrame = cfg.show.animationFrame;
        var sx = cfg.show.sx;
        var sy = cfg.show.sy;
        var sOpacity = cfg.show.opacity;

        var hideAt = cfg.hide.at;
        var hideAnimationFrame = cfg.hide.animationFrame;
        var ex = cfg.hide.ex;
        var ey = cfg.hide.ey;
        var eOpacity = cfg.hide.opacity;

        var x = cfg.x;
        var y = cfg.y;
        var opacity = cfg.opacity ? cfg.opacity : 1.0;

        /* calculate show animation
         --------------------------------------------*/
        var ston = {}; // configuration object start to normal
        ston.unitX = (x - sx) / showAnimationFrame;
        ston.unitY = (y - sy) / showAnimationFrame;
        ston.unitOpacity = (opacity - sOpacity) / showAnimationFrame;

        /* calculate hide animation
         --------------------------------------------*/
        var ntoe = {}; //configuration object normal to end
        ntoe.unitX = (ex - x) / hideAnimationFrame;
        ntoe.unitY = (ey - y) / hideAnimationFrame;
        ntoe.unitOpacity = (eOpacity - opacity) / hideAnimationFrame;

        var showEnd = showAt + showAnimationFrame;
        var hideEnd = hideAt + hideAnimationFrame;

        var layerId = SlideMgr.layer_counter++;

        //show animation
        for(var i = showAt; i<showEnd; i++){
            var _s_opacity = sOpacity + ston.unitOpacity * (i - showAt);
            var _s_layer = {
                id : layerId,
                type : SlideMgr.layer_type.IMG,
                img : img,
                x : sx + ston.unitX * (i - showAt),
                y : sy + ston.unitY * (i - showAt),
                opacity : _s_opacity
            };
            if(SlideMgr.frame_container[i - SlideMgr.start]) SlideMgr.frame_container[i - SlideMgr.start].ele_container.push(_s_layer);
        }

        //normal condition
        var normalLayer = {
            id : layerId,
            type : SlideMgr.layer_type.IMG,
            img : img,
            x : x,
            y : y,
            opacity : opacity
        };
        for(var j = showEnd; j<hideAt; j++){
            if(SlideMgr.frame_container[j - SlideMgr.start]) SlideMgr.frame_container[j - SlideMgr.start].ele_container.push(normalLayer);
        }

        //hide animation
        for(var k = hideAt; k<hideEnd; k++){
            var _e_opacity = opacity + ntoe.unitOpacity * (k - hideAt);
            var _e_layer = {
                id : layerId,
                type : SlideMgr.layer_type.IMG,
                img : img,
                x : x + ntoe.unitX * (k - hideAt),
                y : y + ntoe.unitY * (k - hideAt),
                opacity : _e_opacity
            };
            if(SlideMgr.frame_container[k - SlideMgr.start]) SlideMgr.frame_container[k - SlideMgr.start].ele_container.push(_e_layer);
        }

    };

    SlideMgr.addEvent = function(frame_number, callback){
        SlideMgr.frame_container[frame_number].events.push(callback);
    };


    SlideMgr.manageElement = function(){

    };

    SlideMgr.render = function(){
        if(SlideMgr.render_queue[0]){
            var frame = SlideMgr.frame_container[SlideMgr.render_queue[0] - SlideMgr.start];
            var ele_container = frame.ele_container;
            var events = frame.events;
            var el_len = ele_container.length;
            var ev_len = events.length;
            SlideMgr.canvas.context2d.drawImage(frame.img, 0,0,SlideMgr.container.width,SlideMgr.container.height);

            for(var i = 0; i<el_len; i++){
                var layer = ele_container[i];
                switch(layer.type){
                    case SlideMgr.layer_type.TEXT :
                        SlideMgr.canvas.context2d.font = layer.font;
                        SlideMgr.canvas.context2d.fillStyle = layer.rgba;

                        //test
                        SlideMgr.canvas.context2d.shadowBlur = 10;
                        SlideMgr.canvas.context2d.shadowColor = "white";

                        SlideMgr.canvas.context2d.fillText(layer.text, layer.x, layer.y);
                        break;
                    case SlideMgr.layer_type.IMG :
                        if(layer.img){
                            SlideMgr.canvas.context2d.globalAlpha = layer.opacity;
                            SlideMgr.canvas.context2d.drawImage(layer.img, layer.x, layer.y);
                            SlideMgr.canvas.context2d.globalAlpha = 1.0;
                        }
                        break;
                }
            }

            for(var j = 0; j<ev_len; j++){
                if(events[j]) events[j]();
            }

            SlideMgr.render_queue.splice(0,1);
        }
    };

    SlideMgr.createScroll = function(opt){
        var color = opt.color ? opt.color : 'black';
        var frameCount = SlideMgr.end - SlideMgr.start + 1;
        var container_width = SlideMgr.container.width;
        var container_height = SlideMgr.container.height;
        var scrollHeight = container_height / frameCount;
        var scrollWidth = 10;
        var scroll = document.createElement('div');

        scrollHeight = scrollHeight < 50 ? 50 : scrollHeight;

        scroll.style.position = 'relative';
        scroll.style.width = scrollWidth + 'px';
        scroll.style.height = scrollHeight + 'px';
        scroll.style.background = color;
        scroll.style.cursor = 'pointer';
        scroll.style.left = (container_width - scrollWidth) + 'px';
        scroll.style.top = 0;

        SlideMgr.scroll.position = 'relative';
        SlideMgr.scroll.width = scrollWidth;
        SlideMgr.scroll.height = scrollHeight;
        SlideMgr.scroll.background = color;
        SlideMgr.scroll.cursor = 'pointer';
        SlideMgr.scroll.ele = scroll;

        scroll.onmousedown = function(event){
            SlideMgr.scroll.clicked_offset = event.clientY - SlideMgr.container.ele._osi_documentOffsetTop - SlideMgr.scroll.ele._osi_documentOffsetTop;
            SlideMgr.scroll.clicked = true;
        };

        SlideMgr.container.ele.appendChild(scroll);

    };

    SlideMgr.moveScroll = function(){
        var translate_ratio = (SlideMgr.container.height - SlideMgr.scroll.height) / (SlideMgr.end - SlideMgr.start);
        var top = (SlideMgr.current_frame - SlideMgr.start) * translate_ratio;
        SlideMgr.scroll.ele.style.top = top + 'px';
    };

    SlideMgr.renewPercent = function(percent){
        if(SlideMgr.load_info.ele_percent){
            SlideMgr.load_info.ele_percent.innerHTML = percent + '%';
        }
    };

    SlideMgr.img_manager.getImage = function(src){
        var len = SlideMgr.img_manager.img_container.length;
        for(var i=0; i<len ; i++){
            if(SlideMgr.img_manager.img_container[i].src === src) return SlideMgr.img_manager.img_container[i].img;
        }
        return SlideMgr.img_manager.loadImage(src);
    };

    SlideMgr.img_manager.loadImage = function(src){
        var img = new Image();
        img.src = src;
        var el = {
            src : src,
            img : img
        };
        SlideMgr.img_manager.img_container.push(el);
        return img;
    };

    SlideMgr.resize = function(size){
        SlideMgr.container.ele.style.width = size.width;
        SlideMgr.container.ele.style.height = size.height;
        SlideMgr.container.width = size.width;
        SlideMgr.container.height = size.height;
        SlideMgr.render_queue.push(SlideMgr.current_frame);
    };

    //External Source
    //------------------------------------------------------------------------
    SlideMgr.util.getStyle = function (el, styleProp) {
        var value, defaultView = (el.ownerDocument || document).defaultView;
        if (defaultView && defaultView.getComputedStyle) {
            styleProp = styleProp.replace(/([A-Z])/g, "-$1").toLowerCase();
            return defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
        } else if (el.currentStyle) { // IE
            styleProp = styleProp.replace(/\-(\w)/g, function(str, letter) {
                return letter.toUpperCase();
            });
            value = el.currentStyle[styleProp];
            if (/^\d+(em|pt|%|ex)?$/i.test(value)) {
                return (function(value) {
                    var oldLeft = el.style.left, oldRsLeft = el.runtimeStyle.left;
                    el.runtimeStyle.left = el.currentStyle.left;
                    el.style.left = value || 0;
                    value = el.style.pixelLeft + "px";
                    el.style.left = oldLeft;
                    el.runtimeStyle.left = oldRsLeft;
                    return value;
                })(value);
            }
            return value;
        }
    };

    window.Object.defineProperty( Element.prototype, '_osi_documentOffsetTop', {
        get: function () {
            return this.offsetTop + ( this.offsetParent ? this.offsetParent._osi_documentOffsetTop : 0 );
        }
    } );

    window.Object.defineProperty( Element.prototype, '_osi_documentOffsetLeft', {
        get: function () {
            return this.offsetLeft + ( this.offsetParent ? this.offsetParent._osi_documentOffsetLeft : 0 );
        }
    } );

    var prefix = "", _addEventListener, onwheel, support;

    // detect event model
    if ( window.addEventListener ) {
        _addEventListener = "addEventListener";
    } else {
        _addEventListener = "attachEvent";
        prefix = "on";
    }

    // detect available wheel event
    support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
        document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
            "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox

    window._osi_addWheelListener = function( elem, callback, useCapture ) {
        _addWheelListener( elem, support, callback, useCapture );

        // handle MozMousePixelScroll in older Firefox
        if( support == "DOMMouseScroll" ) {
            _addWheelListener( elem, "MozMousePixelScroll", callback, useCapture );
        }
    };

    function _addWheelListener( elem, eventName, callback, useCapture ) {
        elem[ _addEventListener ]( prefix + eventName, support == "wheel" ? callback : function( originalEvent ) {
            !originalEvent && ( originalEvent = window.event );

            // create a normalized event object
            var event = {
                // keep a ref to the original event object
                originalEvent: originalEvent,
                target: originalEvent.target || originalEvent.srcElement,
                type: "wheel",
                deltaMode: originalEvent.type == "MozMousePixelScroll" ? 0 : 1,
                deltaX: 0,
                deltaZ: 0,
                preventDefault: function() {
                    originalEvent.preventDefault ?
                        originalEvent.preventDefault() :
                        originalEvent.returnValue = false;
                }
            };

            // calculate deltaY (and deltaX) according to the event
            if ( support == "mousewheel" ) {
                event.deltaY = - 1/40 * originalEvent.wheelDelta;
                // Webkit also support wheelDeltaX
                originalEvent.wheelDeltaX && ( event.deltaX = - 1/40 * originalEvent.wheelDeltaX );
            } else {
                event.deltaY = originalEvent.detail;
            }

            // it's time to fire the callback
            return callback( event );

        }, useCapture || false );
    }

})(window, document, SlideMgr);




