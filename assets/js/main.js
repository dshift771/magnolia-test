/* Magnolia — minimalny JavaScript (bez bibliotek, ~1 kB po gzip).
   Dwie funkcje: menu mobilne oraz mapa ładowana dopiero na kliknięcie. */

(function () {
  "use strict";

  /* --- Menu mobilne --- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", String(!open));
      toggle.setAttribute("aria-expanded", String(!open));
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.getAttribute("data-open") === "true") {
        nav.setAttribute("data-open", "false");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* --- Mapa Google: fasada ładowana na żądanie ---
     Adres osadzenia trzymany jest w atrybucie data-map-src w pliku
     kontakt/index.html. Dopóki użytkownik nie kliknie, strona nie
     wysyła żadnego zapytania do Google. */
  var facade = document.querySelector(".map__facade");

  if (facade) {
    facade.addEventListener("click", function () {
      var box = facade.parentNode;
      var src = box.getAttribute("data-map-src");
      if (!src) return;

      var frame = document.createElement("iframe");
      frame.src = src;
      frame.title = "Mapa dojazdu do gabinetu Magnolia";
      frame.loading = "lazy";
      frame.referrerPolicy = "no-referrer-when-downgrade";
      frame.allowFullscreen = true;
      box.replaceChild(frame, facade);
    });
  }
})();
