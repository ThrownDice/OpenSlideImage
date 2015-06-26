# OpenSlideImage
Lib for making canvas based slide image page

#Usage
Set configuration by using SlideMgr.setConfig method.
Add Element with option to adjust your purpose. (like frame number which is point of showing time of element)

#Example
```
SlideMgr.setConfig({
       container : container_element,
       start : 7,
       end : 100,
       prefix : 'img/my-img-',
       extendType : 'jpg',
       scrollColor : 'white',
       render_interval : 30,
       animate_interval : 10,
       callback : function(){

       }
});

SlideMgr.addElement({
        innerHTML : 'Hello World',
        show_frame : 1,
        hide_frame : 30,
        attr : {
            left : '20px',
            top : '30px',
            color : 'white'
        }
});
```
