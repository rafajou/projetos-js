function mover(elem, inicio, final, passo, callback){
    const novoInicio = inicio - passo;
    if(novoInicio >= final){
        elem.style.marginLeft = novoInicio + 'px';
        setTimeout(() => mover(elem,novoInicio, final, passo, callback), 7);
    }else {
        callback()
    }
     
}


//console.log(slides);

function slider(){
    elementos = document.querySelector('.slider').querySelectorAll('p');
    slides = Array.from(elementos);
    exibirSlide(slides, slides[0]);    
}

function exibirSlide(slides, slide){
    slide.style.display = 'block'
    const inicio = innerWidth
    const fim = -slide.clientWidth
    const passo = 5
    slide.style.marginLeft = inicio + 'px';
    mover(slide, inicio, fim, passo, () => {
        exibirSlide(slides, getProximo(slides, slide));   
    });
}

function getProximo(lista, atual){
    const i = lista.indexOf(atual) + 1;
    return i < lista.length ? lista[i] : lista[0];
    
}

slider();