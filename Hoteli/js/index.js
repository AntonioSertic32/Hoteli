var Hoteli = [];
var BrojHotela = 0;
var Users = [];
var BrojUsera = 0;

var aBoravakList = [];
oDbBoravak.on("value", function(oOdgovorPosluzitelja) {
  aBoravakList = [];
  oOdgovorPosluzitelja.forEach(function(oBoravakSnapshot) {
    var sBoravakKey = oBoravakSnapshot.key;
    var oBoravak = oBoravakSnapshot.val();
    aBoravakList.push({
      boravakKey: sBoravakKey,
      brojKreveta: oBoravak.brojKreveta,
      hotelId: oBoravak.hotelId
    });
  });
  PopuniTablicuDostupniHoteli();
  console.log(aBoravakList);
});

oDbUsers.on("value", function(oOdgovorPosluzitelja) {
  Users = [];
  oOdgovorPosluzitelja.forEach(function(oUserSnapshot) {
    var sUserKey = oUserSnapshot.key;
    var oUser = oUserSnapshot.val();
    BrojUsera++;
    Users.push({
      userORadmin: oUser.userORadmin,
      username: oUser.username,
      email: oUser.email,
      password: oUser.password
    });
  });
});

oDbHoteli.on("value", function(oOdgovorPosluzitelja) {
  Hoteli = [];
  BrojHotela = 0;
  oOdgovorPosluzitelja.forEach(function(oHotelSnapshot) {
    var sHotelKey = oHotelSnapshot.key;
    var oHotel = oHotelSnapshot.val();
    BrojHotela++;
    Hoteli.push({
      hotel_id: BrojHotela,
      hotel_naziv: oHotel.Naziv,
      hotel_adresa: oHotel.Adresa,
      hotel_grad: oHotel.Grad,
      hotel_zupanija: oHotel.Županija,
      hotel_kapacitet: oHotel.Kapacitet
    });
  });

  Hoteli.sort(function(a, b) {
    var textA = a.hotel_naziv.toUpperCase();
    var textB = b.hotel_naziv.toUpperCase();
    return textA < textB ? -1 : textA > textB ? 1 : 0;
  });

  console.log(Hoteli);
  PopuniTablicuDostupniHoteli();
});

// --------------------------------------------------------------------------------------------- ISPIS U TABLICU

function PopuniTablicuDostupniHoteli() {
  var oTablicaHoteliHead = $("#tablica-hoteli");
  oTablicaHoteliHead.find("thead").empty();

  var oTablicaHoteli = $("#tablica-hoteli");
  oTablicaHoteli.find("tbody").empty();

  oTablicaHoteliHead.find("thead");
  var row =
    "<tr><th>R.br</th>" +
    "<th>Naziv</th>" +
    "<th>Adresa</th>" +
    "<th>Grad</th>" +
    "<th>Županija</th>" +
    "<th>Kapacitet gostiju</th>" +
    "<th>Broj soba</th>" +
    "<th>Broj gostiju</th>" +
    "<th>Slobodno soba</th></tr>";
  oTablicaHoteliHead.append(row);

  oTablicaHoteli.find("tbody");
  var broj = 0;
  Hoteli.forEach(function(oHotel) {
    var brojSlobodnihMjesta = oHotel.hotel_kapacitet / 2;
    var brojRezervacija = 0;
    var brojGostiju = 0;

    aBoravakList.forEach(function(oBoravak) {
      if (oHotel.hotel_id == oBoravak.hotelId) {
        brojRezervacija = 0;
        brojRezervacija += parseInt(oBoravak.brojKreveta);
        if (brojRezervacija % 2 == 1) {
          brojSlobodnihMjesta -= (brojRezervacija + 1) / 2;
        } else {
          brojSlobodnihMjesta -= brojRezervacija / 2;
        }

        brojGostiju += brojRezervacija;
      }
    });

    broj++;

    var sRow =
      "<tr><td>" +
      broj +
      "</td><td>" +
      oHotel.hotel_naziv +
      "</td><td>" +
      oHotel.hotel_adresa +
      "</td><td>" +
      oHotel.hotel_grad +
      "</td><td>" +
      oHotel.hotel_zupanija +
      "</td><td>" +
      oHotel.hotel_kapacitet +
      "</td><td>" +
      oHotel.hotel_kapacitet / 2 +
      "</td><td>" +
      brojGostiju +
      "</td><td>" +
      brojSlobodnihMjesta +
      "</td></tr>";
    oTablicaHoteli.append(sRow);
  });
}

