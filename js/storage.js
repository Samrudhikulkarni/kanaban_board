/* Shared helpers: storage, constants, formatting */
var mem = {};
function get(k, d){ try { var v = localStorage.getItem(k); if (v !== null) return JSON.parse(v); } catch(e){} return mem[k] !== undefined ? mem[k] : d; }
function set(k, v){ mem[k] = v; try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} }

var COLS = [["todo","To Do","bi-journal-text"],["progress","In Progress","bi-hourglass-split"],["done","Completed","bi-check-circle-fill"],["cancel","Cancelled","bi-x-circle-fill"]];
var TAGS = ["Important","Pending","Urgent","Bug","Feature"];

function getSession(){ return get("sb_session", null); }
function setSession(u){ set("sb_session", u); }
function getUsers(){ return get("sb_users", []); }
function saveUsers(u){ set("sb_users", u); }
function encode(p){ return btoa(unescape(encodeURIComponent(p))); }

function esc(s){ var d = document.createElement("div"); d.textContent = s; return d.innerHTML; }
function iso(n){ var d = new Date(); d.setDate(d.getDate()+n); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }
function fmt(s){ return s ? new Date(s+"T00:00").toLocaleDateString(undefined,{day:"numeric",month:"short"}) : "—"; }

/* Apply saved (or system) Bootstrap theme on every page */
(function(){
  var t = get("sb_theme", matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light");
  document.documentElement.setAttribute("data-bs-theme", t);
})();
