export class Account {
  #user = "";
  #password = "";

  constructor(user, password) {
    this.#user = user;
    this.#password = password;
  }

  get user() {
    return this.#user;
  }

  get password() {
    return this.#password;
  }
}