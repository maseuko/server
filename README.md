# server
Zero spaghetti kodu ok

Endopinty:<br>

Rejestracja:<br>
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


