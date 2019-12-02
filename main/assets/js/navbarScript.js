let header = document.getElementById("stickyNav");
let sticky = header.offsetTop;
window.onscroll = function(){
	if (window.pageYOffset > sticky) {
			header.classList.add("sticky");
		} else {
		header.classList.remove("sticky");
		}
}