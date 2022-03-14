async function setup() {

  const endpoint = "https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json";

  let request = await fetch(endpoint);

  let data = await request.json();

  const table = document.querySelector("#result-table");

  const tableResults = document.querySelector("#result-table-results");

  const noResults = document.querySelector("#no-results");


  const searchForm = document.querySelector("#search-form");

  const searchTerm = document.querySelector("#search-term");

  function findMatches(e, data = []) {
    // Validate input
    if (searchTerm.value.length <= 2) {
      buildResultUI();
      return;
    }

    // Variables
    const query = searchTerm.value.toLowerCase(); // Case insensitive
    const basis = document.querySelector('input[name="search_type"]:checked').value;
    let results = [];

    // Compare against Zip/Name
    data.forEach((d) => {
      if (basis === "name" && d.name.toLowerCase().includes(query)) {
        results.push(d);
        return; // Skip next IF-stmt for efficiency
      }
      if (basis === "zip" && d.zip.includes(query)) {
        results.push(d);
      }
    });

    // Build UI with results
    buildResultUI(results);
  }

  function buildResultUI(results = []) {
    // Validate input
    if (!results || !(results instanceof Array) || results.length <= 0) {
      noResults.classList.remove("is-hidden");
      table.classList.add("is-hidden");
    } else {
      noResults.classList.add("is-hidden");
      table.classList.remove("is-hidden");
    }

    // Variables
    const term = searchTerm.value;
    const regex = new RegExp(term, "gi");
    const fragment = document.createDocumentFragment();

    (results || []).splice(0, 25).forEach((resturant) => {
      // Variables
      const tr = document.createElement('tr');

      // Attributes
      tr.innerHTML = `<td>${resturant.name.toUpperCase()}</td><td>${resturant.city}</td><td>${resturant.state}</td><td>${resturant.zip}</td><td>${resturant.type}</td>`
        .replace(regex, "<b class='has-background-info'>" + term.toUpperCase() + "</b>");

      // Append
      fragment.appendChild(tr);
    });

    // Append
    tableResults.innerHTML = "";
    tableResults.appendChild(fragment);
  }

  searchForm.onsubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    findMatches(e, data);
  };
  searchTerm.onkeyup = (e) => findMatches(e, data);
}

window.onload = (e) => setup();