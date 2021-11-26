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
