import DollaryApi from "../api";

async function oneCard(name){
    try{
    let card = await DollaryApi.singleGet(name)
    return card}
    catch(err){
      alert('Search Error')
    }
  }

  export default oneCard