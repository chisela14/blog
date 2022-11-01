// Lista de posts con título y autor.

let lista = document.getElementById("lista");

//mostrar todos los posts en la lista vacía
fetch('http://localhost:3000/posts')
    .then(response => {
        if (response.ok) {
            let posts = response.json();
            return posts;
        }else{
            return Promise.reject(response);
        }

    })
    .then(posts => {
        //recorro todos los post para mostrar la info de cada uno
        for (let post of posts){
            //recupero la información del usuario 
            fetch(`http://localhost:3000/users?id=${post.authorId}`)
                .then(infoUser =>{
                    if (infoUser.ok){
                        let user = infoUser.json();
                        return user;
                        
                    }else{
                        return Promise.reject(infoUser);
                    }
                })
                .then(user => {
                    user = user[0];
                    let username = user.username;
                    //creo elemento li para la información del post
                    let li = document.createElement("li");
                    //añado una etiqueta a para que sea un enlace a otra página
                    let a = document.createElement("a");
                    a.setAttribute("href", `post.html?id=${post.id}`);
                    let textoPost = document.createTextNode(`Título: ${post.title} Autor: ${username}`);
                    a.appendChild(textoPost);
                    li.appendChild(a);
                    //añado el post a la lista
                    lista.appendChild(li);
                })
        }
    })
    .catch(err => muestraError);



function muestraError(e) {
    if (e.status) {
        console.log("Error "+e.status+" ("+e.statusText+") en la petición");
    } else {
        console.log("Ocurrió un error o se abortó la conexión");
    }
}


