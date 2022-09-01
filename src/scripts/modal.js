var modal = document.getElementById("myModal");
var btn = document.getElementsByClassName('btn');
var span = document.getElementsByClassName("close")[0];

for (var i = 0; i < btn.length; i++) {
	btn[i].addEventListener('click', function() {
		openModalWindow();
	})
  }
span.onclick = function() {
	modal.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
function openModalWindow() {
	modal.style.display = "block";
}