// Post con título, contenido y autor. Además se mostrarán los comentarios y nos permitirá añadir 
//     nuevos comentarios, pudiendo seleccionar el autor como queramos.
// EXTRA: página para añadir nuevos post, permitirá seleccionar el autor mediante un campo select.

let title = document.getElementById("title");
let bodyPost = document.getElementById("body");
let listaCom = document.getElementById("listaCom");
let form = document.querySelector("form");
let comment = document.querySelector("#newComment");
let select = document.querySelector("#listaUser");
let selectedUser;

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

//recupero el post con el id enviado
fetch(`http://localhost:3000/posts?id=${id}`)
    .then(postResponse => {
        if(postResponse.ok){
            return postResponse.json();
        }else{
            return Promise.reject(postResponse);
        }
    })
    .then(post => {
        post = post[0];
        bodyPost.innerText = post.body;
        //recupero el autor del post
        fetch(`http://localhost:3000/users?id=${post.authorId}`)
            .then(authorResponse => {
                if(authorResponse.ok){
                    return authorResponse.json();
                }else{
                    return Promise.reject(authorResponse);
                }
            })
            .then(author => {
                author = author[0];
                title.innerText = `${post.title} - por ${author.username}`;
            });
        //recupero los comentarios del post
        fetch(`http://localhost:3000/comments?postId=${id}`)
            .then(commentsResponse => {
                if(commentsResponse.ok){
                    return commentsResponse.json();
                }else{
                    return Promise.reject(commentsResponse);
                }
            })
            .then(comments => {
                //recorro los comentarios para obtener el usuario y añadirlos
                for (let comment of comments){
                    fetch(`http://localhost:3000/users?id=${comment.authorId}`)
                        .then(userResponse => {
                            if(userResponse.ok){
                                return userResponse.json();
                            }else {
                                return Promise.reject(userResponse);
                            }
                        })
                        .then(user => {
                            user = user[0];
                            //muestro el comentario en la lista
                            let li = document.createElement("li");
                            let small = document.createElement("small");
                            small.appendChild(document.createTextNode(`${comment.timestamp}`));
                            let textoCom = document.createTextNode(`${user.username}: ${comment.body}    `);
                            //TO DO mostrar timestamp
                            li.appendChild(textoCom);
                            li.appendChild(small);
                            listaCom.appendChild(li);
                        });
                }
            });
    })
    .catch(err => muestraError);
    

function muestraError() {
    if (this.status) {
        console.log("Error "+this.status+" ("+this.statusText+") en la petición");
    } else {
        console.log("Ocurrió un error o se abortó la conexión");
    }
}

//recupero los usuarios para añadirlos al select del formulario
fetch('http://localhost:3000/users')
    .then(response => {
        if(response.ok){
            return response.json();
        }else{
            return Promise.reject(response);
        }
    })
    .then(users => {
        for(let user of users){
            let option = document.createElement("option");
            option.setAttribute("value", user.id);//option.value
            let optionText = document.createTextNode(user.username);//option.textContent
            option.appendChild(optionText);
            select.appendChild(option);
        }
    })
    .catch(err => {
        console.log('Error en la petición HTTP: '+err.message);
    });

//cuando se envie el formulario se guardan los datos y se añaden al json
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    selectedUser = select.options[select.selectedIndex].value;
    //obtener fecha del momento y añadirla 
    let fecha = new Date(Date.now());
    //si el nombre de la propiedad y el de la variable son iguales podemos poner solo la variable (en este caso no podemos)
    let data = {"body": comment.value, "postId": id, "authorId": selectedUser, "timestamp": fecha.toLocaleString()};
    //guardo los datos en el json
    fetch('http://localhost:3000/comments', {
            method: 'POST', 
            body: JSON.stringify(data), 
            headers:{
              'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
              return response.json();
            }
            return Promise.reject(response) 
        })
        .then(datos => datosServidor=datos)
        .catch(err => {
        console.log('Error en la petición HTTP: '+err.message);
        });
})