# OpenSlideImage
Lib for making canvas based slide image page

#Usage
Set configuration by using SlideMgr.setConfig method.
Add Element with option to adjust your purpose. (like frame number which is point of showing time of element)

#Example
```javascript
SlideMgr.setConfig({
       container : $('.canvas_test').get(0),
       start : 7,
       end : 100,
       prefix : 'img/slideimg-',
       extendType : 'jpg',
       scrollColor : 'white',
       render_interval : 30,
       animate_interval : 10,
       callback : function(){

            //todo : after all img sets loaded

           SlideMgr.addText({
               show : {
                   at : 10,
                   animationFrame : 20,
                   sx : 100,
                   sy : 100,
                   opacity : 0.0
               },
               hide : {
                   at : 50,
                   animationFrame : 20,
                   ex : 200,
                   ey : 200,
                   opacity : 0.0
               },
               x : 150,
               y : 150,
               rgb : '255,255,255',
               opacity : 1.0,
               fontSize : '30px',
               fontFamily : 'Georgia',
               text : 'Hi! My Name is KANG JI HYEON'
           });

       }
   });
```
