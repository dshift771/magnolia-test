# Magnolia — strona statyczna

Cztery podstrony w czystym HTML, CSS i ~40 liniach JavaScriptu. Bez frameworka,
bez procesu budowania, bez backendu. Wrzucasz katalog na hosting i działa.

---

## 1. Uruchomienie lokalne

Otwarcie plików przez `file://` zepsuje ścieżki (są bezwzględne, zaczynają się od `/`).
Uruchom lokalny serwer:

```bash
cd magnolia
python3 -m http.server 8000
# otwórz http://localhost:8000
```

## 2. Publikacja

Katalog działa na dowolnym hostingu statycznego HTML-a:

| Hosting | Jak wgrać |
|---|---|
| Netlify / Cloudflare Pages | przeciągnij katalog do panelu, gotowe |
| Vercel | `vercel deploy` w katalogu |
| GitHub Pages | wypchnij do repozytorium, włącz Pages |
| Zwykły hosting FTP | skopiuj zawartość do `public_html` |

Adresy typu `/oferta/` działają dzięki plikom `index.html` w podkatalogach —
obsługuje to każdy serwer bez dodatkowej konfiguracji.

---

## 3. Co podmienić przed startem (kolejność ma znaczenie)

### 3.1 Domena — **zrób to najpierw**

W plikach jest adres zastępczy `https://magnolia-masaz.pl`. Występuje w znacznikach
`canonical`, `og:url`, danych strukturalnych, `sitemap.xml`, `robots.txt` i `llms.txt`.
Podmień go globalnie:

```bash
grep -rl "magnolia-masaz.pl" . | xargs sed -i 's|magnolia-masaz\.pl|TWOJA-DOMENA.pl|g'
```

Jeśli tego nie zrobisz, Google zobaczy odnośniki kanoniczne wskazujące na nieistniejącą
domenę i strona nie wejdzie do indeksu.

### 3.2 Dane firmy

Wyszukaj i zamień w każdym pliku HTML:

| Zastępnik | Gdzie występuje |
|---|---|
| `+48 000 000 000` | nagłówek, stopka, kontakt, dane strukturalne |
| `kontakt@magnolia-masaz.pl` | stopka, kontakt, dane strukturalne |
| `ul. Przykładowa 12/3`, `00-000 Warszawa` | stopka, kontakt, dane strukturalne |
| godziny otwarcia | stopka każdej podstrony + blok `openingHoursSpecification` w `index.html` |
| współrzędne `latitude` / `longitude` | `index.html`, dane strukturalne |

### 3.3 Teksty

Wszystkie fragmenty do wymiany są oznaczone w treści kursywą w nawiasach
kwadratowych: `[Tekst przykładowy — do zastąpienia…]`. Znajdziesz je tak:

```bash
grep -rn "przykładow" --include="*.html" .
```

Najważniejsze do napisania od zera:
- biogram terapeuty (`gabinet/index.html`) — prawdziwe kwalifikacje i szkolenia
  to najmocniejszy sygnał zaufania na całej stronie,
- opisy zabiegów (`oferta/index.html`),
- ceny (`oferta/index.html`) — pamiętaj, żeby zaktualizować też liczby w bloku
  `OfferCatalog` w sekcji `<head>` tej podstrony, inaczej Google pokaże stare stawki.

### 3.4 Zdjęcia

W `assets/img/` leżą tymczasowe pliki SVG. Podmień je na prawdziwe fotografie
gabinetu — najlepiej format WebP, szerokość maks. 1600 px, waga poniżej 200 kB.

| Plik | Gdzie się pokazuje | Proporcje |
|---|---|---|
| `hero.svg` | duże zdjęcie na stronie głównej | 4:5 (pionowe) |
| `gabinet.svg` | sekcja o gabinecie, dwa miejsca | 1:1 |
| `terapeuta.svg` | portret na podstronie o gabinecie | 1:1 |
| `detal.svg` | obraz dla social mediów | 3:2 |

Po podmianie na `.webp` zaktualizuj rozszerzenia w atrybutach `src` i `og:image`.
Zaktualizuj też atrybuty `alt` — opisz, co faktycznie widać na zdjęciu.

Własne zdjęcia zamiast stocków mają realne znaczenie: stock w tej branży czytany
jest jako „sieciówka”, nawet u jednoosobowego gabinetu.

### 3.5 Widget rezerwacji

W `kontakt/index.html` znajdź komentarz `MIEJSCE NA WIDGET REZERWACJI`.
Usuń blok `<div class="booking">…</div>` i wklej w to miejsce kod osadzenia od
dostawcy. W komentarzu są gotowe przykłady dla Booksy i Calendly.

Jedna zasada: skrypt zewnętrzny musi mieć atrybut `async` albo `defer`, inaczej
zablokuje renderowanie strony i zepsuje czas ładowania.

### 3.6 Mapa Google

W `kontakt/index.html` znajdź `data-map-src` i wklej właściwy adres osadzenia.
Skąd go wziąć: Mapy Google → wyszukaj adres → **Udostępnij** → **Umieść mapę** →
skopiuj wartość z `src="…"`.

