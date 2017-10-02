'use strict'

function loadTweets(){
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/api/tweets', true)

  xhr.onload = function(){
    if(this.status == 200){
      let tweets = JSON.parse(this.responseText)
      let output = '<h4>Tweets</h4>'
      if(tweets.tweets) {
        tweets.tweets.map(tweet => {
          output += `
          <li>
            <form class="update-tweet" action=/update/${tweet.id} method="POST">
              <label for="user" style="color: ${tweet.colour}"> Username: &nbsp ${tweet.user} &nbsp</label>
              <input name="user" type="text" placeholder=" update username" autofocus="" value="${tweet.user}">
              <br><br>
              <label for="tweet" style="color: ${tweet.colour}"> tweet: &nbsp ${tweet.tweet} &nbsp</label>
              <input name="tweet" type="text" placeholder=" update username" autofocus="" value="${tweet.tweet}">
              <br><br>
              <button id="update"> Update </button>
            </form>
            <a href="${tweet.id}" style="color:${tweet.colour}">id: ${tweet.id} <br> </a>
            <form class="delete-tweet" action=/delete/${tweet.id} method="GET">
              <button id="delete">Delete</button>
            </form>
            <br><br>
          </li>`;
        })
      }
      const usersList = document.getElementById("users")
      users.innerHTML = output
    }
  }
  xhr.send()
}
// Init
loadTweets()

document.getElementById('create').addEventListener('click', loadCreate)


function loadCreate(event){
  event.preventDefault()
  const inputUsername = document.getElementById('inputUsername').value;
  const inputTweet = document.getElementById('inputTweet').value;
  const params = `user=${inputUsername}&tweet=${inputTweet}`;
  console.log(params)

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/tweets', true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  xhr.onload = function(){
    loadTweets()
    console.log(this.responseText);
  }

  xhr.send(params); // this build out the post request query
}

function loadUpdate(){
  console.log('clicked update button')
}

function loadDelete(){
  console.log('clicked delete button')
}
