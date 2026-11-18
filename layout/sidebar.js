/* Load the shared sidebar markup */
window.sidebarReady = fetch("layout/sidebar.html")
  .then(function(response){
    if (!response.ok) throw new Error("Unable to load the sidebar: " + response.status);
    return response.text();
  })
  .then(function(markup){
    var container = document.createElement("div");
    container.innerHTML = markup;
    var sidebar = container.firstElementChild;
    var mount = document.getElementById("sidebarMount");
    if (!sidebar || sidebar.tagName !== "ASIDE" || !mount) throw new Error("The sidebar markup or mount point is invalid.");
    mount.replaceWith(sidebar);
  });
