# server
Zero spaghetti kodu ok

# Endopinty:<br>

> **Rejestracja:**<br>
  /register<br>
<br>
Przyjmuje obiekt o strukturze:<br>

{<br>
  username: username,<br>
  email: email, <br>
  password: password<br>
}<br>

Zwraca statusy:<br><br>

201 - Utworzono nowego uzytkownika<br>
400 - Niepopprawne dane wyslane z frontendu<br>
403 - Email juz istnieje<br>
409 - Chuj wie co sie odjebalo w mongodb ale nie udalo sie utworzyc usera<br>


> Logowanie:<br>
  /login

Przyjmuje obiekt o strukturze:<br>
{<br>
  email: email,<br>
  password: password,<br>
  rememberMe: rememberMe(bool)<br>
}<br>

Zwraca statusy:<br>

200 - Zalogowano<br>
400 - Hasla sa rozne<br>
404 - Nie znaleziono uzytkownika z podanym adresem mailowym<br>
Inne(Prawdopodobnie 500+) - Cos sie odjebalo chuj wie co<br>

W przypadku zalogowania zwrocony zostanie obiekt w ktorym bedzie pole UID(ID usera z bazy), token(Obiekt w ktorym bedzie pole token(wygenerowany token), expire(data wygasniecia)), oraz w przypadku klikniecia zapamietaj mnie(opcjonalne) kolejny token wygasajacy po 30 dniach. Te dane nalezy zapisac na froncie + do kazdego autoryzowanego zapytania ustawic headery:<br>

token: ten wygasajacy co 1h,<br>
uid: ID uzytkownika,<br>
rememberToken(opcjonalny): ten wygasajacy po 30 dniach<br>

W przeciwnym wyppadku serwer zwroci nieautoryzowanego uzytkownika(status 401)
