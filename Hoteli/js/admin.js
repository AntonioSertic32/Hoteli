var Hoteli = [];
var Users = [];
var BrojHotela = 0;
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
  Statistika();
});

oDbUsers.on("value", function(oOdgovorPosluzitelja) {
  Users = [];
  BrojUsera = 0;
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
  Statistika();
});

// ---------------------------------------------------------------------------------------------------- ISPIS HOTELA

function PopuniTablicuDostupniHoteli() {
  var oTablicaHoteliHead = $("#tablica-hoteli");
  oTablicaHoteliHead.find("thead").empty();

  var oTablicaHoteli = $("#tablica-hoteli");
  oTablicaHoteli.find("tbody").empty();

  var row =
    "<tr><th>R.br</th>" +
    "<th>Naziv</th>" +
    "<th>Adresa</th>" +
    "<th>Grad</th>" +
    "<th>Županija</th>" +
    "<th>Kapacitet gostiju</th>" +
    "<th>Broj soba</th>" +
    "<th>Broj gostiju</th>" +
    "<th>Slobodno soba</th>" +
    "<th>Brisanje hotela</th><th>Ažuriranje hotela</th><th>Pregled rezervacija</th></tr>";
  oTablicaHoteliHead.find("thead").append(row);
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
      "</td><td><button onclick=\"ObrisiHotel('" +
      oHotel.hotel_id +
      '\')" type="button" id="delete" class="btn btn-danger"> <span class="glyphicon glyphicon-trash"></span></button></td><td><button onclick="ModalUrediHotel(\'' +
      oHotel.hotel_id +
      '\')" id="edit" class="btn btn-info" ><span  class="glyphicon glyphicon-edit"></span></button></td>' +
      "<td><button onclick='ModalPregledBoravka(" +
      oHotel.hotel_id +
      ")' class='btn btn-success'><span  class='glyphicon glyphicon-book'></span></button></td></tr>";
    oTablicaHoteli.find("tbody").append(sRow);
  });
}

// ---------------------------------------------------------------------------------------------------- PREGLED I BRISANJE BORAVKA

function ModalPregledBoravka(id) {
  Hoteli.forEach(function(hotel) {
    if (hotel.hotel_id == id) {
      $("#imehotela2").html(hotel.hotel_naziv);
    }
  });
  id--;

  var oHotelRef = oDb.ref("hoteli/" + id);
  oHotelRef.once("value", function(oOdgovorPosluzitelja) {
    var oHotel = oOdgovorPosluzitelja.val();

    var tablica_rezervacije = $("#rezervacije");
    tablica_rezervacije.find("tbody").empty();
    var sRezervacija = "";
    var rbr = 0;
    id++;
    aBoravakList.forEach(function(oBoravak) {
      if (id == oBoravak.hotelId) {
        sRezervacija =
          "<tr><td>" +
          ++rbr +
          ".</td><td>" +
          oBoravak.boravakKey +
          "</td><td>" +
          oBoravak.brojKreveta +
          '</td><td><button id="btnObrisi" type="button" onclick="obrisiRezervaciju(\'' +
          oBoravak.boravakKey +
          '\')"  class="btn btn-danger"><span class="glyphicon glyphicon-trash"></span></button></td></tr>';
        tablica_rezervacije.find("tbody").append(sRezervacija);
      }
    });
  });
  $("#pregledboravka").modal("show");
}

function obrisiRezervaciju(sBoravakKey) {
  var oBoravakRef = oDb.ref("boravak/" + sBoravakKey);
  oBoravakRef.remove();
  $("#pregledboravka").modal("hide");
  Statistika();
}

// ---------------------------------------------------------------------------------------------------- BRISANJE  HOTELA

function ObrisiHotel(id) {
  console.log(id);
  $("#obrisi-hotel").modal("show");

  Hoteli.forEach(function(hotel) {
    if (hotel.hotel_id == id) {
      $("#imehotela").html(hotel.hotel_naziv);
    }
  });

  id--;
  $("#btnDelete").attr("onclick", 'deletebtn("' + id + '")');
}

function deletebtn(id) {
  console.log(id);
  var oHotelRef = oDb.ref("hoteli/" + id);
  oHotelRef.remove();
  Statistika();
}

// ---------------------------------------------------------------------------------------------------- UREĐIVANJE HOTELA

function ModalUrediHotel(id) {
  id--;
  var oHotelRef = oDb.ref("hoteli/" + id);
  id++;
  oHotelRef.once("value", function(oOdgovorPosluzitelja) {
    var oHotel = oOdgovorPosluzitelja.val();
    console.log(oHotel);

    $("#inptNazivHotelaEdit").val(oHotel.Naziv);
    $("#txtAdresaHotelaEdit").val(oHotel.Adresa);
    $("#txtGradHotelaEdit").val(oHotel.Grad);
    $("#txtZupanijaHotelaEdit").val(oHotel.Županija);
    $("#txtKapacitetHotelaEdit").val(oHotel.Kapacitet);

    $("#btnEdit").attr("onclick", 'SpremiUredeniHotel("' + id + '")');

    $("#azuriraj-hotel").modal("show");
  });
}

