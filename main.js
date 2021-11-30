const recetasFav = document.getElementById("ul-fav")
const recetas = document.getElementById("recetas");
const busqueda = document.getElementById("busqueda");

getRandomReceta();
recorridoLS();

busqueda.addEventListener('click', async ()=>{
    const input = document.getElementById("input");
    recetas.innerHTML = " ";
    await getBusquedaReceta(input.value);
})

//Optiene e imprime receta random
async function getRandomReceta(){
    for (let i = 1; i < 5; i++) {
        let resp = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
        let respData = await resp.json();
        let randomReceta = respData.meals[0];   
         
        addRecetas(randomReceta);        
    }
};

//Optiene e imprime receta buscada
async function getBusquedaReceta(consulta){
    let resp = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s="+consulta);
    let respData = await resp.json();
    let receta = respData.meals;

    if (receta) {
        receta.forEach((receta) => {
            addRecetas(receta);                    
        });        
    }else{
        alert("No se encuentran resultados de "+consulta)
    }
}

//Optiene recetas por Id
async function getRecetabyId(idreceta){
    let resp = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i="+idreceta);
    let respData = await resp.json();
    let receta = respData.meals[0];
    return receta;
}

//Inserta en el Dom las tarjetas de las recetas
function addRecetas (recetain){
    let receta = document.createElement('div');
    receta.classList.add('card-recetas');    
    receta.innerHTML = `
                <div class="img-receta">
                    <img src="${recetain.strMealThumb}" alt="${recetain.strMeal}">                
                </div>
                <div class="pie-receta">
                    <h4>${recetain.strMeal}</h4>
                    <button class="fav-btn"><i class="fas fa-heart"></i></button>
                </div>
    `;
    
    const fav_btn = receta.querySelector(".pie-receta .fav-btn");
    fav_btn.addEventListener("click", ()=>{
        if (!fav_btn.classList.contains('active')) {            
            fav_btn.classList.add('active');            
            ActualizaLS(recetain.idMeal);   
            recorridoLS();
        }else{                        
            fav_btn.classList.remove('active');
            borrarLS(recetain.idMeal);
            recorridoLS();
        }        
    })
    recetas.appendChild(receta);
};

//Consigue las recetas con los id del LocalStorage
async function recorridoLS (){
    recetasFav.innerHTML = "";
    let LS = getLS();

        for (let i = 0; i < LS.length; i++) {
            let receta = await getRecetabyId(LS[i])
            addFav(receta)
            
        };

}

//Insertar en el Dom los Favoritos que se encuentran en el LocalStorage
function addFav (recetain){     
    let recetaFav = document.createElement('li');
    recetaFav.classList.add('li-fav');
    recetaFav.innerHTML = `
    <img src="${recetain.strMealThumb}" alt="">
    <br><span>${recetain.strMeal}</span>
    <botton class="clos"><i class="far fa-times-circle"></i></botton>
    `;

    const close_btn = recetaFav.querySelector(".clos");

    close_btn.addEventListener("click", ()=>{
        borrarLS(recetain.idMeal)
        recorridoLS();
    })
    recetasFav.appendChild(recetaFav);
}

//Guarda y Actualiza los id de Recetas en el LocalStorage
function ActualizaLS (recetaid){

    const idrecetas = getLS();
    idrecetas.push(recetaid);
    const todosJ = JSON.stringify(idrecetas)
    localStorage.setItem('idrecetas', todosJ)

}

function borrarLS (recetaid){
    let LS = getLS();
    localStorage.setItem("idrecetas", JSON.stringify(LS.filter((id) => id !== recetaid)));
}

//Obtiene el contenido del LocalStorage
function getLS (){
    let idrecetas = JSON.parse(localStorage.getItem('idrecetas')) || [];
    return idrecetas;
}