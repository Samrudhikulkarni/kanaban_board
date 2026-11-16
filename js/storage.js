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

function seedTasks(){
  return [
    {id:1,remind:true,title:"Design login page",desc:"Sketch the register and login forms.",start:iso(-2),due:iso(1),status:"todo",style:0,tags:["Important"]},
    {id:2,pin:true,remind:true,title:"Build kanban board",desc:"Four columns with drag and drop.",start:iso(-1),due:iso(5),status:"progress",style:1,tags:["Feature","Urgent"]},
    {id:3,title:"Set up project",desc:"Folders, HTML, CSS and JS files.",start:iso(-6),due:iso(-3),status:"done",style:3,tags:[]},
    {id:4,title:"Old idea: dark mode v2",desc:"Dropped for now.",start:iso(-8),due:iso(-4),status:"cancel",style:2,tags:["Pending"]}
  ];
}

/* Apply saved (or system) Bootstrap theme on every page */
(function(){
  var t = get("sb_theme", matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light");
  document.documentElement.setAttribute("data-bs-theme", t);
})();
