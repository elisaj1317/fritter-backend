/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 */

function viewMenu(fields) {
    fetch('/api/menus')
    .then(showResponse)
    .catch(showResponse);
}

function addOneToMenu(fields) {
    fetch('/api/menus', {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function changeMenuLocation(fields) {
    fetch('/api/menus', {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}