Mapa ładuje się dopiero po kliknięciu w kafelek. To celowe — nieaktywna mapa Google
potrafi dociągnąć kilkaset kilobajtów skryptów przy każdym wejściu na stronę
i wysyła dane odwiedzającego do Google jeszcze zanim ktokolwiek o mapę poprosi.

---

## 4. SEO — co jest zrobione, co zostaje po Twojej stronie

### Zrobione w kodzie

- **Struktura nagłówków** — dokładnie jedno `<h1>` na podstronie, dalej `h2` i `h3`
  bez przeskoków poziomów.
- **Adresy URL** — krótkie, po polsku, bez rozszerzeń: `/`, `/oferta/`, `/gabinet/`, `/kontakt/`.
- **Tytuły i opisy meta** — unikalne na każdej podstronie, tytuły 43–70 znaków,
  opisy 129–163 znaki (mieszczą się w wynikach wyszukiwania bez ucięcia).
- **Dane strukturalne** — `DaySpa` z adresem, godzinami i telefonem na stronie głównej,
  `OfferCatalog` z cenami w ofercie, `FAQPage` na podstronie o gabinecie
  (daje szansę na rozwinięte wyniki w Google), `BreadcrumbList` na podstronach.
- **Open Graph** — poprawne podglądy przy udostępnianiu w mediach społecznościowych.
- **`sitemap.xml`, `robots.txt`, `llms.txt`** — mapa strony, reguły indeksacji
  i streszczenie dla asystentów AI.
- **Szybkość** — jeden arkusz CSS (~13 kB), jeden plik JS (~1 kB), brak bibliotek,
  obrazy z podanymi wymiarami (brak skakania układu), `loading="lazy"` poniżej
  pierwszego ekranu, `preconnect` do serwera czcionek, mapa na żądanie.
- **Dostępność** — link „przejdź do treści", widoczny fokus klawiatury, `aria-current`
  w nawigacji, obsługa `prefers-reduced-motion`.

### Do zrobienia po publikacji

1. **Wizytówka Google** (Profil Firmy) — dla lokalnej usługi to zwykle ważniejsze
   źródło klientów niż sama strona. Załóż, zweryfikuj adres, dodaj prawdziwe zdjęcia
   i te same godziny co na stronie (rozbieżność szkodzi).
2. **Google Search Console** — dodaj domenę, wyślij `sitemap.xml`, poproś o
   zindeksowanie każdej z czterech podstron.
3. **Certyfikat HTTPS** — u większości hostingów włącza się jednym kliknięciem.
4. **Opinie klientów** — po kilku pierwszych wizytach poproś o opinie w Google
   i dodaj sekcję z cytatami na stronę główną. Zrobiłem dla nich miejsce w układzie
   (styl `.pullquote`), wystarczy wstawić treść.
5. **Spójność NAP** — nazwa, adres i telefon muszą wyglądać identycznie na stronie,
   w wizytówce Google i w katalogach branżowych.

---

## 5. Struktura plików

```
magnolia/
├── index.html              Start
├── oferta/index.html       Oferta i cennik
├── gabinet/index.html      O gabinecie i FAQ
├── kontakt/index.html      Kontakt, rezerwacja, mapa
├── 404.html                Strona błędu
├── robots.txt              Reguły dla robotów
├── sitemap.xml             Mapa strony
├── llms.txt                Streszczenie dla asystentów AI
└── assets/
    ├── css/style.css       Cały wygląd, zmienne na górze pliku
    ├── js/main.js          Menu mobilne + mapa na kliknięcie
    └── img/                Logo, ikona, zdjęcia zastępcze
```

## 6. Zmiana wyglądu

Wszystkie kolory, odstępy i kroje pisma siedzą w bloku `:root` na początku
`assets/css/style.css`. Zmiana palety to podmiana sześciu wartości:

```css
--paper:    #FAF6EF;  /* tło */
--paper-2:  #F2EADC;  /* tło sekcji przeplatanych */
--sand:     #E2D5C0;  /* linie i obramowania */
--ink:      #241F1B;  /* tekst */
--ink-soft: #6E6153;  /* tekst drugorzędny */
--sun:      #F2CE45;  /* akcent — żółć z logo */
```

Kroje pisma: **Fraunces** (nagłówki, ciepły serif o zaokrąglonych szeryfach)
i **Karla** (treść, humanistyczny grotesk). Oba są darmowe, mają pełne polskie
znaki diakrytyczne i ładują się z Google Fonts. Podmiana: jedna linia `<link>`
w każdym pliku HTML plus dwie zmienne `--font-display` i `--font-body` w CSS.

Jeśli chcesz uniezależnić stronę od Google Fonts, pobierz pliki `.woff2`,
wrzuć do `assets/fonts/` i zamień `<link>` na regułę `@font-face` — strona
będzie wtedy ładować się jeszcze szybciej i nie wyśle żadnego żądania na zewnątrz.
