import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { populateMatch, populateMastery } from './functions/functions';
import Swal from 'sweetalert2';


function App() {
  const [searchText, setSearchText] = useState("");
  const [playerData, setPlayerData] = useState({});
  const [playerMastery, setPlayerMastery] = useState({});
  const [playerMatchId, setPlayerMatchId] = useState([]);
  const [match, setMatch] = useState({});
  const [index, setIndex] = useState(0);
  let promises = [];
  const API_KEY = process.env.REACT_APP_API_KEY
  

  const clearState = () => {
    setPlayerData({})
    setPlayerMastery({})
    setPlayerMatchId([])
    setMatch({})
    setIndex(0);
  }
  
  function searchForSummoner(e) {
    let APICallString = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/"+ searchText + "?api_key=" + API_KEY;
    // handle the API call
    axios.get(APICallString).then(function (response) {
      setPlayerData(response.data)
    }).catch((e) => {
      if (e.response.status === 404) {
        Swal.fire({
          title: 'Error!',
          text: 'Invalid Username',
          icon: 'error',
          confirmButtonText: 'Ok'
        })
        return null;
      }else if (e.response.status === 403) {
        Swal.fire({
          title: 'Error!',
          text: 'Forbidden Request (Check if API is Valid)',
          icon: 'error',
          confirmButtonText: 'Ok'
        })
      } else {
        console.log(e.response);
      }
    })
      
  };

  function searchPlayerMastery() {
    let APIMasteryCall = "https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/"+ playerData.id + "?api_key=" + API_KEY;
    axios.get(APIMasteryCall).then(function (response) {
      // success
      setPlayerMastery([response.data[0], response.data[1], response.data[2]]);
    }).catch(function (error) {
      // error
      console.log(error);
    })
  };


  function searchPlayerMatchId() {
    let APIMatchCall = "https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/"+ playerData.puuid + "/ids?start=0&count=20&api_key=" + API_KEY;
    axios.get(APIMatchCall).then(function (response) {
      // success
      setPlayerMatchId(response.data);
    }).catch(function (error) {
      // error
      console.log(error);
    })
  };
 
  async function searchMatches(index) {
    const array = playerMatchId
    for (let i = index; i < (index + 5); i++) {
      await axios.get("https://americas.api.riotgames.com/lol/match/v5/matches/"+ array[i] + "?api_key=" + API_KEY)
        .then(response => {
          promises.push(response.data.info.participants)
        }).catch(error => {
          console.log(error);
        })
    }
    Promise.all(promises).then(() => {
      setMatch(promises)
    }).catch(error => {
      console.log(error)
    })
  }
  
  function prevIndex(e) {
    if (index === 0) {
      Swal.fire({
        title: 'Error!',
        text: 'You are on the first page',
        icon: 'error',
        confirmButtonText: 'ok'
      })
      return null
    }
    else {
      setIndex(index - 5);
    }
  }

  function nextIndex(e) {
    if (index === 15) {
      Swal.fire({
        title: 'Error!',
        text: 'you have reached the limit of games',
        icon: 'error',
        confirmButtonText: 'ok'
      })
      return null
    }
    else {
      setIndex(index + 5)
    }
  }
  

  function searchPlayerInfo() {
    searchPlayerMastery()
    searchPlayerMatchId()
  }
  
  const removeSpaces = str => str.replace(/\s/g, '');
  
  function search(e) {
    if (removeSpaces(searchText) === "") {
      Swal.fire({
        title: 'Error!',
        text: 'you need to type in a name',
        icon: 'error',
        confirmButtonText: 'Cool'
      })
      return null
    } else {
        clearState();
        searchForSummoner(e);
    }
  }
  
  useEffect(() => {
    if (JSON.stringify(playerData) === '{}') {
      return null
    } else {
      searchPlayerInfo()
    }
  }, [playerData])

  useEffect(() => {
    if (JSON.stringify(playerMatchId) === '[]') {
      return null
    } else {
      searchMatches(index)
    }
  }, [playerMatchId, index])
  
  
  return (
    <>
      <div className="App">
        <div>
          <ul>
            <li><a href="https://developer.riotgames.com/">Dev Portal</a></li>
            <li><a href="https://www.leagueoflegends.com/en-us/">LOL</a></li>
          </ul>
        </div>
        <div className="header"> 
          <div className="top">
            <h1>Summoners of League</h1>
            <div className="searchUser">
              <input type="text" className="input" placeholder="Enter Name!" onChange={e => setSearchText(e.target.value)}></input>
              <button className="button" onClick={e => search(e)}>Search</button>
            </div>  
            {JSON.stringify(playerData) !== '{}' ?
              <>
                <div className="summoner">
                  <div>Summoner Name: {playerData.name}</div>
                  <img width="50px" height="50px" src={"http://ddragon.leagueoflegends.com/cdn/12.1.1/img/profileicon/" + playerData.profileIconId + ".png"} alt="summoner icon"></img>
                  <div>Summoner Level: {playerData.summonerLevel}</div>
                </div>
              </>
              :
              <><div className="noData">we dont have player data</div></>
            }
          </div>
        </div> 
        <div className="content wrapper">
          {JSON.stringify(playerMastery) !== '{}' ?
            <>
              <div className="champions">
                <div className="champ One">
                  {populateMastery(playerMastery[0])}
                </div>
                <div className="champ Two">
                  {populateMastery(playerMastery[1])}
                </div>
                <div className="champ Three">
                  {populateMastery(playerMastery[2])}
                </div>
              </div>
            </>
            :
            <></>
          }
          {JSON.stringify(playerMatchId) !== '[]' ?
            <>
              <div className="matches">
                {JSON.stringify(match) !== '{}' ?
                  <>
                    {populateMatch(playerData, match[0])}
                    {populateMatch(playerData, match[1])}
                    {populateMatch(playerData, match[2])}
                    {populateMatch(playerData, match[3])}
                    {populateMatch(playerData, match[4])}
                    <div className="page">
                      <button className="prev" onClick={e => prevIndex(e)}>PREV</button>
                      <button className="next" onClick={e => nextIndex(e)}>NEXT</button>
                    </div> 
                  </>
                  :
                  <>
                  </>
                }
              </div>         
            </>
            :
            <>
            </>
          }
        </div>
      </div>
    </>
  );
}

export default App;