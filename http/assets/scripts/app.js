// fetch('https://jsonplaceholder.typicode.com/todos/1')
//       .then(response => response.json())
//       .then(json => console.log(json))

const listElement = document.querySelector('.posts');
const postTemplate = document.getElementById('single-post');

const form = document.querySelector('#new-post form');
const fetchButton = document.querySelector('#available-posts button');

const postList = document.querySelector('ul');

function sendHttpRequest(method, url, data) {
    // const promise = new Promise((resolve, reject) => {
    //     const xhr = new XMLHttpRequest();

    //     xhr.open(method, url);

    //     xhr.responseType = 'json'; // directly convert to js type
    //     xhr.setRequestHeader('Content-Type', 'application/json');

    //     xhr.onload = function () {
    //         // const listOfPosts = JSON.parse(xhr.response);
    //         if (xhr.status >= 200 && xhr.status < 300) {
    //             resolve(xhr.response);
    //         }
    //         else {
    //             // check error code
    //             reject(xhr.status);
    //         }
    //     }

    //     // check network error, request failed
    //     xhr.onerror = function () {
    //         reject(xhr.status);
    //     }

    //     xhr.send(JSON.stringify(data));
    // })
    // return promise;

    return fetch(url, {
        method: method,
        // body: JSON.stringify(data),
        // headers: {
        //     'Content-Type': 'application/json'
        // }

        //if use FormData no need to stringify
        body: data
    }).then(response => {
        if (response.status >= 200 && response.status < 300) {
            return response.json();
        }
        else {
            return response.json().then(errData => {
                console.log(errData);
                throw new Error("Server error");
            });
        }

    })
        .catch(error => {
            console.log(error);
            throw new Error("Something wrong");
        });
}

function fetchPosts() {
    // sendHttpRequest('GET', 'https://jsonplaceholder.typicode.com/posts').then((posts) => {
    //     for (const post of posts) {
    //         const postElement = document.importNode(postTemplate.content, true);
    //         postElement.querySelector('h2').textContent = post.title.toUpperCase();
    //         postElement.querySelector('p').textContent = post.body;
    //         postElement.querySelector('li').id = post.id;
    //         listElement.append(postElement);
    //     }
    // }
    // ).catch(err => {
    //     console.log(err);
    // });

    axios.get('https://jsonplaceholder.typicode.com/posts').then(response => {
        for (const post of response.data) {
            const postElement = document.importNode(postTemplate.content, true);
            postElement.querySelector('h2').textContent = post.title.toUpperCase();
            postElement.querySelector('p').textContent = post.body;
            postElement.querySelector('li').id = post.id;
            listElement.append(postElement);
        }
    }).catch(error => {
        console.log(error);
        throw new Error(error.response);
    });
}

function createPost(title, content) {
    const userId = Math.random();
    const post = {
        title: title,
        body: content,
        userId: userId
    }

    // auto collect from form, need to specify name in DOM
    const fd = new FormData(form);

    // manually append
    // fd.append('title', title),
    // fd.append('body', content),
    fd.append('userId', userId),

    // sendHttpRequest('POST', 'https://jsonplaceholder.typicode.com/posts', fd);

    axios.post('https://jsonplaceholder.typicode.com/posts', fd)
}

fetchButton.addEventListener('click', fetchPosts);
form.addEventListener('submit', event => {
    event.preventDefault();
    const enteredTitle = event.currentTarget.querySelector('#title').value;
    const enteredContent = event.currentTarget.querySelector('#content').value;
    createPost(enteredTitle, enteredContent);
})
postList.addEventListener('click', event => {
    if (event.target.tagName == 'BUTTON') {
        const postElement = event.target.closest('li');
        sendHttpRequest('DELETE', `https://jsonplaceholder.typicode.com/posts/${postElement.id}`).then(() => {
            // document.getElementById(postId).remove();
            postElement.remove();
        });
    }
})



