/*async function mainEvent() { // the async keyword means we can make API requests
  const form = document.querySelector('.main_form');
  form.addEventListener('submit', async (submitEvent) => { // async has to be declared all the way to get an await
    submitEvent.preventDefault(); // This prevents your page from refreshing!
    console.log('form submission'); // this is substituting for a "breakpoint"
    const results = await fetch('/api/foodServicesPG'); // This accesses some data from our API
    const arrayFromJson = await results.json(); // This changes it into data we can use - an object
    console.table(arrayFromJson.data); // this is called "dot notation"
    // arrayFromJson.data - we're accessing a key called 'data' on the returned object
    // it contains all 1,000 records we need
  });
}

// this actually runs first! It's calling the function above
document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests
*/

async function setup() {
  /**
   * API Endpoint
   *
   * @type {string}
   */
  const endpoint = "https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json";

  /**
   * API Search Request
   *
   * @type {Object}
   */
  let request = await fetch(endpoint);

  /**
   * API Search Result
   *
   * @type {Object}
   */
  let data = await request.json();

  /**
   * Query Result Table
   *
   * @type {DOMElement}
   */
  const table = document.querySelector("#result-table");

  /**
   * Query Result Table tbody
   *
   * @type {DOMElement}
   */
  const tableResults = document.querySelector("#result-table-results");

  /**
   * Query No Results Notice
   *
   * @type {DOMElement}
   */
  const noResults = document.querySelector("#no-results");

  /**
   * Search Query Form
   *
   * @type {DOMElement}
   */
  const searchForm = document.querySelector("#search-form");

  /**
   * Search Query Term Input
   *
   * @type {DOMElement}
   */
  const searchTerm = document.querySelector("#search-term");

  /**
   * Find search result matches by term
   *
   * @param {Object} Firing event
   * @param {Object} Search Data
   * @author Alec M. <https://amattu.com>
   * @date 2021-10-06T12:11:26-040
   */
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

  /**
   * Build the result UI section
   *
   * @param {Array} [results=[]]
   * @author Alec M. <https://amattu.com>
   * @date 2021-10-06T13:02:53-040
   */
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

    // Build Result Rows
    // Limit to 26 results (Lag)
    // We really should use pagination here
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

  // Event Listeners
  searchForm.onsubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    findMatches(e, data);
  };
  searchTerm.onkeyup = (e) => findMatches(e, data);
}

// Load API data automatically
window.onload = (e) => setup();