let AC_Game_Object = [] ;
export class AcGameObject {
        constructor() {
                AC_Game_Object.push(this) ;

                this.has_called = false ;
                this.time_delta = 0 ;
        }

        start() {

                }

        update() {

                }

        on_destroy() {

                }

        destroy() {
                this.on_destroy() ;
                    
                for(let i = 0 ; i < AC_Game_Object.length ; i ++) {
                        if(AC_Game_Object[i] === this) {
                                AC_Game_Object.splice(i, 1) ;
                                break ;
                        }
                }
        }

        
}

let last_timestamp ;
let AC_ANIMATION = function(timestamp) {
        for(let i = 0 ; i < AC_Game_Object.length ; i ++) {
                let obj = AC_Game_Object[i] ;
            if(!obj.has_called) {
                        obj.has_called = true ;
                        obj.start() ;
                }else {
                        obj.update() ;
                        obj.time_delta = timestamp - last_timestamp ;
                }
        }

        last_timestamp = timestamp ;
        requestAnimationFrame(AC_ANIMATION)        
}

requestAnimationFrame(AC_ANIMATION) 
