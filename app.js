var template = '';
var paginator = 2;
const carrusel = document.querySelector('div.slider > div.carrusel');
const slider = document.querySelector('div.slider');
async function personas(pag = 1) {
    try {
        pag = pag * 4;
        const response = await fetch(`https://randomuser.me/api/?results=${pag}`);
        
        let res = await response.json();
        return res.results;
    } catch (error) {
        console.log(error)
    }    
}
async function consulta(pag) {
    let respuesta = await personas(pag);
    respuesta.forEach(element => {
        let fecha = element.registered.date.split('T');
        template += `<div class="element" style="background-image: url(${element.picture.large}); background-repeat: no-repeat; background-size: cover; backgroun-position: center center;">
        <h3>${element.name.first} ${element.name.last}</h3>
        <p>Nacio: ${fecha[0]}</p>                
        </div>`;
    });
    carrusel.innerHTML += template;
    template = ``;

}

consulta(paginator);
paginator++;

let sliderTimeOut;


slider.addEventListener('scroll', e => {
    
    if (e.target.scrollLeft >= (e.target.scrollWidth - e.target.clientWidth) - (e.target.clientWidth/2)) {
        clearTimeout(sliderTimeOut);
        sliderTimeOut = setTimeout(async () => {
            consulta(paginator);
            paginator++;
        }, 150);
    }
    
});
