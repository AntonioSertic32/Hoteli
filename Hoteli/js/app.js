$(document).ready(function() {
  $("#pretragabtn").click(function(event) {
    event.preventDefault();
  });
});

$(document).ready(function() {
  $(" .thumbnail").hover(
    function() {
      $(this).animate(
        {
          marginTop: "-=1%"
        },
        200
      );
    },
    function() {
      $(this).animate(
        {
          marginTop: "0%"
        },
        200
      );
    }
  );
});

// ---------------------------------------------------------------------------------------------------- BUTTON ZA VRH STRANICE

mybutton = document.getElementById("myBtn");
window.onscroll = function() {
  scrollFunction();
};
function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}
function topFunction() {
  document.documentElement.scrollTop = 0;
}

// ---------------------------------------------------------------------------------------------------- OTVARANJE MODALA

const btnWellness = document.getElementById("wellnessispa");
const btnBars = document.getElementById("baroviiklubovi");
const btnRestorani = document.getElementById("restorani");

btnWellness.addEventListener("click", e => {
  $("#WellnessISpa").modal("show");
  console.log("aa");
});

btnBars.addEventListener("click", e => {
  $("#BaroviIKlubovi").modal("show");
});

btnRestorani.addEventListener("click", e => {
  $("#Restorani").modal("show");
});
