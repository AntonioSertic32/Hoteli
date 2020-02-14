var Hoteli = [];

var BrojHotela = 0;

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
    "<th>Slobodno soba</th>" +
    "<th>Prijava boravka</th><th>Karta</th></tr>";
  oTablicaHoteliHead.append(row);

  oTablicaHoteli.find("tbody");
  var broj = 0;
  Hoteli.forEach(function(oHotel) {
    var brojSlobodnihMjesta = oHotel.hotel_kapacitet / 2;
    var brojRezervacija = 0;
    var brojGostiju = 0;
    var HotelDisabled = "";

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
    if (brojSlobodnihMjesta == 0) {
      HotelDisabled = "disabled";
    }

    var punaAdresa =
      "http://maps.google.com/?q=" +
      oHotel.hotel_naziv +
      " " +
      oHotel.hotel_grad;

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
      "</td><td><button " +
      HotelDisabled +
      " onclick='ModalUnesiBoravak(" +
      oHotel.hotel_id +
      ")' class='btn btn-info'><span  class='glyphicon glyphicon-edit'></span></button></td>" +
      "<td><a class='fas fa-map-marker-alt' target='_blank' href='" +
      punaAdresa +
      "'</a></td</tr>";
    oTablicaHoteli.append(sRow);
  });
}

// --------------------------------------------------------------------------------------------- UNOS BORAVKA

function ModalUnesiBoravak(id) {
  var brojSlobodnihMjesta;

  Hoteli.forEach(function(hotel) {
    if (hotel.hotel_id == id) {
      $("#imehotela").html(hotel.hotel_naziv);
      brojSlobodnihMjesta = hotel.hotel_kapacitet / 2;

      aBoravakList.forEach(function(oBoravak) {
        if (hotel.hotel_id == oBoravak.hotelId) {
          var brojRezervacija = 0;
          brojRezervacija += parseInt(oBoravak.brojKreveta);
          if (brojRezervacija % 2 == 1) {
            brojSlobodnihMjesta -= (brojRezervacija + 1) / 2;
          } else {
            brojSlobodnihMjesta -= brojRezervacija / 2;
          }
        }
      });
    }
  });

  $("#brojslobodnih").html(brojSlobodnihMjesta);

  $("#unosboravka").modal("show");

  $("#btnUnosBoravka").attr(
    "onclick",
    "UnosBoravka(" + id + ", " + brojSlobodnihMjesta + ")"
  );
}

function UnosBoravka(id, brojSlobodnihMjesta) {
  var sBrojKreveta = $("#brojOsoba").val();
  var sHotelId = id;

  if (
    parseInt(sBrojKreveta) / 2 > brojSlobodnihMjesta ||
    !parseInt(sBrojKreveta)
  ) {
    alert("Nedovoljan broj kreveta.");
    return false;
  }
  id--;
  var sKeyy = id;
  id++;

  var oHotel;
  Hoteli.forEach(function(hotel) {
    if (hotel.hotel_id == id) {
      oHotel = {
        Id: sHotelId,
        Naziv: hotel.hotel_naziv,
        Adresa: hotel.hotel_adresa,
        Grad: hotel.hotel_grad,
        Županija: hotel.hotel_zupanija,
        Kapacitet: parseInt(hotel.hotel_kapacitet)
      };
    }
  });

  var oZapiss = {};
  oZapiss[sKeyy] = oHotel;
  oDbHoteli.update(oZapiss);

  var sKey = firebase
    .database()
    .ref()
    .child("Boravak")
    .push().key;

  var oBoravak = {
    brojKreveta: sBrojKreveta,
    hotelId: sHotelId
  };

  var oZapis = {};
  oZapis[sKey] = oBoravak;
  oDbBoravak.update(oZapis);
  $("#unosboravka").modal("hide");
}

// ---------------------------------------------------------------------------------------------  PRETRAŽIVANJE

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
    "<th>Slobodno soba</th>" +
    "<th>Prijava boravka</th><th>Karta</th></tr>";
  oTablicaHoteliHead.append(row);

  oTablicaHoteli.find("tbody");
  var broj = 0;
  Hoteli.forEach(function(oHotel) {
    PronadeniHoteli.forEach(function(ccHotel) {
      if (oHotel.hotel_naziv == ccHotel.hotel_naziv) {
        var brojSlobodnihMjesta = oHotel.hotel_kapacitet / 2;
        var brojRezervacija = 0;
        var brojGostiju = 0;
        var HotelDisabled = "";

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

        if (brojSlobodnihMjesta == 0) {
          HotelDisabled = "disabled";
        }

        var punaAdresa =
          "http://maps.google.com/?q=" +
          oHotel.hotel_naziv +
          " " +
          oHotel.hotel_grad;

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
          "</td><td><button " +
          HotelDisabled +
          " onclick='ModalUnesiBoravak(" +
          oHotel.hotel_id +
          ")' class='btn btn-info'><span  class='glyphicon glyphicon-edit'></span></button></td>" +
          "<td><a class='fas fa-map-marker-alt' target='_blank' href='" +
          punaAdresa +
          "'</a></td</tr>";
        oTablicaHoteli.append(sRow);
      }
    });
  });
}
