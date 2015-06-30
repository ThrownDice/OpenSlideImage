/**
 * Created by TD on 2015-06-20.
 */
$(function(){
   SlideMgr.setConfig({
       container : $('.canvas_test').get(0),
       start : 7,
       end : 100,
       prefix : 'img/Journey.To.The.Edge.Of.The.Universe.2008.720p.BluRay.x264-REQ [PublicHD].avi-',
       extendType : 'jpg',
       scrollColor : 'white',
       render_interval : 30,
       animate_interval : 10,
       callback : function(){

           SlideMgr.addText({
               show_frame : 10,
               hide_frame : 50,
               animate_frame : 10,
               text : 'My Vision',
               font : '30px Georgia',
               x : 100,
               y : 100
           });

           SlideMgr.addText({
               show_frame : 40,
               hide_frame : 70,
               animate_frame : 10,
               text : 'is co-working',
               font : '30px Georgia',
               x : 200,
               y : 200
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