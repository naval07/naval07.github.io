let title = document.getElementById('title');

title.classList.add('title');

function callback(){
    if (title.classList.contains('title1')){
        title.classList.remove('title1');
        title.classList.add('title');
    }
    if (title.classList.contains('title')){
        title.classList.remove('title');
        title.classList.add('title1');
    }
}

while (true){
    setTimeout(callback,2000);
}