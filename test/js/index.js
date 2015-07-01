/**
 * Created by TD on 2015-06-20.
 */
$(function(){
   SlideMgr.setConfig({
       container : $('.canvas_test').get(0),
       start : 7,
       end : 100,
       prefix : 'img/slide/Journey.To.The.Edge.Of.The.Universe.2008.720p.BluRay.x264-REQ [PublicHD].avi-',
       extendType : 'jpg',
       scrollColor : 'white',
       render_interval : 30,
       animate_interval : 10,
       callback : function(){

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

           SlideMgr.addText({
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
           });

       }
   });




    /*SlideMgr.addElement({
        innerHTML : 'test1 </br> test2',
        show_frame : 1,
        hide_frame : 30,
        attr : {
            left : '20px',
            top : '30px',
            color : 'white'
        }
    });

    SlideMgr.addElement({
        innerHTML : 'My Vision.......</br> is work together',
        show_frame : 35,
        hide_frame : 65,
        attr : {
            fontSize : '15pt',
            color : 'white',
            left : '300px',
            top : '300px'
        }
    });

    SlideMgr.addElement({
        innerHTML : 'My hobby....</br> etc1...... Blah Blah~~ </br> OMG!!',
        show_frame : 45,
        hide_frame : 75,
        attr : {
            fontSize : '12pt',
            color : 'white',
            left : '600px',
            top : '400px'
        }
    });*/

});