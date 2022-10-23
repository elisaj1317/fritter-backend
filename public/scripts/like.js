/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 */

function viewLikedFreets(fields) {
    fetch('/api/likes/freets')
    .then(showResponse)
    .catch(showResponse);
}

function viewLikeCount(fields) {
    fetch(`/api/likes/count/?freetId=${fields.freetId}`)
    .then(showResponse)
    .catch(showResponse);
}

function createLike(fields) {
    fetch('/api/likes', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse)
}

function deleteLike(fields) {
    fetch(`/api/likes/${fields.freetId}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}