import React, { useEffect } from "react";
import SingleCard from "./SingleCard";
// import DeckContext from "../Context/DeckContext";


const DeckDisplay = ({ deckList, setisLoading, isLoading }) => {

    useEffect(()=>{
        setisLoading(false)
        console.log(deckList)
    },[])
        return (<div className="card-grid-inner">
            {/* {deckList!==undefined ?<h2>Loading...</h2>: <>{deckList.map(card => {
                return <SingleCard card={card} key={card.name} />
            })}</>} */}
        </div>)
    }


// useEffect(() => {
//     let unmounted = false;
//     fetch(url)
//       .then(res => res.json())
//       .then(data => !unmounted && setData(data))
//       .catch(console.error);
//     return () => (unmounted = true);
//   }, [])
  
//   return data
//      ? <pre>JSON.stringify(data, null, 2)</pre>;
//      : fallback;
// };


export default DeckDisplay