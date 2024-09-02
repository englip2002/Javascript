const userId = 'u123';

function localSessionStorage() {
    const storeBtn = document.getElementById('store-btn');
    const retrieveBtn = document.getElementById('retrieve-btn');

    storeBtn.addEventListener('click', () => {
        localStorage.setItem('uid', userId);
        sessionStorage.setItem('uid', userId);
    })

    retrieveBtn.addEventListener('click', () => {
        const id = localStorage.getItem('uid');
        console.log(id);
    })

    localStorage.removeItem('uid');
    sessionStorage.removeItem('uid');
}

function cookie() {
    console.log(document.cookie);
    const storeBtn = document.getElementById('store-btn');
    const retrieveBtn = document.getElementById('retrieve-btn');

    storeBtn.addEventListener('click', () => {
        const userId = 'u123';
        const user = {
            name: 'Max',
            age: '30'
        }

        // cookie expire in 2 second
        document.cookie = `uid=${userId}; max-age=2`;
        document.cookie = `user=${user}`;
    })

    retrieveBtn.addEventListener('click', () => {
        console.log(document.cookie);
        const cookieData = document.cookie.split(';');
        const data = cookieData.map(i => {
            return i.trim();
        })
        console.log(data.includes('uid').split('=')[1]); //user value

    })
}

function indexedDBStorage() {
    const storeBtn = document.getElementById('store-btn');
    const retrieveBtn = document.getElementById('retrieve-btn');

    let db;
    let objStore;

    const dbRequest = indexedDB.open('StorageDummy', 1);

    dbRequest.onsuccess = function (event) {
        db = event.target.result;
    }

    dbRequest.onupgradeneeded = function (event) {
        db = event.target.result;
        objStore = db.createObjectStore('products', { keyPath: 'id' });

        objStore.transaction.oncomplete = function (event) {
            const productStore = db.transaction('products', 'readwrite').objectStore('products');
            productStore.add({
                id: 'p1',
                title: 'A FIrst Product',
                price: 12.99,
                tags: ['Expensive', "Luxury"]
            })
        }
    };

    dbRequest.onerror = function (event) {
        console.log("Error!");
    }

    storeBtn.addEventListener('click', () => {
        const product = {
            id: 'p2',
            title: 'A Second Product',
            price: 13.99,
            tags: ['Expensive', "Luxury"]
        }

        if (!db) return;

        const productStore = db.transaction('products', 'readwrite').objectStore('products');
        productStore.add(product);
    })

    retrieveBtn.addEventListener('click', () => {
        const productStore = db.transaction('products', 'readwrite').objectStore('products');
        const request = productStore.get('p2');
        request.onsuccess = function () {
            console.log(request.result);
        }
    })
}

indexedDBStorage();