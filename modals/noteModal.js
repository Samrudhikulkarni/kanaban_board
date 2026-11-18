/* Load the note modal markup from its HTML fragment */
window.noteModalReady = fetch("modals/noteModal.html")
  .then(function(response){
    if (!response.ok) throw new Error("Unable to load the note modal: " + response.status);
    return response.text();
  })
  .then(function(markup){
    var container = document.createElement("div");
    container.innerHTML = markup;
    var modal = container.firstElementChild;
    if (!modal || modal.id !== "modal") throw new Error("The note modal markup is invalid.");
    document.body.appendChild(modal);
  });
