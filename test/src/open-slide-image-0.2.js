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
    }


};

(function(window, document, SlideMgr){

    SlideMgr.setConfig = function(cfg){
        var container_width = Number(getStyle(cfg.container, 'width').match(/\d+/g));
        var container_height = Number(getStyle(cfg.container, 'height').match(/\d+/g));
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
                var y = (event.clientY - SlideMgr.container.ele.documentOffsetTop) - SlideMgr.scroll.clicked_offset;
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

        addWheelListener(SlideMgr.container.ele, function(event){
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
        SlideMgr.frame_container.push(frame);

        blocker.style.background = 'black';
        blocker.style.width = SlideMgr.container.width + 'px';
        blocker.style.height = SlideMgr.container.height + 'px';
        blocker.style.position = 'absolute';
        blocker.style.left = SlideMgr.container.ele.documentOffsetLeft + 'px';
        blocker.style.top = SlideMgr.container.ele.documentOffsetTop + 'px';
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
        var show_frame = cfg.show_frame - SlideMgr.start;
        var hide_frame = cfg.hide_frame - SlideMgr.start;
        var animate_frame = cfg.animate_frame;
        var layer_id = SlideMgr.layer_counter++;
        if( (show_frame > hide_frame) || ( (animate_frame * 2) > (hide_frame - show_frame) )){
            throw 'bound exception';
        }else{

            for(var i = show_frame ; i < hide_frame; i++){

                var layer = {};
                var opacity;
                layer.id = layer_id;
                layer.type = SlideMgr.layer_type.TEXT;
                layer.text = cfg.text;
                layer.x = cfg.x;
                layer.y = cfg.y;
                layer.font = cfg.font;

                if( (i >= show_frame) && (i < (show_frame + animate_frame))){
                    opacity = (1.0 / animate_frame) * (i - show_frame);
                }else if( ( i >= (show_frame + animate_frame) ) && ( i < (hide_frame - animate_frame))  ){
                    opacity = 1.0;
                }else if( ( i>= (hide_frame - animate_frame)) && (i < hide_frame)){
                    opacity = 1.0 - (1.0 / animate_frame) * (i - (hide_frame - animate_frame));
                }

                layer.rgba = 'rgba(255,255,255,' + opacity + ')';

                console.log(i);

                SlideMgr.frame_container[i].ele_container.push(layer);
            }
        }
    };

    SlideMgr.addImage = function(cfg){

    };

    SlideMgr.manageElement = function(){

    };

    SlideMgr.render = function(){
        if(SlideMgr.render_queue[0]){
            var frame = SlideMgr.frame_container[SlideMgr.render_queue[0] - SlideMgr.start];
            var ele_container = frame.ele_container;
            var len = ele_container.length;
            SlideMgr.canvas.context2d.drawImage(frame.img, 0,0,SlideMgr.container.width,SlideMgr.container.height);

            for(var i = 0; i<len; i++){

                var layer = ele_container[i];
                console.log(layer.type);
                console.log(layer.text);
                switch(layer.type){

                    case SlideMgr.layer_type.TEXT :
                        SlideMgr.canvas.context2d.font = layer.font;
                        SlideMgr.canvas.context2d.fillStyle = layer.rgba;
                        SlideMgr.canvas.context2d.fillText(layer.text, layer.x, layer.y);
                        console.log('drawing text : ' + layer.text);
                        break;
                }
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
            SlideMgr.scroll.clicked_offset = event.clientY - SlideMgr.container.ele.documentOffsetTop - SlideMgr.scroll.ele.documentOffsetTop;
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

})(window, document, SlideMgr);

//External Source
//------------------------------------------------------------------------
function getStyle(el, styleProp) {
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
}

window.Object.defineProperty( Element.prototype, 'documentOffsetTop', {
    get: function () {
        return this.offsetTop + ( this.offsetParent ? this.offsetParent.documentOffsetTop : 0 );
    }
} );

window.Object.defineProperty( Element.prototype, 'documentOffsetLeft', {
    get: function () {
        return this.offsetLeft + ( this.offsetParent ? this.offsetParent.documentOffsetLeft : 0 );
    }
} );
