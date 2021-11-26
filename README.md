# server
Zero spaghetti kodu ok

# Endopinty:<br>

### Autoryzacja

> **Rejestracja:**<br>
  /register<br>

**Przyjmuje obiekt o strukturze:**<br><br>

| Nazwa pola | Zawartość |
| ----- | --------- |
| username | Nazwa użytkownika(znaki alfanumeryczne) |
| email | Email jakim użytkownik będzie się logował |
| password | Hasło użytkownika |

**Zwraca statusy:**<br><br>

| Numer | Co oznacza |
| ----- | ---------- |
| 201 | Utworzono nowego uzytkownika |
| 400 | Niepoprawne dane wysłane z frontendu |
| 403 | Email juz istnieje |
| 409 | Chuj wie co sie odjebalo w mongodb ale nie udalo sie utworzyc usera |

<br><br>

> Logowanie:<br>
  /login

**Przyjmuje obiekt o strukturze:**<br>

| Nazwa pola | Zawartość |
| ----- | --------- |
| email | Email jakim użytkownik będzie się logował |
| password | Hasło użytkownika |
| rememberMe | Czy użytkownik chce być zapamiętany(true/false) |


**Zwraca statusy:**<br>

| Numer | Co oznacza |
| ----- | ---------- |
| 200 | Zalogowano |
| 400 | Hasla sa różne |
| 404 | Nie znaleziono uzytkownika z podanym adresem mailowym |

W przypadku zalogowania zwrocony zostanie obiekt w ktorym bedzie pole UID(ID usera z bazy), token(Obiekt w ktorym bedzie pole token(wygenerowany token), expire(data wygasniecia)), oraz w przypadku klikniecia zapamietaj mnie(opcjonalne) kolejny token wygasajacy po 30 dniach. Te dane nalezy zapisac na froncie + do kazdego autoryzowanego zapytania ustawic headery:<br>

| Nazwa | Zawartość |
| ----- | --------- |
| token | Ten wygasajacy co 1h |
| uid | ID uzytkownika |
| rememberToken | Token wygasający po 30 dniach(opcjonalny) |

**W przeciwnym wyppadku serwer zwroci nieautoryzowanego uzytkownika(status 401)**
<br><br>

>Autoryzacja konta<br>
>/authorize/:uid/:token

<br>

Potwierdzenie że użytkownik podał prawdziwy adres mailowy.

<br>

**W adresie w polach powinny znajdować się**

<br>

| Nazwa | Zawartość |
| ----- | --------- |
| uid | Adres użytkownika |
| token | Automatycznie wygenerowany token |

<br>

**Zwraca statusy:**<br>

| Numer | Co oznacza |
| ----- | ---------- |
| 200 | Konto zostało zweryfikowane |
| 403 | Użytkownik jest już zweryfikowany lub tokeny się nie zgadzają |
| 404 | Nie znaleziono takiego użytkownika |

<br><br>

>Odzyskiwanie hasła<br>
>/authorize/get-reset

<br>

**Przyjmuje obiekt o strukturze:**<br><br>

| Nazwa pola | Zawartość |
| ----- | --------- |
| email | Email użytkownika którym się rejestrował |

<br>

**Zwraca statusy:**<br>

| Numer | Co oznacza |
| ----- | ---------- |
| 200 | Wysłano email z tokenem |
| 404 | Nie znaleziono użytkownika z podanym adresem mailowym |

<br><br>

>Sprawdzenie tokena do resetu hasła<br>
>/authorize/check-token

Ten endpoint służy do sprawdzenia czy token z maila jest poprawny, oraz czy nie wygasł, na podstawie informacji zwrotnej powinniście zadecydować czy wyświetlić użytkownikowi formularz zmiany hasła.<br>

**Przyjmuje obiekt o strukturze:**<br>

| Nazwa pola | Zawartość |
| ----- | --------- |
| _id | Id użytkownika z linku |
| token | Token z linku |

<br>

**Zwraca statusy:**<br>

| Numer | Co oznacza |
| ----- | ---------- |
| 200 | Token jest poprawny |
| 404 | Nie znaleziono użytkownika z podanym id |
| 400 | Niepoprawny token lub token wygasł |


