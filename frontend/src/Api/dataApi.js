import axios from "axios";

const SCRYFALL = "https://api.scryfall.com/cards/"
const ARCHIDEKT = `https://archidekt.com/api/decks/`
class DollaryApi {

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);
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
    try {
      let cardData = await axios.get(SCRYFALL + `search?q=${name} order:usd`)
      return cardData.data
    }
    catch (error) {
      console.log("Single Card Search Error: ", error)
    }
  }

  static async multiCall(cardList) {
    let cardArray = cardList.split('\n')
    let cardListOut = await this.formatResponse(cardArray.map(card => `!"${card}"`))
    return cardListOut
  }

  static async archidekt(deck) {
    let res = await axios.get(ARCHIDEKT + deck + "/")
      .then(response => { this.formatResponse(response.data.cards.map(card => `!"${card.card.oracleCard.name}"`)) })
    return (res)
  }


  static async formatResponse(cardList) {
    let deckInfo = Promise.all(cardList.map(async (card) => await this.singleGet(card)))
    try {
      const dataDump = await deckInfo
      let formattedData = dataDump.map((card) => {
        let cardInfo = card.data[0]
        let output = {}
        output["name"] = cardInfo.name
        output["price"] = cardInfo.prices.usd ? cardInfo.prices.usd : cardInfo.prices.usd_foil
        if (cardInfo.card_faces) {
          output["img"] = cardInfo.card_faces.map(face => {
            return face.image_uris.small
          })
        } else {
          output["img"] = cardInfo.image_uris.small
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