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

    img : null,
    img_container : [],

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

    animate_interval : null,
    animate_queue : [],
    _fn_animate : {},

    ele_container : [],
    ele_counter : null,
    ele_id_prefix : '-osi-el-'

};

(function(window, document, SlideMgr){

    SlideMgr.setConfig = function(cfg){

        //analyze container attribute
        var container_width = Number(getStyle(cfg.container, 'width').match(/\d+/g));
        var container_height = Number(getStyle(cfg.container, 'height').match(/\d+/g));
        SlideMgr.container.ele = cfg.container;
        SlideMgr.container.width = container_width;
        SlideMgr.container.height = container_height;

        /*if(cfg.start && cfg.end && cfg.prefix && cfg.extendType){
            console.log('open-slide-image.js) Not valid parameter!');
            throw 'open-slide-image.js) Not valid parameter!';
        }*/

        SlideMgr.start = cfg.start;
        SlideMgr.end = cfg.end;
        SlideMgr.prefix = cfg.prefix;
        SlideMgr.extendType = cfg.extendType;

        SlideMgr.render_interval = cfg.render_interval ? cfg.render_interval : 50;
        SlideMgr.animate_interval = cfg.animate_interval ? cfg.animate_interval : 10;

        SlideMgr.initialize(cfg);
    };

    /**
     * initialize method
     */
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
/*                var y = (event.clientY - SlideMgr.container.ele.documentOffsetTop) + (SlideMgr.scroll.clicked_offset - SlideMgr.scroll.height/2);
                var current_frame;

                if(y < (SlideMgr.scroll.height / 2)){
                    current_frame = 0;
                }else if(y > (SlideMgr.container.height - SlideMgr.scroll.height / 2)){
                    current_frame = SlideMgr.end;
                }else{
                    var translate_ratio = (SlideMgr.container.height - SlideMgr.scroll.height) / (SlideMgr.end - SlideMgr.start);
                    current_frame = y / translate_ratio;
                    current_frame = current_frame > SlideMgr.end ? SlideMgr.end: current_frame;
                }

                SlideMgr.current_frame = Math.floor(current_frame);

                SlideMgr.moveScroll();*/

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

                //SlideMgr.moveScroll();
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

            //SlideMgr.render();
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
        SlideMgr.img_container.push(img);

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
        //SlideMgr.container.ele.appendChild(percent);

    };

    SlideMgr._load_chain = function(idx, callback){

        var percent = Math.floor(idx/SlideMgr.end * 100);

        if(idx <= SlideMgr.end){
            var img = new Image();
            img.src = SlideMgr.prefix + idx + '.' + SlideMgr.extendType;
            img.onload = (function(idx, callback){
                SlideMgr.renewPercent(percent);
                //SlideMgr._load_chain(idx + 1, callback);
                //SlideMgr.canvas.context2d.drawImage(img, 0,0,SlideMgr.container.width,SlideMgr.container.height);
                SlideMgr.render_queue.push(idx);
                setTimeout(SlideMgr._load_chain, 10, idx + 1, callback);
            })(idx, callback);
            SlideMgr.img_container.push(img);
        }else{
            //SlideMgr.container.ele.removeChild(document.getElementsByClassName('blocker')[0]);
            //SlideMgr.canvas.context2d.drawImage(SlideMgr.img_container[0], 0,0,SlideMgr.container.width,SlideMgr.container.height);
            SlideMgr.render_queue.push(SlideMgr.start);
            SlideMgr._fn_animate.hide(document.getElementsByClassName('blocker')[0], 1000);
            if(callback) callback();
        }

    };

    SlideMgr.addElement = function(obj){
        var node = {};
        var attr = obj.attr;
        node.ele = document.createElement('div');
        node.show_frame = obj.show_frame ? obj.show_frame : 0;
        node.hide_frame = obj.hide_frame ? obj.hide_frame : 0;
        node._s_flag = false;
        for(var key in attr){
            if(key){
                if(key == 'left') node.ele.style.left = SlideMgr.container.ele.documentOffsetLeft + attr[key];
                else if(key == 'top') node.ele.style.top = SlideMgr.container.ele.documentOffsetTop + attr[key];
                else node.ele.style[key] = attr[key];
            }
        }
        node.ele.style.position = 'absolute';
        node.ele.style.display = 'none';
        node.ele.id = SlideMgr.ele_id_prefix + SlideMgr.ele_counter++;
        node.ele.innerHTML = obj.innerHTML;

        SlideMgr.ele_container.push(node);
        SlideMgr.container.ele.appendChild(node.ele);
    };

    SlideMgr.manageElement = function(){
        var len = SlideMgr.ele_container.length;
        for(var i = 0; i<len; i++){
            var node = SlideMgr.ele_container[i];
            if(SlideMgr.current_frame >= node.show_frame && SlideMgr.current_frame < node.hide_frame && !node._s_flag){
                SlideMgr._fn_animate.show(node.ele, 1000);
                node._s_flag = true;
                console.log('show : ' + node.ele.id);
            }else if((SlideMgr.current_frame < node.show_frame || SlideMgr.current_frame >= node.hide_frame) && node._s_flag){
                SlideMgr._fn_animate.hide(node.ele, 1000);
                node._s_flag = false;
                console.log('hide : ' + node.ele.id);
            }
        }
    };

    SlideMgr.render = function(){
        if(SlideMgr.render_queue[0]){
            SlideMgr.canvas.context2d.drawImage(SlideMgr.img_container[SlideMgr.render_queue[0] - SlideMgr.start], 0,0,SlideMgr.container.width,SlideMgr.container.height);
            SlideMgr.render_queue.splice(0,1);
        }
    };

    SlideMgr.animate = function(){
        if(SlideMgr.animate_queue[0]){
            (function(job){
                var len = job.length;
                var i = 0;
                var interval_id = setInterval(function(){
                    if(i == len){
                        clearInterval(interval_id);
                    }else{
                        var ele = job[i].ele;
                        var attr = job[i].attr;
                        for(var key in attr){
                            ele.style[key] = attr[key];
                        }
                        i++;
                    }
                }, SlideMgr.animate_interval);
                SlideMgr.animate_queue.splice(0,1);
            })(SlideMgr.animate_queue[0]);

            /*
            var ele = SlideMgr.animate_queue[0].ele;
            var attr = SlideMgr.animate_queue[0].attr;
            for(var key in attr){
                if(key){
                    ele.style[key] = attr[key];
                }
            }*/
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
        //var top = (SlideMgr.current_frame - SlideMgr.start) * SlideMgr.scroll.height;
        SlideMgr.scroll.ele.style.top = top + 'px';

    };

    SlideMgr.renewPercent = function(percent){
        if(SlideMgr.load_info.ele_percent){
            SlideMgr.load_info.ele_percent.innerHTML = percent + '%';
        }
    };

    //animation function
    //--------------------------------------------------------------------------
    var _fn = SlideMgr._fn_animate;

    _fn.show = function(ele, time){
        /*var interval = SlideMgr.animate_interval;
        var init_value = Number(ele.style.opacity);
        var limit = Math.ceil(time / interval);
        var unit_value = (1.0 - init_value) / (time / interval);
        for(var i = 0; i<=limit; i++){
            SlideMgr.animate_queue.push({
                ele : ele,
                attr : {
                    opacity : init_value + i * unit_value
                }
            });
            if( (init_value + i * unit_value) > 1.0) break;
            //ele.style.opacity = init_value + i * unit_value;
        }*/
        var limit = Math.ceil(time / SlideMgr.animate_interval);
        var unit = 1.0 / limit;
        var job = [];

        job.push({
            ele : ele,
            attr : {
                display : ''
            }
        });
        /*SlideMgr.animate_queue.push({
            ele : ele,
            attr : {
                display : ''
            }
        });*/

        for(var i = 0; i<= limit ; i++){
            var opacity = unit * i;
            opacity = opacity <= 1.0 ? opacity : 1.0;
            job.push({
                ele : ele,
                attr : {
                    opacity : opacity
                }
            });
            /*SlideMgr.animate_queue.push({
                ele : ele,
                attr : {
                    opacity : opacity
                }
            });*/
        }
        SlideMgr.animate_queue.push(job);
    };

    _fn.hide = function(ele, time){
        /*var interval = SlideMgr.animate_interval;
        var init_value = Number(ele.style.opacity);
        var limit = Math.ceil(time / interval);
        var unit_value = ( - init_value) / (time / interval);

        console.log(limit);

        for(var i = 0; i<=limit; i++){
            SlideMgr.animate_queue.push({
                ele : ele,
                opacity : init_value + i * unit_value
            });
            if( (init_value + i * unit_value) < 0) break;
        }*/
        var limit = Math.ceil(time / SlideMgr.animate_interval);
        var unit = -1.0 / limit;
        var job = [];

        for(var i = 0; i<= limit ; i++){
            var opacity = 1.0 + unit * i;
            opacity = opacity > 0 ? opacity : 0;
            /*SlideMgr.animate_queue.push({
                ele : ele,
                attr : {
                    opacity : opacity
                }
            });*/
            job.push({
                ele : ele,
                attr : {
                    opacity : opacity
                }
            });
        }
        job.push({
            ele : ele,
            attr : {
                display : 'none'
            }
        });
        /*SlideMgr.animate_queue.push({
            ele : ele,
            attr : {
                display : 'none'
            }
        });*/
        SlideMgr.animate_queue.push(job);
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
