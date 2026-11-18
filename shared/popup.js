/* Reusable themed alert and confirmation dialogs */
(function(){
  var activeResolve = null;
  var modal, title, message, confirmButton, cancelButton;

  function initialize(){
    if (modal) return;

    var container = document.createElement("div");
    container.innerHTML =
      '<div class="modal fade notique-popup" id="notiquePopup" tabindex="-1" aria-labelledby="notiquePopupTitle" aria-describedby="notiquePopupMessage" aria-hidden="true">'
      + '<div class="modal-dialog modal-dialog-centered"><div class="modal-content">'
      + '<div class="modal-header border-0 pb-0"><span class="popup-icon"><i class="bi bi-pin-angle-fill"></i></span>'
      + '<button type="button" class="btn-close ms-auto" data-popup-cancel aria-label="Close"></button></div>'
      + '<div class="modal-body pt-3"><h5 class="modal-title fw-bold mb-2" id="notiquePopupTitle"></h5>'
      + '<p class="mb-0" id="notiquePopupMessage"></p></div>'
      + '<div class="modal-footer border-0 pt-0">'
      + '<button type="button" class="btn btn-outline-secondary rounded-pill px-4" data-popup-cancel></button>'
      + '<button type="button" class="btn btn-popup rounded-pill px-4" data-popup-confirm></button>'
      + '</div></div></div></div>';
    document.body.appendChild(container.firstChild);

    modal = document.getElementById("notiquePopup");
    title = document.getElementById("notiquePopupTitle");
    message = document.getElementById("notiquePopupMessage");
    confirmButton = modal.querySelector("[data-popup-confirm]");
    cancelButton = modal.querySelector('[data-popup-cancel].btn');

    confirmButton.addEventListener("click", function(){
      close(true);
    });
    modal.querySelectorAll("[data-popup-cancel]").forEach(function(button){
      button.addEventListener("click", function(){ close(false); });
    });
    modal.addEventListener("hidden.bs.modal", function(){
      if (activeResolve) finish(false);
    });
  }

  function finish(result){
    var resolve = activeResolve;
    activeResolve = null;
    if (resolve) resolve(result);
  }

  function close(result){
    if (!activeResolve) return;
    finish(result);
    bootstrap.Modal.getOrCreateInstance(modal).hide();
  }

  function show(options){
    initialize();
    if (activeResolve) return Promise.reject(new Error("A popup is already open."));

    options = options || {};
    title.textContent = options.title || (options.showCancel ? "Please confirm" : "Notique");
    message.textContent = options.message || "";
    confirmButton.textContent = options.confirmText || (options.showCancel ? "Confirm" : "OK");
    cancelButton.textContent = options.cancelText || "Cancel";
    cancelButton.classList.toggle("d-none", !options.showCancel);

    var result = new Promise(function(resolve){ activeResolve = resolve; });
    bootstrap.Modal.getOrCreateInstance(modal).show();
    return result;
  }

  window.NotiquePopup = {
    confirm: function(message, options){
      options = options || {};
      options.message = message;
      options.showCancel = true;
      return show(options);
    },
    alert: function(message, options){
      options = options || {};
      options.message = message;
      options.showCancel = false;
      return show(options);
    }
  };
})();
