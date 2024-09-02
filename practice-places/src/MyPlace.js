import { Map } from "./UI/Map";

export class LoadedPlace {
    constructor(coordinate, address){
        new Map(coordinate);
        const headerTitleEl = document.querySelector('header h1');
        headerTitleEl.textContent = address;
    }
}

const url = new URL(location.href);
const queryParams = url.searchParams;
const coords = {
    lat: parseFloat(queryParams.get('lat')),
    lng: +queryParams.get('lng')
}

const address = queryParams.get('address');
new LoadedPlace(coords, address);