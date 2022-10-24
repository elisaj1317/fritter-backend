/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 */

function viewFollowings(fields) {
    fetch(`/api/follows?followee=${fields.username}`)
    .then(showResponse)
    .catch(showResponse);
}

function viewFollowers(fields) {
    fetch(`/api/follows?followed=${fields.username}`)
    .then(showResponse)
    .catch(showResponse);
}

function viewFollowerFeed(fields) {
    fetch('/api/follows/freet')
    .then(showResponse)
    .catch(showResponse);
}

function createFollow(fields) {
fetch(`/api/follows/${fields.username}`, {method: 'PUT'})
    .then(showResponse)
    .catch(showResponse);
}

function deleteFollow(fields) {
fetch(`/api/follows/${fields.username}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}
  