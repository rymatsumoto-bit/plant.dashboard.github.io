function loadView(viewName) {
  fetch(`views/${viewName}.html`)
    .then(res => res.text())
    .then(html => {
      document.getElementById("view-container").innerHTML = html;
      initializePlantDetail();
    });
}