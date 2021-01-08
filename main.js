var title = document.getElementById('title');

console.log('hfjdksh')
title.classList.add('title');

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
});

