import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class UserApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${this.token}` };
    const params = (method === "get")
      ? data
      : {};
    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err);
      let message = err;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** POST request for user token */

  static async userLogin(userData) {
    try {
      const { username, password } = userData
      let res = await this.request('auth/token',
        { username, password },
        "post")

      return res.token
    } catch (error) { console.log("Login Error: ", error) }
  }

  /**POST request for user register to  */
  static async userRegister(userData) {
    const { username, password, firstName, lastName, email } = userData
    try {
      let res = await this.request('auth/register',
        { username, password, firstName, lastName, email },
        "post")
      return res.token
    } catch (error) {
      console.log("User Register: ", error)
    }
  }

  static async userEdit(userData) {
    const { username, firstName, lastName, password, email } = userData
    try {
      let res = await this.request(`users/${username}`,
        { firstName, lastName, password, email },
        "patch")
      return res
    } catch (error) {
      console.log(error)
    }
  }

  static async userInfo(username) {
    try {
      let res = await this.request(`users/${username}`,
        { username },
        "get")
      return res.user
    } catch (error) {
      console.log("UserInfo fetch error: ", error)
    }
  }

  static async addDeck(object) {
    try {
      if (this.token) {
        await this.request(`decks/`, object, 'POST')
        this.addDecktoUser(object.archidekt_num)
      }
    } catch (error) {
      console.log("Add Deck Error: ", error)
    }
  }

  static async addDecktoUser(archidekt_num) {
    try {
      let res = await this.request(`users/decks/${archidekt_num}`,
        { archidekt_num },
        "post")
      return res.applied
    } catch (error) {
      console.log("Add Deck to User Error: ", error)
    }
  }

  static async removeDeck(archidekt_num) {
    try {
      let res = await this.request(`decks/${archidekt_num}`,
        { archidekt_num },
        "DELETE")
      console.log(res)
    } catch (error) {
      console.log("Deck Deletion Error: ", error)
    }
  }
}

export default UserApi

// // for now, put token ("testuser" / "password" on class)
// UserApi.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ" +
//    "SI6InRlc3R1c2VyIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU5ODE1OTI1OX0." +
//    "FtrMwBQwe6Ue-glIFgz_Nf8XxRT2YecFCiSpYL0fCXc";

