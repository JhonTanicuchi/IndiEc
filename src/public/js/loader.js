window.addEventListener("load", function () {
 
    document.getElementById("loader").classList.toggle("loader_close");
    document.getElementById("loader").classList.toggle("opacity-0");
 
  setTimeout(function () {
    document.getElementById("loader").classList.toggle("hidden");
  }, 300);
});
