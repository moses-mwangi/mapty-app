"use strick";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

class workOut {
  date = new Date();
  id = (new Date() + "").slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat.lng]
    this.distance = distance;
    this.duration;
  }
}

class Running extends workOut {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
class Cycling extends workOut {
  constructor(coords, distance, duration, ElevGain) {
    super(coords, distance, duration);
    this.ElevGain = ElevGain;
    this.calcSpeed();
  }
  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}
const runn1 = new Running([35, -19], 5.2, 24, 178);
const cycl1 = new Cycling([35, -19], 27, 95, 520);
console.log(runn1, cycl1);

let map;
let mapEvent;
class app {
  #map;
  #mapEvent;

  constructor() {
    this._getPosition();

    form.addEventListener("click", this._newWorkOut.bind(this));

    inputType.addEventListener("click", this._toggleElevationField.bind(this));
  }
  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert("cant find your location");
        }
      );
  }
  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const coords = [latitude, longitude];

    console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

    this.#map = L.map("map").setView(coords, 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on("click", this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove("hidden");
    inputDistance.focus();
  }

  _toggleElevationField() {
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  }
  _newWorkOut(e) {
    e.preventDefault();

    ///// clear input ///
    inputCadence.value =
      inputDuration.value =
      inputDistance.value =
      inputElevation.value =
        "";

    /////// display maker //////
    const { lat, lng } = this.#mapEvent.latlng;
    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          setContent: "running-popup",
        })
      )
      .setPopupContent("workout")
      .openPopup();
  }
}
const apps = new app();
console.dir(app);
