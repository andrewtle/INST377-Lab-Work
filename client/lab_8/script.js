/* eslint-disable no-unused-vars */
/* eslint-disable no-template-curly-in-string */
function getRandomIntInclusive(min, max) {
    const newMin = Math.ceil(min);
    const newMax = Math.floor(max);
    return Math.floor(
      Math.random() * (newMax - newMin + 1) + newMin
    ); // The maximum is inclusive and the minimum is inclusive
  }
  
  function restoArrayMake(dataArray) {
    const range = [...Array(15).keys()];
    const listItems = range.map((item, index) => {
      const restNum = getRandomIntInclusive(0, dataArray.length - 1);
  
      return dataArray[restNum];
    });
  
    return listItems;
  }
  
  function createHtmlList(collection) {
    const targetList = document.querySelector('#resto-list');
    targetList.innerHTML = '';
    collection.forEach((item) => {
      const {name} = item;
      const displayName = name.toLowerCase();
      const injectThisItem = `<li>${displayName}</li>`;
      targetList.innerHTML += injectThisItem;
    });
  }
  
  function initMap(targetId) {
    const latLong = [38.785, -76.8721];
    const map = L.map(targetId).setView(latLong, 13);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
    }).addTo(map);
    return map;
  }
  
  function addMapMarkers(map, collection) {
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        layer.remove();
      }
    });
  
    collection.forEach((item) => {
      const point = item.geocoded_column_1?.coordinates;
      console.log(item.geocoded_column_1?.coordinates);
      L.marker([point[1], point[0]]).addTo(map);
    });
  }
  
  // As the last step of your lab, hook this up to index.html
  async function mainEvent() { // the async keyword means we can make API requests
    console.log('script loaded'); // substituting for a 'breakpoint'
    const form = document.querySelector('.main_form');
    const submit = document.querySelector('.submit_button');
  
    const resto = document.querySelector('#resto_name');
    const zipcode = document.querySelector('#zipcode');
    const map = initMap('map');
    const retrievalVar = 'restaurants';
    submit.style.display = 'none';
  
    if (localStorage.getItem(retrievalVar) === undefined) {
      const results = await fetch('/api/foodServicesPG');
      const arrayFromJson = await results.json();
      console.log(arrayFromJson);
      localStorage.setItem(retrievalVar, JSON.stringify(arrayFromJson.data));
    }
  
    const storedDataString = localStorage.getItem(retrievalVar);
    const storedDataArray = JSON.parse(storedDataString);
    console.log(storedDataArray);
    // const arrayFromJson = {data: []};
  
    if (storedDataArray.length > 0) {
      submit.style.display = 'block';
  
      let currentArray = [];
  
      // Restaurant Name
      resto.addEventListener('input', async(event) => {
        console.log(event.target.value);
  
        if (currentArray.length < 1) {
          return;
        }
  
        const selectResto = storedDataArray.filter((item) => {
          const lowerName = item.name.toLowerCase();
          const lowerValue = event.target.value.toLowerCase();
          return lowerName.includes(lowerValue);
        });
  
        console.log(selectResto);
        createHtmlList(selectResto);
      });
  
      // Zipcode
      zipcode.addEventListener('input', async (event) => {
        console.log(event.target.value);
  
        if (currentArray.length < 1) {
          return;
        }
        const selectedZip = currentArray.filter((item) => {
          const num = item.zip;
          const zipVal = event.target.value;
          return num.includes(zipVal);
        });
        console.log(selectedZip);
        createHtmlList(selectedZip);
      });
  
      form.addEventListener('submit', async (submitEvent) => {
        submitEvent.preventDefault();
        // console.log('form submission'); // this is substituting for a "breakpoint"
  
        currentArray = restoArrayMake(storedDataArray);
        console.log(currentArray);
        createHtmlList(currentArray);
        addMapMarkers(map, currentArray);
      });
    }
  }
  
  // this actually runs first! It's calling the function above
  document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests