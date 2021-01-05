var title = document.getElementById('title');
<<<<<<< HEAD
console.log('hfjdksh')
title.classList.add('title');
=======
>>>>>>> 6a64b5f02929cfec926120b3f0cc0b496b4af137

document.addEventListener("DOMContentLoaded", function(event) { 
    function callback(){
        // title.classList.remove('title');
        // title.classList.add('title1');
        setInterval(() => {
            if (title.classList.contains('title1')){
                title.classList.remove('title1');
                title.classList.add('title');
            }else{
                title.classList.remove('title');
                title.classList.add('title1');
            }
        },2000);
    }
    
    callback();    
<<<<<<< HEAD
});
=======
});
>>>>>>> 6a64b5f02929cfec926120b3f0cc0b496b4af137
