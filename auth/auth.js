/* Login + Register logic (mode comes from <body data-mode="...">) */
var mode = document.body.dataset.mode;
if (getSession()) { location.href = "../index.html"; }

document.getElementById("aGo").onclick = function(){
  var email = document.getElementById("aEmail").value.trim().toLowerCase();
  var pass = document.getElementById("aPass").value;
  var err = document.getElementById("aErr");
  var users = getUsers();

  if (!/^\S+@\S+\.\S+$/.test(email)) { err.textContent = "Enter a valid email."; return; }
  if (pass.length < 6) { err.textContent = "Password must be at least 6 characters."; return; }

  var user;
  if (mode === "register") {
    var name = document.getElementById("aName").value.trim();
    if (!name) { err.textContent = "Please enter your name."; return; }
    if (users.some(function(u){ return u.email === email; })) { err.textContent = "Account already exists. Please login."; return; }
    users.push({ name: name, email: email, pass: encode(pass) });
    saveUsers(users);
    user = { name: name, email: email };
  } else {
    var u = users.filter(function(x){ return x.email === email && x.pass === encode(pass); })[0];
    if (!u) { err.textContent = "Wrong email or password."; return; }
    user = { name: u.name, email: u.email };
  }
  setSession(user);
  location.href = "../index.html";
};