function SpremiUredeniHotel(id) {
  id--;
  var oHotelRef = oDb.ref("hoteli/" + id);
  id++;

  var sHotelNaziv = $("#inptNazivHotelaEdit").val();
  var sHotelAdresa = $("#txtAdresaHotelaEdit").val();
  var sHotelGrad = $("#txtGradHotelaEdit").val();
  var sHotelZupanija = $("#txtZupanijaHotelaEdit").val();
  var sHotelKapacitet = $("#txtKapacitetHotelaEdit").val();

  oHotelRef.once("value", function(oOdgovorPosluzitelja) {
    var oHotel = oOdgovorPosluzitelja.val();
    console.log(oHotel);

    var oHotel = {
      Naziv: sHotelNaziv,
      Adresa: sHotelAdresa,
      Grad: sHotelGrad,
      Županija: sHotelZupanija,
      Kapacitet: sHotelKapacitet
    };
    oHotelRef.update(oHotel);
  });
  Statistika();
}

// ---------------------------------------------------------------------------------------------------- DODAVANJE HOTELA

function DodajHotel() {
  var sHotelId = BrojHotela + 1;
  var sHotelNaziv = $("#inptNazivHotela").val();
  var sHotelAdresa = $("#txtAdresaHotela").val();
  var sHotelGrad = $("#txtGradHotela").val();
  var sHotelZupanija = $("#txtZupanijaHotela").val();
  var sHotelKapacitet = $("#txtKapacitetHotela").val();

  var sKey = BrojHotela;

  var oHotel = {
    Id: sHotelId,
    Naziv: sHotelNaziv,
    Adresa: sHotelAdresa,
    Grad: sHotelGrad,
    Županija: sHotelZupanija,
    Kapacitet: sHotelKapacitet
  };

  var oZapis = {};
  oZapis[sKey] = oHotel;
  oDbHoteli.update(oZapis);
  Statistika();
}

// ---------------------------------------------------------------------------------------------------- STATISTIKA

function Statistika() {
  var brojHotela = 0;
  var brojGostiju = 0;
  var kapacitetLanca = 0;
  var brojSlobodnihMjesta = 0;

  aBoravakList.forEach(function(oBoravak) {
    brojGostiju += parseInt(oBoravak.brojKreveta);
  });

  Hoteli.forEach(function(hotel) {
    brojHotela++;
    kapacitetLanca += parseInt(hotel.hotel_kapacitet);
    var brojRezervacija = 0;

    aBoravakList.forEach(function(oBoravak) {
      if (hotel.hotel_id == oBoravak.hotelId) {
        brojRezervacija = 0;
        brojRezervacija += parseInt(oBoravak.brojKreveta);

        if (brojRezervacija % 2 == 1) {
          brojSlobodnihMjesta -= (brojRezervacija + 1) / 2;
        } else {
          brojSlobodnihMjesta -= brojRezervacija / 2;
        }
      }
    });
  });

  brojSlobodnihMjesta += kapacitetLanca / 2;

  var oTablica = $("#statistikaTablica");
  oTablica.find("tbody").empty();

  var sRow =
    '<tr id="TijeloStatistikaTablica"><td>' +
    brojHotela +
    "</td><td>" +
    brojGostiju +
    "</td><td>" +
    kapacitetLanca +
    "</td><td>" +
    brojSlobodnihMjesta +
    "</td></tr>";
  oTablica.append(sRow);
}

// ----------------------------------------------------------------------------------------------------  SIGN UP

const txtUserNameS = document.getElementById("SignUpUsername");
const txtEmailS = document.getElementById("SignUpInputMail");
const txtPasswordS = document.getElementById("SignUpPassword");
const btnSignUpS = document.getElementById("SignUpPotvrdi");

btnSignUpS.addEventListener("click", e => {
  const username = txtUserNameS.value;
  const email = txtEmailS.value;
  const pass = txtPasswordS.value;

  const txtUserORAdmin = document.getElementsByName("uloga");
  var result;
  for (i = 0; i < txtUserORAdmin.length; i++) {
    if (txtUserORAdmin[i].checked) {
      result = txtUserORAdmin[i].value;
    }
  }

  const useradmin = result;

  if ($(".alertconfirmdo").css("display") == "block") {
    SaveUser(username, email, pass, useradmin);
  }
});

function SaveUser(Username, Email, Password, useradmin) {
  var newUser = {
    email: Email,
    username: Username,
    password: Password,
    userORadmin: useradmin
  };

  var oZapis = {};
  oZapis[BrojUsera] = newUser;
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

// ----------------------------------------------------------------------------------------------------  PRETRAŽIVANJE

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
  console.log(PronadeniHoteli);

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
    "<th>Slobodno soba</th>" +
    "<th>Brisanje hotela</th><th>Ažuriranje hotela</th><th>Pregled rezervacija</th></tr>";
  oTablicaHoteliHead.find("thead").append(row);

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
          "</td><td><button onclick=\"ObrisiHotel('" +
          oHotel.hotel_id +
          '\')" type="button" id="delete" class="btn btn-danger"> <span class="glyphicon glyphicon-trash"></span></button></td><td><button onclick="ModalUrediHotel(\'' +
          oHotel.hotel_id +
          '\')" id="edit" class="btn btn-info" ><span  class="glyphicon glyphicon-edit"></span></button></td>' +
          "<td><button onclick='ModalPregledBoravka(" +
          oHotel.hotel_id +
          ")' class='btn btn-success'><span  class='glyphicon glyphicon-book'></span></button></td></tr>";
        oTablicaHoteli.find("tbody").append(sRow);
      }
    });
  });
}
