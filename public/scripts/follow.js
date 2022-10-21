/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 */

function viewFollowings(fields) {
    fetch(`/api/follows/following?username=${fields.username}`)
    .then(showResponse)
    .catch(showResponse);
}

function viewFollowers(fields) {
    fetch(`/api/follows/follower?username=${fields.username}`)
    .then(showResponse)
    .catch(showResponse);
}

function viewFollowerFeed(fields) {
    fetch('/api/follows/freet')
    .then(showResponse)
    .catch(showResponse);
}

function createFollow(fields) {
fetch('/api/follows', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteFollow(fields) {
fetch(`/api/follows/${fields.username}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}
  