/* Load the dashboard greeting and controls */
window.headerReady = fetch("layout/header.html")
  .then(function(response){
    if (!response.ok) throw new Error("Unable to load the dashboard header: " + response.status);
    return response.text();
  })
  .then(function(markup){
    var container = document.createElement("div");
    container.innerHTML = markup;
    var header = container.firstElementChild;
    var mount = document.getElementById("headerMount");
    if (!header || !mount) throw new Error("The dashboard header markup or mount point is invalid.");
    mount.replaceWith(header);
  });
