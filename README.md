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

<br>

>Zmiana hasła <br>
>/authorize/new-password

<br>

**Przyjmuje obiekt o strukturze:**<br>

| Nazwa pola | Zawartość |
| ----- | --------- |
| uid | Id użytkownika z linku |
| password | Nowe hasło użytkownika |
| passwordToken | Token z linku |

<br>

**Zwraca statusy:**<br>

| Numer | Co oznacza |
| ----- | ---------- |
| 202 | Hasło zmienione |
| 400 | Niepoprawny token lub token wygasł |
| 404 | Podany użytkownik nie istnieje |

### Administracja

#### Tylko head admin

<br>

>Dodawanie uczelni<br>
>/add-school

<br>

**Przyjmuje obiekt o strukturze:**<br>

| Nazwa pola | Zawartość |
| ----- | --------- |
| schoolName | Nazwa uczelni |

<br>

**Zwraca statusy:**<br>

| Numer | Co oznacza |
| ----- | ---------- |
| 201 | Dodano uczelnie |
| 409 | Uczelnia już istnieje |

<br>

>Usuwanie uczelni<br>
>/remove-school

<br>

**Przyjmuje obiekt o strukturze:**<br>

| Nazwa pola | Zawartość |
| ----- | --------- |
| schoolId | Id uczelni |

<br>

**Zwraca statusy:**<br>

| Numer | Co oznacza |
| ----- | ---------- |
| 200 | Uczelnia usunięta, wraz z wszystkimi kursami |
| 409 | Nie udało się usunąć wszystkich plików związanych z uczelnią |

<br>

>Dodawanie kursu do uczelni<br>
>/add-course

<br>


**Przyjmuje obiekt o strukturze:**<br>

| Nazwa pola | Zawartość |
| ----- | --------- |
| name | Nazwa kursu |
| schoolId | Id uczelni |

<br>

**Zwraca statusy:**<br>

| Numer | Co oznacza |
| ----- | ---------- |
| 201 | Dodano kurs |
| 404 | Nie znaleziono uczelni |
| 409 | Kurs z podaną nazwą już istnieje |

<br>

>Usuwanie kursu<br>
>/delete-course

<br>

**Przyjmuje obiekt o strukturze:**<br>

| Nazwa pola | Zawartość |
| ----- | --------- |
| id | Id kursu do usunięcia |

<br>

**Zwraca statusy:**<br>

| Numer | Co oznacza |
| ----- | ---------- |
| 200 | Kurs został usunięty wraz z pytaniami |
| 404 | Nie znaleziono podanego kursu |
| 409 | Nie udało się usunąć pliku |

<br>

#### Head admin + pod admini

>Dodawanie pytania<br>
>/add-question

**Przyjmuje dane w formacie FormData(klasa w JS'ie)**<br>

| Nazwa pola | Zawartość |
| ----- | --------- |
| question | String JSON'owy |
| courseId | Id kursu do którego chcecie dodać pytanie |
| correctAnswears | Tablica z obiektami(Też w formacie JSON'owym) |
| falseAnswears | Tablica z obiektami(Też w formacie JSON'owym) |
| questionType | Typ pytania(mixed/text) |
| images | Tablica z zdjęciami(opcjonalne) |

<br>

**Struktury obiektów w polu question, oraz w tablicach correctAnswears i falseAnswears**<br>

| Nazwa pola | Zawartość |
| ----- | --------- |
| type | mixed/text |
| value | Tekst naszego pytania |
| imageName | Pełna nazwa obrazka(wymagane jeżeli typ jest mixed) |

<br>

**Zwraca statusy:**<br>

| Numer | Co oznacza |
| ----- | ---------- |
| 201 | Pytanie zostało dodane |
| 404 | Nie znaleziono kursu |

<br>

W odpowiedzi dostaniecie pełny utworzony obiekt z pytaniem.

<br>

>Usuwanie pytania<br>
>/remove-question

<br>

**Przyjmuje obiekt o strukturze:**<br>

| Nazwa pola | Zawartość |
| ----- | --------- |
| courseId | Id kursu do którego należy pytanie |
| questionId | Id pytania do usunięcia |

<br>

**Zwraca statusy:**<br>

| Numer | Co oznacza |
| ----- | ---------- |
| 200 | Pytanie zostało usunięte |
| 404 | Nie znaleziono pytania/kursu |

>Modyfikacja pytania<br>
>/modify-question

<br>

Identycznie jak w dodawaniu pytania tylko z zmienionymi danymi.

<br>

