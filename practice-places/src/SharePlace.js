import { Modal } from "./UI/Modal";
import { Map } from "./UI/Map";
import { getCoordsFromAddress, getAddressFromCoords } from "./Utility/Location";

class PlaceFinder {
    constructor() {
        const addressForm = document.querySelector('form');
        const locateUserBtn = document.getElementById('locate-btn');
        this.shareBtn = document.getElementById('share-btn');

        locateUserBtn.addEventListener('click', this.locateUserHandler.bind(this));
        addressForm.addEventListener('submit', this.findAddressHandler.bind(this));
        this.shareBtn.addEventListener('click', this.sharePlaceHandler)
    }

    selectPlace(coordinates, address) {
        if (this.map) {
            this.map.render(coordinates);
        }
        else {
            this.map = new Map(coordinates);
        }
        this.shareBtn.disabled = false;
        const sharedLinkInputElement = document.getElementById('share-link');
        sharedLinkInputElement.value = `${location.origin}/my-place?address=${encodeURI(address)}&lat=${coordinates.lat}&lng=${coordinates.lng}`;
    }

    sharePlaceHandler() {
        const sharedLinkInputElement = document.getElementById('share-link');
        if (!navigator.clipboard) {
            sharedLinkInputElement.select();
            return;
        }
        navigator.clipboard.writeText(sharedLinkInputElement.value).then(() => {
            alert("Copied into clipboard!");
        }).catch(err => {
            console.log(err);
        });
    }

    locateUserHandler() {
        if (!navigator.geolocation) {
            alert('Geolocation not available, please use newer browser!');
            return;
        };

        const modal = new Modal('loading-modal-content', 'Loading location');
        modal.show();

        navigator.geolocation.getCurrentPosition(successResult => {
            modal.hide();
            const coordinates = {
                lat: successResult.coords.latitude,
                lng: successResult.coords.longitude,
            }

            getAddressFromCoords(coordinates).then(address => {
                document.querySelector('#place-data input').value = address;
                this.selectPlace(coordinates, address)
            });

        }, error => {
            modal.hide();
            alert("Could not locate your location please enter manually.")
        });

    }

    findAddressHandler(event) {
        event.preventDefault();
        const address = event.target.querySelector('input').value;
        if (!address || address.trim().length === 0) {
            alert('Invalid address please try again!');
            return;
        }
        const modal = new Modal('loading-modal-content', 'Loading location');
        modal.show();
        getCoordsFromAddress(address).then(coordinates => {
            this.selectPlace(coordinates, address);
            modal.hide();
        }).catch(err => {
            alert(err);
            modal.hide();
        })
    }
}

const placeFinder = new PlaceFinder(); 