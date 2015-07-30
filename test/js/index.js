/**
 * Created by TD on 2015-06-20.
 */
$(function(){
   SlideMgr.setConfig({
       container: $('.canvas_test').get(0),
       start: 6,
       end: 176,
       prefix: 'img/slide2/resume2.avi-',
       extendType: 'jpg',
       scrollColor: 'white',
       render_interval: 30,
       animate_interval: 10,
       callback: function () {

           SlideMgr.addText({
               show: {
                   at: 7,
                   animationFrame: 2,
                   sx: 100,
                   sy: 100,
                   opacity: 1.0
               },
               hide: {
                   at: 9,
                   animationFrame: 2,
                   ex: 100,
                   ey: -100,
                   opacity: 1.0
               },
               x: 100,
               y: 150,
               rgb: '255,255,255',
               opacity: 1.0,
               fontSize: '30px',
               fontFamily: 'Georgia',
               text: 'VISION'
           });

           SlideMgr.addText({
               show: {
                   at: 7,
                   animationFrame: 2,
                   sx: 100,
                   sy: 150,
                   opacity: 1.0
               },
               hide: {
                   at: 9,
                   animationFrame: 2,
                   ex: 100,
                   ey: -100,
                   opacity: 1.0
               },
               x: 100,
               y: 150,
               rgb: '255,255,255',
               opacity: 1.0,
               fontSize: '20px',
               fontFamily: 'Nanum Gothic Coding',
               text: '\uD55C\uAE00\uD14C\uC2A4\uD2B8'
           });
       }
   });

    //other src
    //-------------------------------------------------
    $('.test1').on('mousedown', function(){
        SlideMgr.move(50);
    });

    //compatibility IE9+
    $(window).resize(function(){
        SlideMgr.resize({
            width : window.innerWidth,
            height : window.innerHeight
        });
    });

});