import axios from "axios";
import UserApi from "./userApi";

const SCRYFALL = "https://api.scryfall.com/cards/"
const ARCHIDEKT = `https://archidekt.com/api/decks/`


class DollaryApi {
  static token

  static async request(endpoint, data = {}, method = "get") {
    // console.debug("API Call:", endpoint, data, method);
    const url = endpoint
    try {
      return (await axios({ url, method })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  static async singleGet(name) {
    if(name!==undefined){
    try {
      let cardData = await this.request(SCRYFALL + `search?q=${name} order:usd`)
      return cardData.data
    }
    catch (error) {
      console.log("Single Card Search Error: ", error)
    }}
  }

  /** Takes input, formats into array, then returns formatted list from Scryfall */
  static async multiCall(cardList) {
    try{
    let cardArray = cardList.split('\n')
    let cardListOut = await this.formatResponse(cardArray.map(card => `!"${card}"`))
    return cardListOut
  }catch(error){
    console.log("Multicall Error: ", error)
  }}

  /** Calls Archidekt API and returns entire Deck list */
  static async archidekt(deck) {
    try {
      let res = await this.request(ARCHIDEKT + deck + "/")
        .then(response => {
          if (this.token){
            console.log("Adding Deck to user")
            UserApi.addDeck({
              "archidekt_num": response.id,
              "name": response.name
            })
          }
          this.formatResponse(response.cards.map(card => `!"${card.card.oracleCard.name}"`))
        })
      return (res)
    }
    catch (error) {
      console.log("Archidekt Fetch Error: ", error)
    }
  }

  static async formatResponse(cardList) {
    let deckInfo = Promise.all(cardList.map(async (card) => await this.singleGet(card)))
    try {
      const dataDump = await deckInfo
      let formattedData = dataDump.map((card) => {
        let cardInfo = card[0]
        let output = {}
        output["name"] = cardInfo.name
        output["price"] = cardInfo.prices.usd ? cardInfo.prices.usd : cardInfo.prices.usd_foil
        if (cardInfo.card_faces) {
          output["img"] = cardInfo.card_faces.map(face => {
            return face.image_uris.normal
          })
        } else {
          output["img"] = cardInfo.image_uris.normal
        }
        output["edhrec"] = cardInfo.related_uris.edhrec
        output["rulings"] = cardInfo.related_uris.gatherer
        return output
      }
      )
      return formattedData
    } catch (error) {
      console.log("Format Error: ", error)
    }
  }
}
export default DollaryApi