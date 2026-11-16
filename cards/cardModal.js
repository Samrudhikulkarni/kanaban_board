/* Add / edit card — Bootstrap modal */
var editId = null;
var bsModal = new bootstrap.Modal(document.getElementById("modal"));
var $f = function(id){ return document.getElementById(id); };

$f("fStatus").innerHTML = COLS.map(function(c){ return '<option value="'+c[0]+'">'+c[1]+'</option>'; }).join("");
$f("fTags").innerHTML = TAGS.map(function(t){
  return '<input type="checkbox" class="btn-check" id="tg_'+t+'" value="'+t+'" autocomplete="off">'
       + '<label class="btn btn-sm rounded-pill btn-outline-'+TAGCLS[t]+'" for="tg_'+t+'">'+t+'</label>';
}).join("");

function openModal(id, dueDate){
  editId = id || null;
  var t = id ? tasks.filter(function(x){ return x.id === id; })[0]
             : {title:"",desc:"",start:iso(0),due:dueDate||iso(3),status:"todo",style:0,tags:[],pin:false,remind:false};
  if (!id && dueDate && dueDate < t.start) t.start = dueDate;
  $f("mTitle").textContent = id ? "Edit note" : "New note";
  $f("fTitle").value = t.title; $f("fDesc").value = t.desc;
  $f("fStart").value = t.start; $f("fDue").value = t.due;
  $f("fStatus").value = t.status; $f("fStyle").value = t.style;
  $f("fPin").checked = !!t.pin; $f("fRemind").checked = !!t.remind;
  $f("mErr").textContent = "";
  document.querySelectorAll("#fTags input").forEach(function(i){ i.checked = t.tags.indexOf(i.value) > -1; });
  bsModal.show();
}

$f("mSave").onclick = function(){
  var title = $f("fTitle").value.trim(), s = $f("fStart").value, d = $f("fDue").value;
  if (!title){ $f("mErr").textContent = "Give your note a title."; return; }
  if (s && d && d < s){ $f("mErr").textContent = "Due date can’t be before start."; return; }
  var data = {
    title: title, desc: $f("fDesc").value.trim(), start: s, due: d,
    status: $f("fStatus").value, style: +$f("fStyle").value, pin: $f("fPin").checked, remind: $f("fRemind").checked,
    tags: Array.prototype.filter.call(document.querySelectorAll("#fTags input"), function(i){ return i.checked; }).map(function(i){ return i.value; })
  };
  if (editId){ tasks.forEach(function(t){ if (t.id === editId) Object.assign(t, data); }); }
  else { data.id = Date.now(); tasks.push(data); }
  save(); bsModal.hide(); render();
};
