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
          output += '<li>'
          output += `<form class="update-tweet" action=/update/${tweet.id} method="POST">`
          output += `<label for="user" style="color: ${tweet.colour}"> Username: &nbsp ${tweet.user} &nbsp</label>`
          output += `<input name="user" type="text" placeholder=" update username" autofocus="" value="${tweet.user}">`
          output += `<br><br>`
          output += `<label for="tweet" style="color: ${tweet.colour}"> tweet: &nbsp ${tweet.tweet} &nbsp</label>`
          output += `<input name="tweet" type="text" placeholder=" update username" autofocus="" value="${tweet.tweet}">`
          output += `<br><br>`

          output += `<button id="update"> Update </button>`
          output += `</form>`
          output += `<a href="${tweet.id}" style="color:${tweet.colour}">`
          output += `id: ${tweet.id} <br> </a>`
          output += `<form class="delete-tweet" action=/delete/${tweet.id} method="GET">`

          output += `<button id="delete">Delete</button>`
          output += `</form>`
          output += `<br><br>`
          output += `</li>`
        })
      }
      const usersList = document.getElementById("users")
      //console.log({usersList})
      users.innerHTML = output
    }
  }
  xhr.send()
}

loadTweets()

document.getElementById('create').addEventListener('click', loadCreate)

function loadCreate(){
  console.log('clicked create button')

  e.preventDefault();

  const inputUsername = document.getElementById('inputUsername').name;
  const inputTweet = document.getElementById('inputTweet').name;
  const params = `"user="${inputUsername}&&"tweet="${inputTweet}`;
  console.log(params)

  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'api/tweets', true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  xhr.onload = function(){
    console.log(this.responseText);
  }

  xhr.send(params);
}

function loadUpdate(){
  console.log('clicked update button')
}

function loadDelete(){
  console.log('clicked delete button')
}