// --------------------------------------------------------------------------------------------- LOGIN

const txtEmailL = document.getElementById("LogInInputMail");
const txtPasswordL = document.getElementById("LogInPassword");
const btnLoginL = document.getElementById("LogInPotvrdi");

// Add login event
btnLoginL.addEventListener("click", e => {
  // Get email and pass
  const email = txtEmailL.value;
  const pass = txtPasswordL.value;
  // Sign in
  TocanUser(email, pass);
});

function TocanUser(Email, Password) {
  var brojac = 0;
  var aORu = "";
  for (var i = 0; i < Users.length; i++) {
    if (Email == Users[i].email && Password == Users[i].password) {
      brojac++;
      aORu = Users[i].userORadmin;
    }
  }
  if (brojac > 0) {
    console.log("Uspješno prijavljeni!");
    $("#passwordsuccess1").css("display", "block");
    $("#loginerror1").css("display", "none");

    if (aORu == "admin") {
      window.open("admin.html", "_self", false);
    } else {
      window.open("user.html", "_self", false);
    }
  } else {
    console.log("Error!");
    $("#loginerror1").css("display", "block");
    $("#passwordsuccess1").css("display", "none");
  }
}

// --------------------------------------------------------------------------------------------- SIGN UP

const txtUserNameS = document.getElementById("SignUpUsername");
const txtEmailS = document.getElementById("SignUpInputMail");
const txtPasswordS = document.getElementById("SignUpPassword");
const btnSignUpS = document.getElementById("SignUpPotvrdi");
const txtUserORAdmin = document.getElementById("checkKorisnika").value;

// create user event
btnSignUpS.addEventListener("click", e => {
  // Get email and pass
  const username = txtUserNameS.value;
  const email = txtEmailS.value;
  const pass = txtPasswordS.value;
  const useradmin = txtUserORAdmin;

  // Create user
  if ($(".alertconfirmdo").css("display") == "block") {
    SaveUser(username, email, pass, useradmin);
  }
});

function SaveUser(Username, Email, Password, useradmin) {
  var sKey = BrojUsera;

  var oUser = {
    email: Email,
    username: Username,
    password: Password,
    userORadmin: useradmin
  };

  var oZapis = {};
  oZapis[sKey] = oUser;
  oDbUsers.update(oZapis);
}

$("#SignUpPassword, #SignUpConfirmPassword").on("keyup", function() {
  if ($("#SignUpPassword").val() == $("#SignUpConfirmPassword").val()) {
    $(".alertconfirmdo").css("display", "block");
    $(".alertconfirmnot").css("display", "none");
  } else {
    $(".alertconfirmnot").css("display", "block");
    $(".alertconfirmdo").css("display", "none");
  }
  if (
    $("#SignUpPassword").val() == false ||
    $("#SignUpConfirmPassword").val() == false
  ) {
    $(".alertconfirmnot").css("display", "none");
    $(".alertconfirmdo").css("display", "none");
  }
});

$("#SignUpUsername").on("keyup", function() {
  if ($("#SignUpUsername").val() == false) {
    $(".glyphuserremove").css("display", "inline-block");
    $(".praznavrijednost1").html("-Korisničko ime je obavezno!");
    $(".glyphuserok").css("display", "none");
  } else {
    $(".praznavrijednost1").html("-To korisničko ime je zauzeto!");
    var userlength = Users.length;
    var Brojac1 = 0;
    for (var i = 0; i < userlength; i++) {
      if ($("#SignUpUsername").val() == Users[i].username) {
        Brojac1++;
      }
    }
    if (Brojac1 == 1) {
      $(".glyphuserremove").css("display", "inline-block");
      $(".glyphuserok").css("display", "none");
    } else {
      $(".glyphuserok").css("display", "inline-block");
      $(".glyphuserremove").css("display", "none");
    }
  }
});

