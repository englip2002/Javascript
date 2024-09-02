const h1 = document.getElementById('main-title');
h1.textContent = "New Title";
h1.style.color = 'white'
h1.style.backgroundColor = 'black'

const listItemElements = document.querySelectorAll('li');
// const listItemElements = document.getElementsByTagName('li');
for (const item of listItemElements) {
    console.log(item);
}

const lastListItemElement = document.querySelector('li:last-of-type');
lastListItemElement.textContent = lastListItemElement.textContent + " (Changed)"

// dive down
const ul = document.querySelector('ul');
const li = ul.children[1];

//select the nearest ancestor that match the name
ul.closest('body');
// select parent
ul.parentElement;

//sibling (same level)
ul.previousElementSibling
ul.nextElementSibling

const section = document.querySelector('section');
// section.style.backgroundColor = 'blue';

section.className = "red-bg";

const button = document.querySelector('button');
button.addEventListener('click', () => {
    // if (section.className == "red-bg visible") {
    //     section.className = "red-bg invisible"
    // }
    // else {
    //     section.className = "red-bg visible"
    // }

    // section.classList.toggle('visible');

    //remove if exist else add
    section.classList.toggle('invisible');
})

// change html element (will overwrite everything)
// section.innerHTML = `<h2>Good</h2>`

// add html item (unable to access the item)
const div = document.querySelector('div');
// div.insertAdjacentHTML('beforeend', '<p>Something wrong</p>')

// create element (can access the item)
const list = document.querySelector('ul');
const newLi = document.createElement('li');
newLi.textContent = "Item 4";

// last
list.appendChild(newLi);
//first
list.prepend(newLi);

list.lastElementChild.before(newLi);
// list.firstElementChild.replaceWith(newLi);

//second element
// list.children[1].after(newLi); // not support in safari
list.children[1].insertAdjacentElement('afterend',newLi);

const newLi2 = newLi.cloneNode(true);
// append multiple
list.append(newLi, newLi2);


// if the elements added or removed will be reflect
document.getElementsByTagName('li')

// only take snapshot of the li, will not update
document.querySelectorAll('li')


//remove element
// list.remove()
// list.parentElement.removeChild(list)