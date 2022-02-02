import data from "../champions.json"
import '../App.css'


function findName(playerMastery) {
  const { championId } = playerMastery;
  const champName = data.find((item) => {
    return Number(item.key) === championId
  })
  return champName.id;
}

function findDescription(playerMastery) {
  const { championId } = playerMastery;
  const descr = data.find((item) => {
    return Number(item.key) === championId
  })
  let text = descr.description
  const myArray = text.split(".")
  return (myArray[0]);
}

function findChampImage(playerMastery) {
  const { championId } = playerMastery;
  const champImg = data.find((item) => {
    return Number(item.key) === championId
  })
  return champImg.icon;
}

//find champion image of certain match
function findMatchImage(playerData, match) {
  let item = findChampId(playerData, match);
  let matchImg = findChampImage(item);
 return(matchImg)
}


function findChampId(playerData, match) {
  const { name } = playerData;
  const data = match.find((item) => {
    return (item.summonerName) === name
  })
  return (data);
}
  
function findKills(playerData, match) {
  const { name } = playerData;
  const data = match.find((item) => {
    return (item.summonerName) === name
  })
  return (data.kills);
}

function findAssists(playerData, match) {
  const { name } = playerData;
  const data = match.find((item) => {
    return (item.summonerName) === name
  })
  return (data.assists);
}

function findDeaths(playerData, match) {
  const { name } = playerData;
  const data = match.find((item) => {
    return (item.summonerName) === name
  })
  return (data.deaths);
}
  

  
function findChampionName(playerData, match) {
  const { name } = playerData;
  const data = match.find((item) => {
    return (item.summonerName) === name
  })
  return (data.championName);
}

function findWin(playerData, match) {
  const { name } = playerData;
  const data = match.find((item) => {
    return (item.summonerName) === name
  })
  if (data.win === true) {
    return("Victory")
  } else {
    return("Defeat")
  }
}

function findTotalDamageDealt(playerData, match) {
  const { name } = playerData;
  const data = match.find((item) => {
    return (item.summonerName) === name
  })
  return (data.totalDamageDealtToChampions);
}

function findTimePlayed(playerData, match) {
  const { name } = playerData;
  const data = match.find((item) => {
    return (item.summonerName) === name
  })
  return (data.timePlayed);
}

function findLane(playerData, match) {
  const { name } = playerData;
  const data = match.find((item) => {
    return (item.summonerName) === name
  })
  return (data.lane.toLowerCase());
}

function findTotalMinionsKilled(playerData, match) {
  const { name } = playerData;
  const data = match.find((item) => {
    return (item.summonerName) === name
  })
  return (data.totalMinionsKilled);
}

function goldEarned(playerData, match) {
  const { name } = playerData;
  const data = match.find((item) => {
    return (item.summonerName) === name
  })
  return (data.goldEarned);
}

function fancyTimeFormat(duration)
{   
    // Hours, minutes and seconds
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}

/*populates top 3 champions from summoner profile*/
function populateMastery(playerMastery) {
return(
    <>
      <div className="description">"{findDescription(playerMastery)}."</div>
        <div className="text">
          <div>
            <img className="sumImage" src={findChampImage(playerMastery)} alt={findName(playerMastery)}></img>
          </div>
          {findName(playerMastery)}<br />
          Mastery points:{playerMastery.championPoints}
        </div>
    </>
  )
}

/*displayes match history*/
function populateMatch(playerData, match) {
  if (findWin(playerData, match) === "Victory") {
    return (
      <div className="game won">
        <div className="winTime">
          <div>{findWin(playerData, match)}</div><br />
          <div>{fancyTimeFormat(findTimePlayed(playerData, match))}</div>
        </div>
        <div>
          <div><img height="50px" width="50px" src={findMatchImage(playerData, match)} alt={findChampionName(playerData, match)}></img></div>
          <div>{findChampionName(playerData, match)}<br />{findLane(playerData, match)}</div>
        </div>
        <div className="kda">
          K / D / A<br></br>
          {findKills(playerData, match)} / {findDeaths(playerData, match)} / {findAssists(playerData, match)}
        </div>
        <div className="DMG">
          <div>Damage To Champs: {findTotalDamageDealt(playerData, match)}</div>
          <div>CS: {findTotalMinionsKilled(playerData, match)}</div>
          <div>Gold: {goldEarned(playerData, match)}</div>
        </div>
      </div>
    )} else if (findWin(playerData, match) === "Defeat") {
      return (
        <div className="game lost">
          <div className="winTime">
            <div>{findWin(playerData, match)}</div><br />
            <div>{fancyTimeFormat(findTimePlayed(playerData, match))}</div>
          </div>
          <div>
            <div><img height="50px" width="50px" src={findMatchImage(playerData, match)} alt={findChampionName(playerData, match)}></img></div>
            <div>{findChampionName(playerData, match)}<br />{findLane(playerData, match)}</div>
          </div>
          <div className="kda">
            K / D / A<br></br>
            {findKills(playerData, match)} / {findDeaths(playerData, match)} / {findAssists(playerData, match)}
          </div>
          <div className="DMG">
            <div>Damage To Champs: {findTotalDamageDealt(playerData, match)}</div>
            <div>CS: {findTotalMinionsKilled(playerData, match)}</div>
            <div>Gold: {goldEarned(playerData, match)}</div>
          </div>
        </div>
      )
    }
  }
export { populateMastery, populateMatch }
