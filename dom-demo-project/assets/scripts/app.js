const addMovieModal = document.getElementById('add-modal');

const startAddMovieBtn = document.querySelector('header button');
// const startAddMovieBtn = document.querySelector('header').lastElementChild;

const backdrop = document.getElementById('backdrop');
const cancelAddMovieBtn = addMovieModal.querySelector('.btn--passive');
const addMovieButton = cancelAddMovieBtn.nextElementSibling;
const userInputs = document.querySelectorAll('input');

const entryTextSection = document.getElementById('entry-text');
const movieList = document.getElementById('movie-list');

const deleteMovieModal = document.getElementById('delete-modal');

const movies = [];

function updateUI() {
    if (movies.length <= 0) {
        entryTextSection.style.display = 'block';
    }
    else {
        entryTextSection.style.display = 'none';
    }
}

function deleteMovie(movieId) {
    let movieIndex = 0;
    for (const movie of movies) {
        if (movieId == movie.id) {
            break;
        }
        movieIndex++;
    }
    movies.splice(movieIndex, 1);
    movieList.children[movieIndex].remove();
    // movieList.removeChild(movieList.children[movieIndex]);

    closeMovieDeletionModal();
    updateUI();
}

function closeMovieDeletionModal() {
    deleteMovieModal.classList.remove('visible');
    toggleBackdrop();
}

function deleteMovieHandler(movieId) {
    deleteMovieModal.classList.add('visible');
    toggleBackdrop();
    const cancelDeletionButton = deleteMovieModal.querySelector('.btn--passive')
    let confirmDeletionButton = deleteMovieModal.querySelector('.btn--danger')

    // to avoid stacking listener
    cancelDeletionButton.removeEventListener('click', closeMovieDeletionModal);
    confirmDeletionButton.replaceWith(confirmDeletionButton.cloneNode(true));
    confirmDeletionButton = deleteMovieModal.querySelector('.btn--danger');


    cancelDeletionButton.addEventListener('click', closeMovieDeletionModal);
    confirmDeletionButton.addEventListener('click', deleteMovie.bind(null, movieId));
}

function renderMovieElement(id, title, imageUrl, rating) {
    const newMovieElement = document.createElement('li');
    newMovieElement.className = 'movie-element';
    newMovieElement.innerHTML = `
        <div class="movie-element__image">
            <img src="${imageUrl}" alt="${title}">
            <div class="movie-element__info">
                <h2>${title}</h2>
                <p>${rating} / 5 Stars</p>
            </div>
        </div>
    `;
    newMovieElement.addEventListener('click', deleteMovieHandler.bind(null, id));
    movieList.appendChild(newMovieElement)
}

function toggleBackdrop() {
    backdrop.classList.toggle('visible');
}

function closeMovieModal() {
    addMovieModal.classList.remove('visible');
}

function showMovieModal() {
    addMovieModal.classList.add('visible');
    toggleBackdrop();
}

function toggleMovieModal() {
    addMovieModal.classList.toggle('visible');
}

function clearMovieInput() {
    for (const usrInput of userInputs) {
        usrInput.value = "";
    }
}

function cancelAddMovieHandler() {
    toggleMovieModal();
    clearMovieInput();
    toggleBackdrop();
}

function addMovieHandler() {
    const titleValue = userInputs[0].value;
    const imageUrlValue = userInputs[1].value;
    const ratingValue = userInputs[2].value;

    if (titleValue.trim() === ""
        || imageUrlValue.trim() === ""
        || ratingValue.trim() === ""
        || parseInt(ratingValue) < 1 || parseInt(ratingValue) > 5) {
        alert('Please enter valid value');
        return;
    }

    const newMovie = {
        id: Math.random().toString(),
        title: titleValue,
        image: imageUrlValue,
        rating: ratingValue
    }

    movies.push(newMovie);

    clearMovieInput();
    closeMovieModal();
    toggleBackdrop();
    updateUI();
    renderMovieElement(newMovie.id, newMovie.title, newMovie.image, newMovie.rating);
}

function backdropClickHandler() {
    closeMovieModal();
    closeMovieDeletionModal();
    clearMovieInput();
    // toggleBackdrop();
}


startAddMovieBtn.addEventListener('click', showMovieModal);
backdrop.addEventListener('click', backdropClickHandler);
cancelAddMovieBtn.addEventListener('click', cancelAddMovieHandler);
addMovieButton.addEventListener('click', addMovieHandler);