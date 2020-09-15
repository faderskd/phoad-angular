export class NewUser {
  email: string;
  password: string;
  repeatedPassword: string;

  constructor(email = "", password = "", repeatedPassword = "") {
    this.email = email;
    this.password = password;
    this.repeatedPassword = repeatedPassword;
  };

}
