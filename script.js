'use strict'

const apiKey = "fF3A36wV9JOfRFeeJqR6KkixpjJFF3QAWVOBnau8";
const searchURL = "https://developer.nps.gov/api/v1/parks"

function formatQueryParameters(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}


//fetch park data by calling NPS API
function getParks(query, limit = 10) {



    const params = {
        api_key: apiKey,
        stateCode: query,
        limit,
    };


    let queryString = formatQueryParameters(params);

    let url = searchURL + '?' + queryString;

    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });

}


//write response object to DOM
function displayResults(responseJson) {

    $('#results-list').empty();

    for (let i = 0; i < responseJson.limit; i++) {
        $('#results-list').append(
            `     <li>
              <h3>${responseJson.data[i].fullName}</h3>
              <p>${responseJson.data[i].description}</p>
              <a href="${responseJson.data[i].url}" target="blank">${responseJson.data[i].url}</a>
              </li>`
        )
    };

    $("#results").removeClass("hidden");

    console.log(responseJson);




}

//run getParks function with submit button is clicked
function watchForm() {

    $('#js-form').submit(event => {
        event.preventDefault();
        const searchState = $("#stateMenu").val();
        const maxResults = $("#js-max-results").val();


        if (maxResults == 0) {
            alert("Max results must be greater than zero!")
        } else if (maxResults > 50) {
            alert("You can only view fewer than 50 results at a time!")
        } else {
            getParks(searchState, maxResults);
        }


    })
}



//load watchForm on page load
$(function handleApp() {
    console.log("App is ready!");
    watchForm();

})