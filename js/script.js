let url = "https://password-reset-app.herokuapp.com";

let login = () => {
  let mail = document.getElementById("email").value;
  let pwd = document.getElementById("password").value;
  fetch(`${url}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: mail,
      password: pwd
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      let item = document.getElementById('alert-msg');
      item.hidden = false;
      item.className = ""
      item.classList.add('alert')
      if(res.message == "user logged in successfully"){
        item.classList.add('alert-success')
        item.innerHTML = res.message;
      }else if(res.message == "incorrect password"){
        item.classList.add('alert-warning')
        item.innerHTML = res.message;
      }else{
        item.classList.add('alert-danger')
        item.innerHTML = res.message;
      }
    })
    .catch((err) => {
      console.log(err);
    });
};


let register = () => {
  let userName = document.getElementById('username').value;
  let mail = document.getElementById('email').value;
  let pswd = document.getElementById('password').value;
  fetch(`${url}/register-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: userName,
      email: mail,
      password: pswd
    })
  }).then((res) => res.json())
  .then((res) => {
    let item = document.getElementById('alert-msg');
      item.hidden = false;
      item.className = ""
      item.classList.add('alert')
      if(res.message == "user registered successfully, Login now to continue"){
        item.classList.add('alert-success')
        item.innerHTML = res.message;
      }else if(res.message == "user already exists, please login"){
        item.classList.add('alert-warning')
        item.innerHTML = res.message;
      }
  })
}

let passwordReset = () => {
  let mail = document.getElementById('email').value;
  let timeleft = 10;
  document.getElementById('button').disabled = true;
  let downloadTimer = setInterval(function(){
    if(timeleft <= 0){
      document.getElementById('button').disabled = false;
      document.getElementById("countdown").innerHTML = '';
      clearInterval(downloadTimer);
    }else{
      document.getElementById("countdown").innerHTML = timeleft;
    }
    timeleft -= 1;
  }, 1000);
  fetch(`${url}/forgot-password`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: mail
    })
  }).then((res) => res.json())
  .then((res) => {
    let item = document.getElementById('alert-msg');
      item.hidden = false;
      item.className = ""
      item.classList.add('alert')
      if(res.message == "Password reset link sent to email"){
        item.classList.add('alert-success')
        item.innerHTML = res.message;
      }else if(res.message == "user is not registered"){
        item.classList.add('alert-warning')
        item.innerHTML = res.message;
      }
  }).catch((err) => {
    console.log(error)
  })
}

function parseURLParams(url) {
  var queryStart = url.indexOf("?") + 1,
      queryEnd   = url.indexOf("#") + 1 || url.length + 1,
      query = url.slice(queryStart, queryEnd - 1),
      pairs = query.replace(/\+/g, " ").split("&"),
      parms = {}, i, n, v, nv;

  if (query === url || query === "") return;

  for (i = 0; i < pairs.length; i++) {
      nv = pairs[i].split("=", 2);
      n = decodeURIComponent(nv[0]);
      v = decodeURIComponent(nv[1]);

      if (!parms.hasOwnProperty(n)) parms[n] = [];
      parms[n].push(nv.length === 2 ? v : null);
  }
  return parms;
}

let checkHash = () => {
  let img = 'https://i1.wp.com/saedx.com/blog/wp-content/uploads/2019/01/saedx-blog-featured-70.jpg?fit=1200%2C500&ssl=1';
  if(!parseURLParams(document.location.href)){
    document.body.style.backgroundImage = `url('${img}')`;
    document.body.style.backgroundSize = 'cover'
    return;
  }
  let {id, rps} = parseURLParams(document.location.href);
  fetch(`${url}/verify-random-string`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      _id: id[0],
      verificationString: rps[0]
    })
  }).then((res) => res.json())
  .then((res) => {
    if(res.message == "verification string valid"){
      document.getElementById('main-cont').hidden = false;
    }else{
      document.body.style.backgroundImage = `url('${img}')`;
      document.body.style.backgroundSize = 'cover'
    }
  }).catch((err) => {
    document.body.style.backgroundImage = `url('${img}')`;
    document.body.style.backgroundSize = 'cover'
    console.log(error)
  })
}

let setPassword = () => {
  let p1 = document.getElementById('password1').value;
  let p2 = document.getElementById('password2').value;
  let {id, rps} = parseURLParams(document.location.href);
  if (p1 != p2) {
    let item = document.getElementById('alert-msg');
    item.hidden = false;
    item.className = ""
    item.classList.add('alert')
    item.classList.add('alert-warning')
    item.innerHTML = 'Password does not match. Please type same password';
  }else{
    fetch(`${url}/assign-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        _id: id[0],
        verificationString: rps[0],
        password: p1
      })
    }).then((res) => res.json())
    .then((res) => {
      let item = document.getElementById('alert-msg');
      item.hidden = false;
      item.className = ""
      item.classList.add('alert')
      item.classList.add('alert-success')
      item.innerHTML = 'Password reset successful';
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    })
  }
}