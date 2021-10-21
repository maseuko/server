# server
Zero spaghetti kodu ok

Endopinty:

Rejestracja:
  /register

Przyjmuje obiekt o strukturze:
{
  username: username,
  email: email, 
  password: password
}

Zwraca statusy:

201 - Utworzono nowego uzytkownika<br>
400 - Niepopprawne dane wyslane z frontendu
403 - Email juz istnieje
409 - Chuj wie co sie odjebalo w mongodb ale nie udalo sie utworzyc usera


