/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 */

function viewLikedFreets(fields) {
    fetch('/api/likes/freets')
    .then(showResponse)
    .catch(showResponse);
}

function createLikeFreet(fields) {
    fetch(`/api/likes/freet/${fields.freetId}`, {method: 'PUT'})
    .then(showResponse)
    .catch(showResponse)
}

function deleteLikeFreet(fields) {
    fetch(`/api/likes/freet/${fields.freetId}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}

function createLikeComment(fields) {
    fetch(`/api/likes/comment/${fields.commentId}`, {method: 'PUT'})
    .then(showResponse)
    .catch(showResponse)
}

function deleteLikeComment(fields) {
    fetch(`/api/likes/comment/${fields.commentId}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}