$("#SignUpInputMail").on("keyup", function() {
  if ($("#SignUpInputMail").val() == false) {
    $(".glyphmailremove").css("display", "inline-block");
    $(".praznavrijednost2").html("-Email je obavezan!");
    $(".glyphmailok").css("display", "none");
  } else {
    $(".praznavrijednost2").html("-Taj email je već registriran!");
    var userlength = Users.length;
    var Brojac2 = 0;
    for (var i = 0; i < userlength; i++) {
      if ($("#SignUpInputMail").val() == Users[i].email) {
        Brojac2++;
      }
    }
    if (Brojac2 == 1) {
      $(".glyphmailremove").css("display", "inline-block");
      $(".glyphmailok").css("display", "none");
    } else {
      $(".glyphmailok").css("display", "inline-block");
      $(".glyphmailremove").css("display", "none");
    }
  }
});

// --------------------------------------------------------------------------------------------- PRETRAŽIVANJE

function Pretrazi() {
  var Ime = $("#poimenu").val();
  var Grad = $("#pogradu").val();
  var PronadeniHoteli = [];

  Hoteli.forEach(function(hotel) {
    if (Ime != "" && Grad != "") {
      if (
        hotel.hotel_naziv.toLowerCase().includes(Ime.toLowerCase()) &&
        hotel.hotel_grad.toLowerCase().includes(Grad.toLowerCase())
      ) {
        PronadeniHoteli.push(hotel);
      }
    } else {
      if (Ime != "") {
        if (hotel.hotel_naziv.toLowerCase().includes(Ime.toLowerCase())) {
          PronadeniHoteli.push(hotel);
        }
      } else {
        if (hotel.hotel_grad.toLowerCase().includes(Grad.toLowerCase())) {
          PronadeniHoteli.push(hotel);
        }
      }
    }
  });

  var oTablicaHoteliHead = $("#tablica-hoteli");
  oTablicaHoteliHead.find("thead").empty();

  var oTablicaHoteli = $("#tablica-hoteli");
  oTablicaHoteli.find("tbody").empty();

  oTablicaHoteliHead.find("thead");
  var row =
    "<tr><th>R.br</th>" +
    "<th>Naziv</th>" +
    "<th>Adresa</th>" +
    "<th>Grad</th>" +
    "<th>Županija</th>" +
    "<th>Kapacitet gostiju</th>" +
    "<th>Broj soba</th>" +
    "<th>Broj gostiju</th>" +
    "<th>Slobodno soba</th></tr>";
  oTablicaHoteliHead.append(row);

  oTablicaHoteli.find("tbody");
  var broj = 0;
  Hoteli.forEach(function(oHotel) {
    PronadeniHoteli.forEach(function(ccHotel) {
      if (oHotel.hotel_naziv == ccHotel.hotel_naziv) {
        var brojSlobodnihMjesta = oHotel.hotel_kapacitet / 2;
        var brojRezervacija = 0;
        var brojGostiju = 0;

        aBoravakList.forEach(function(oBoravak) {
          if (oHotel.hotel_id == oBoravak.hotelId) {
            brojRezervacija = 0;
            brojRezervacija += parseInt(oBoravak.brojKreveta);
            if (brojRezervacija % 2 == 1) {
              brojSlobodnihMjesta -= (brojRezervacija + 1) / 2;
            } else {
              brojSlobodnihMjesta -= brojRezervacija / 2;
            }

            brojGostiju += brojRezervacija;
          }
        });

        broj++;

        var sRow =
          "<tr><td>" +
          broj +
          "</td><td>" +
          oHotel.hotel_naziv +
          "</td><td>" +
          oHotel.hotel_adresa +
          "</td><td>" +
          oHotel.hotel_grad +
          "</td><td>" +
          oHotel.hotel_zupanija +
          "</td><td>" +
          oHotel.hotel_kapacitet +
          "</td><td>" +
          oHotel.hotel_kapacitet / 2 +
          "</td><td>" +
          brojGostiju +
          "</td><td>" +
          brojSlobodnihMjesta +
          "</td></tr>";
        oTablicaHoteli.append(sRow);
      }
    });
  });
}
