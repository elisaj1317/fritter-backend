/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function viewFollowings(fields) {
    fetch(`/api/follow/following?username=${fields.username}`)
    .then(showResponse)
    .catch(showResponse);
}

function viewFollowers(fields) {
    fetch(`/api/follow/follower?username=${fields.username}`)
    .then(showResponse)
    .catch(showResponse);
}

function createFollow(fields) {
fetch('/api/follow', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteFollow(fields) {
fetch(`/api/follow/${fields.username}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}
  