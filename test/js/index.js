/**
 * Created by TD on 2015-06-20.
 */
$(function(){
   SlideMgr.setConfig({
       container : $('.canvas_test').get(0),
       start : 6,
       end : 176,
       prefix : 'img/slide2/resume2.avi-',
       extendType : 'jpg',
       scrollColor : 'white',
       render_interval : 30,
       animate_interval : 10,
       callback : function(){

           SlideMgr.addText({
               show : {
                   at : 7,
                   animationFrame : 2,
                   sx : 100,
                   sy : 100,
                   opacity : 1.0
               },
               hide : {
                   at : 9,
                   animationFrame : 2,
                   ex : 100,
                   ey : -100,
                   opacity : 1.0
               },
               x : 100,
               y : 150,
               rgb : '255,255,255',
               opacity : 1.0,
               fontSize : '30px',
               fontFamily : 'Georgia',
               text : 'VISION'
           });

           SlideMgr.addText({
               show : {
                   at : 7,
                   animationFrame : 2,
                   sx : 100,
                   sy : 150,
                   opacity : 1.0
               },
               hide : {
                   at : 9,
                   animationFrame : 2,
                   ex : 100,
                   ey : -100,
                   opacity : 1.0
               },
               x : 100,
               y : 150,
               rgb : '255,255,255',
               opacity : 1.0,
               fontSize : '20px',
               fontFamily : 'Nanum Gothic Coding',
               text : '\uD55C\uAE00\uD14C\uC2A4\uD2B8'
           });


           /*SlideMgr.addEvent(30, function(){
              console.log('30 fired');
           });

           SlideMgr.addEvent(60, function(){
               console.log('60 fired');
           });*/

           /*SlideMgr.addText({
               show : {
                   at : 10,
                   animationFrame : 30,
                   sx : 100,
                   sy : 100,
                   opacity : 0.0
               },
               hide : {
                   at : 40,
                   animationFrame : 30,
                   ex : 100,
                   ey : -100,
                   opacity : 1.0
               },
               x : 100,
               y : 150,
               rgb : '255,255,255',
               opacity : 1.0,
               fontSize : '30px',
               fontFamily : 'Georgia',
               text : 'Hi! My Name is KANG JI HYEON'
           });*/

           /*SlideMgr.addText({
               show : {
                   at : 10,
                   animationFrame : 40,
                   sx : 100,
                   sy : 100,
                   opacity : 0.0
               },
               hide : {
                   at : 60,
                   animationFrame : 40,
                   ex : 200,
                   ey : -100,
                   opacity : 1.0
               },
               x : 200,
               y : 100,
               rgb : '255,255,255',
               opacity : 1.0,
               fontSize : '30px',
               fontFamily : 'Georgia',
               text : 'Hi! My Name is KANG JI HYEON'
           });

           SlideMgr.addImage({
               show : {
                   at : 10,
                   animationFrame : 40,
                   sx : 200,
                   sy : 200,
                   opacity : 0.0
               },
               hide : {
                   at : 60,
                   animationFrame : 40,
                   ex : 300,
                   ey : -100,
                   opacity : 1.0
               },
               x : 300,
               y : 300,
               opacity : 1.0,
               src : 'img/test_img.jpg'
           });*/

       }
   });

    //other src
    //-------------------------------------------------
    $('.test1').on('mousedown', function(){
        SlideMgr.move(50);
    });


});