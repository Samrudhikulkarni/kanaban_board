/* Dashboard logic */
var user = getSession();
if (!user) { location.href = "auth/login.html"; }

var tasks = [], filter = "all", query = "", view = "board";
var board = document.getElementById("board");
var EMPTY = {todo:"Nothing planned yet — add a note ✨", progress:"Pick a note and get going", done:"Finished notes land here 🎉", cancel:"Nothing dropped. Nice!"};

function save(){ set("sb_tasks_" + user.email, tasks); }

function visible(){
  return tasks.filter(function(t){
    return (filter === "all" || t.tags.indexOf(filter) > -1) &&
      (!query || (t.title+" "+t.desc).toLowerCase().indexOf(query) > -1) &&
      (view !== "pinned" || t.pin) && (view !== "remind" || t.remind);
  });
}

function renderFilters(){
  var h = '<i class="bi bi-funnel me-1"></i>';
  ["all"].concat(TAGS).forEach(function(t){
    h += '<button class="btn btn-sm rounded-pill '+(filter===t?"btn-ink":"btn-outline-secondary")+'" data-f="'+t+'">'+(t==="all"?"All":t)+'</button>';
  });
  document.getElementById("filters").innerHTML = h;
}

function render(){
  renderFilters();
  var list = visible(), g = function(id){ return document.getElementById(id); };
  document.querySelectorAll(".nv").forEach(function(b){ b.classList.toggle("active", b.dataset.view === view); });
  g("cPin").textContent = tasks.filter(function(t){ return t.pin; }).length;
  g("cRem").textContent = tasks.filter(function(t){ return t.remind; }).length;

  var live = tasks.filter(function(t){ return t.status !== "cancel"; }).length;
  var done = tasks.filter(function(t){ return t.status === "done"; }).length, pct = live ? Math.round(done/live*100) : 0;
  g("prog").innerHTML = '<span><b>'+done+'</b> of '+live+' notes completed</span><div class="bar"><i style="width:'+pct+'%"></i></div><span>'+pct+'%</span>';
  var inProg = tasks.filter(function(t){ return t.status === "progress"; }).length;
  var dueToday = tasks.filter(function(t){ return t.due === iso(0) && t.status !== "done" && t.status !== "cancel"; }).length;
  g("sub").textContent = inProg + " in progress · " + dueToday + " due today";

  g("viewBoard").classList.toggle("hide", view === "cal");
  g("viewCal").classList.toggle("hide", view !== "cal");
  if (view === "cal"){ renderCalendar(list); return; }

  board.innerHTML = "";
  COLS.forEach(function(c){
    var items = list.filter(function(t){ return t.status === c[0]; })
                    .sort(function(a,b){ return (b.pin?1:0) - (a.pin?1:0); });
    var lane = document.createElement("div"); lane.className = "lane st-" + c[0]; lane.dataset.s = c[0];
    var h = '<div class="lh"><span class="ico"><i class="bi '+c[2]+'"></i></span>'+c[1]+'<span class="n">'+items.length+'</span></div>';
    h += items.length ? "" : '<div class="empty">'+EMPTY[c[0]]+'</div>';
    items.forEach(function(t){ h += cardHTML(t); });
    lane.innerHTML = h; board.appendChild(lane);
  });
}

function remindToast(){
  var due = tasks.filter(function(t){ return t.remind && (t.status === "todo" || t.status === "progress") && t.due && t.due <= iso(1); });
  if (!due.length) return;
  document.getElementById("toastBody").innerHTML = "<b>"+due.length+"</b> note"+(due.length>1?"s need":" needs")+" attention: "
    + due.slice(0,3).map(function(t){ return esc(t.title); }).join(", ");
  bootstrap.Toast.getOrCreateInstance(document.getElementById("toast"), {delay:9000}).show();
}

Promise.all([window.sidebarReady, window.headerReady]).then(function(){
  if (!user) return;

  var first = user.name.split(" ")[0], hr = new Date().getHours();
  document.getElementById("hello").textContent = (hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening") + ", " + first + " 👋";
  document.getElementById("who").textContent = user.name;
  document.getElementById("avatar").textContent = first.charAt(0).toUpperCase();

  tasks = get("sb_tasks_" + user.email, null);
  if (!tasks){ tasks = []; save(); }

  document.querySelectorAll(".nv").forEach(function(b){ b.onclick = function(){ view = b.dataset.view; render(); }; });
  document.getElementById("filters").onclick = function(e){ var f = e.target.dataset.f; if (f){ filter = f; render(); } };
  document.getElementById("search").oninput = function(e){ query = e.target.value.toLowerCase(); render(); };
  document.getElementById("add").onclick = function(){ openModal(); };
  document.getElementById("out").onclick = function(){ setSession(null); location.href = "auth/login.html"; };
  document.getElementById("theme").onclick = function(){
    var t = document.documentElement.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-bs-theme", t); set("sb_theme", t);
  };

  board.addEventListener("change", function(e){
    var id = e.target.dataset.mv; if (!id) return;
    tasks.forEach(function(t){ if (t.id == id) t.status = e.target.value; }); save(); render();
  });
  board.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return; var d = b.dataset;
    if (d.pin) tasks.forEach(function(t){ if (t.id == d.pin) t.pin = !t.pin; });
    if (d.bell) tasks.forEach(function(t){ if (t.id == d.bell) t.remind = !t.remind; });
    if (d.pin || d.bell){ save(); render(); }
    if (d.del) {
      var deleteId = d.del;
      NotiquePopup.confirm("Are you sure you want to delete this note?", {
        title: "Delete note",
        confirmText: "Delete"
      }).then(function(confirmed){
        if (!confirmed) return;
        tasks = tasks.filter(function(t){ return t.id != deleteId; });
        save();
        render();
      });
    }
    if (d.ed) openModal(+d.ed);
  });

  initTilt(board); initDragDrop(board); initCalendar();
  render(); remindToast();
}, function(error){
  console.error("The dashboard layout could not be loaded.", error);
});
