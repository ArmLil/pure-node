'use strict'

const loadTweets = () => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/api/tweets', true)

  xhr.onload = function(){
    if(this.status == 200){
      let tweets = JSON.parse(this.responseText)
      let output = '<h4>Tweets</h4>'
      if(tweets.tweets) {
        tweets.tweets.map(tweet => {
          //const tweetStr = JSON.stringify(tweet)
          console.log(tweet)
          output += `
          <li>
            <label for="user" style="color: ${tweet.colour}"> Username: &nbsp ${tweet.user} &nbsp</label>
            <input id=tweet${tweet.id}name="user" type="text" placeholder=" update username" autofocus="" >
            <br><br>
            <label for="tweet" style="color:${tweet.colour}"> tweet: &nbsp ${tweet.tweet} &nbsp</label>
            <input id=user${tweet.id} name="tweet" type="text" placeholder=" update username" autofocus="">
            <br><br>
            <button onClick="loadUpdate('${tweet.id}')"> Update </button>
            <a id="href" name="${tweet.id}" href="${tweet.id}" style="color:${tweet.colour}">id: ${tweet.id} <br> </a>
            <br>
            <button onClick="loadDelete(${tweet.id})">Delete</button>
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

loadTweets()
/////////////////////////////////////////////////////////////////////////////

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

///////////////////////////////////////////////////////////////////////////


const loadUpdate = (id) => {
  console.log('clicked update button',id, event.target)
  // const params = `user=${user}&tweet=${tweet}`;
  // console.log('params=', params, 'id=', id)
  //
  // const xhr = new XMLHttpRequest();
  // xhr.open('PUT', `/api/tweets/${id}`, true);
  // xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  //
  // xhr.onload = function(){
  //   loadTweets()
  //   console.log(this.responseText);
  // }
  //
  // xhr.send(params); // this build out the post request query
}

//////////////////////////////////////////////////////////////////////////

const loadDelete = (id) => {
  console.log('clicked delete button')
  event.preventDefault()

  const xhr = new XMLHttpRequest();
  xhr.open('DELETE', `/api/tweets/${id}`, true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  xhr.onload = function(){
    console.log(this.responseText);
    loadTweets()
  }

  xhr.send(id); // this build out the post request query
}
