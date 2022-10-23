/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 */

function viewCommentsOnFreet(fields) {
    fetch(`/api/comments/?freetId=${fields.freetId}`)
    .then(showResponse)
    .catch(showResponse);
}

function viewCommentsOnFreetAndCategory(fields) {
    fetch(`/api/comments/?freetId=${fields.freetId}&category=${fields.category}`)
    .then(showResponse)
    .catch(showResponse);
}

function createComment(fields) {
    fetch('/api/comments', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function editComment(fields) {
    fetch(`/api/comments/${fields.commentId}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteComment(fields) {
    fetch(`/api/comments/${fields.commentId}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}