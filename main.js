// Name: Michael Sun
//
// This JavaScript file encapsulates the functions and behaviors of my
// League profile viewer

(function() {
  "use strict";

  // base URL for custom API
  const URL = "yorha.php";
  const RIOT_URL = "https://na1.api.riotgames.com"
  const SUMMONERS_BY_NAME = "/lol/summoner/v4/summoners/by-name/";
  const MATCHLIST = "/lol/match/v4/matchlists/by-account/";
  const MATCH = "/lol/match/v4/matches/";
  const PROXY_URL = "https://cors-anywhere.herokuapp.com/";
  const OPGG_URL = "http://opgg-static.akamaized.net/images/profile_icons/profileIcon";
  const CHAMPION_MASTERY = "/lol/champion-mastery/v4/champion-masteries/by-summoner/";
  // API Key, needs to be updated every 24 hrs
  const API_KEY = "?api_key=RGAPI-ec0f8340-8561-4111-a87a-1ed9c66248f8";

  const DDRAGON_URL = "http://ddragon.leagueoflegends.com/cdn/6.24.1/img/";
  const DDRAGON_SPLASH = "champion/splash/";

  // new requests
  const YORHA_SUMMONERS_BY_NAME = "?summoners=";
  const YORHA_MATCHLIST = "?matchlist=";
  const YORHA_MATCH = "?matches=";
  // pod URL suffix

  // need to account for >100 matches loaded
  const TOTAL_MATCHES = 100;
  const INITIAL_LOAD = 20;

  const ALL_PODS = "?pods=all";
  // operator URL suffix
  const ALL_OPS = "?operators=all";
  // number of Pods by default
  const NUM_PODS = 3;

  let textTimer = null;
  let imageTimer = null;
  let isHPLow = false;
  let podsDisplayed = false;
  let unscrambledText = [];
  let scrambleTargets;
  let images = [];
  let currentOps = [];
  let summonerData;
  let loadedMatches = 0;
  let matches;
  let pageOwnerId;

  window.addEventListener("load", initialize);
   /**
   *  My initialize function adds a click event listener for the
   *  low-hp button to start the low hp effects of the header
   *  text scrambling. A click event listener is also added to the
   *  load-pods button which loads the three pods and their descriptions.
   */
  function initialize() {
    // THIS IS THE CODE THAT WILL BE EXECUTED ONCE THE
    // WEBPAGE LOADS
    document.getElementById("low-hp").addEventListener("click", setLowHP);
    document.getElementById("load-pods").addEventListener("click", function() {
      if (!podsDisplayed) {
        makeRequest(URL + ALL_PODS, loadAllPods, checkStatusJSON);
      }
      else {
        let podArray = qsa(".pod-info");
        for (let i = 0; i < podArray.length; i++) {
          podArray[i].parentElement.removeChild(podArray[i]);
        }
        podsDisplayed = false;
      }
    });
    document.getElementById("search-button").addEventListener("click", function(){
      let summonerName = document.getElementById("searchbar").value;
      clearSummonerPage();


      makeRequest(PROXY_URL + RIOT_URL + SUMMONERS_BY_NAME + summonerName + API_KEY, createSummonerPage, checkStatusJSON);
    });

    makeRequest(URL + ALL_OPS, loadCurrentOps, checkStatusPlainText);
    scrambleTargets = qsa("h1, h2, h3, p, a, li");
    images = qsa("img");
  }
   /**
   *  This function loads the names of the current YoRha operators
   *  @param {Plain Text} responseData - plain text returned from the GET request with all three
   *  ops and their information.
   */
  function loadCurrentOps(responseData) {
    console.log("updated");
    responseData = responseData.split(",");
    for (let i = 0; i < responseData.length; i++) {
      currentOps[i]= responseData[i];
    }
  }

  function clearSummonerPage() {
    let nameDisplay = document.getElementById("name-display");
    let profileDisplay = document.getElementById("info-display");
    nameDisplay.innerText = "";
    profileDisplay.innerText = "";
    let loadingAnimation = document.createElement("img");
    loadingAnimation.src = "imgs/retroload.gif";
    loadingAnimation.classList.add("loading");

    nameDisplay.appendChild(loadingAnimation);
    profileDisplay.appendChild(loadingAnimation);
    loadedMatches = 0;
  }

  function createSummonerPage(responseData) {
    summonerData = responseData;
    let summonerLevel = responseData["summonerLevel"];
    let nameDisplay = document.getElementById("name-display");
    let profileDisplay = document.getElementById("info-display");
    let summonerIcon = document.createElement("img");
    let generalInfo = document.createElement("div");
    let summonerLevelDisplay = document.createElement("p");

    while (profileDisplay.firstChild) {
      profileDisplay.removeChild(profileDisplay.firstChild);
    }

    nameDisplay.innerText = "";
    profileDisplay.innerText = "";
    let nameText = document.createElement("p");
    nameText.setAttribute("id", "name-text");

    summonerIcon.src = OPGG_URL + responseData["profileIconId"] + ".jpg";
    summonerIcon.alt = "Summoner Icon";
    summonerIcon.classList.add("summonerIcon");
    nameDisplay.appendChild(summonerIcon);
    nameDisplay.appendChild(nameText);
    nameText.innerText = responseData["name"];

    summonerLevelDisplay.innerText += "Summoner Level: " + summonerLevel + "\n";

    profileDisplay.appendChild(generalInfo);
    generalInfo.appendChild(summonerLevelDisplay);
    generalInfo.setAttribute("id", "general-info");

    makeRequest(PROXY_URL + RIOT_URL + CHAMPION_MASTERY + responseData["id"] + API_KEY,
                loadMastery, checkStatusJSON);
  }

  function loadMastery(responseData) {
    let generalInfo = document.getElementById("general-info");
    let masteryContainer = document.createElement("div");
    let newHeader = document.createElement("h2");

    masteryContainer.setAttribute("id","mastery-container");
    newHeader.classList.add("header");
    newHeader.innerText = "Champion Mastery";
    newHeader.setAttribute("id", "mastery-header");
    masteryContainer.appendChild(newHeader);

    if (responseData.length >= 3) {
      for (let i = 0; i < 3; i++) {
        let newMasteryBox = document.createElement("div");
        let masteryLevel = document.createElement("img");
        let masteryChampion = document.createElement("img");
        let championName = championIdToName(responseData[i]["championId"]);

        newMasteryBox.classList.add("mastery-box");

        masteryLevel.src = "masteryicons/" + responseData[i]["championLevel"] + ".png";
        masteryLevel.alt = responseData[i]["championLevel"];
        masteryLevel.classList.add("mastery-level");

        // changedhere
        masteryChampion.src = "championicons/" + championName + "Square.png";
        //masteryChampion.src = "http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/" + championName + ".png";
        masteryChampion.alt = championName;
        masteryChampion.classList.add("mastery-champion");

        newMasteryBox.appendChild(masteryLevel);
        newMasteryBox.appendChild(masteryChampion);

        masteryContainer.appendChild(newMasteryBox);
      }
    }
    else if (responseData.length == 0){

    }
    else {

    }
    generalInfo.appendChild(masteryContainer);
    let matchHistoryButton = document.createElement("button");
    matchHistoryButton.innerText = "Load Match History";
    matchHistoryButton.setAttribute("id", "match-history-button");
    generalInfo.appendChild(matchHistoryButton);
    pageOwnerId = summonerData["accountId"];
    matchHistoryButton.addEventListener("click", function() {
      makeRequest(PROXY_URL + RIOT_URL + MATCHLIST + pageOwnerId + API_KEY,
                  loadMatchHistory, checkStatusJSON);
    });
  }

  function loadMatchHistory(responseData) {
    matches = responseData["matches"];
    let matchHistoryBox = document.createElement("div");
    let infoDisplay = document.getElementById("info-display");

    //making new button
    let addMatches = document.createElement("button");
    addMatches.addEventListener("click", function() {
      loadMatches();
    });
    addMatches.setAttribute("id", "add-matches-button");
    addMatches.innerText = "Load " + INITIAL_LOAD + " More Matches";
    let generalInfo = document.getElementById("general-info");
    generalInfo.appendChild(addMatches);

    //preparing match history box
    infoDisplay.appendChild(matchHistoryBox);
    matchHistoryBox.classList.add("flex");
    matchHistoryBox.setAttribute("id", "match-history-box");

    loadMatches();
    document.getElementById("match-history-button").classList.add("hidden");

  }

  function loadMatches() {
    let matchHistoryBox = document.getElementById("match-history-box");

    //redundancy
    if (matches.length < TOTAL_MATCHES) {
      for (let i = loadedMatches; i < matches.length; i++) {
        createMatch(i, matches, matchHistoryBox);
      }
      loadedMatches = TOTAL_MATCHES;
      let addButton = document.getElementById("add-matches-button");
      addButton.innerText = "All Matches Loaded";
      addButton.disabled = true;
    }

    if (loadedMatches + INITIAL_LOAD <= TOTAL_MATCHES) {
      for (let i = loadedMatches; i < loadedMatches + INITIAL_LOAD; i++) {
        createMatch(i, matches, matchHistoryBox);
      }
      loadedMatches += INITIAL_LOAD;
    }
    else {
      for (let i = loadedMatches; i < TOTAL_MATCHES; i++) {
        createMatch(i, matches, matchHistoryBox);
      }
      loadedMatches = TOTAL_MATCHES;
      let addButton = document.getElementById("add-matches-button");
      addButton.innerText = "All Matches Loaded";
      addButton.disabled = true;
    }
  }

  function createMatch(i, matches, matchHistoryBox) {
    let newMatch = document.createElement("div");
    let laneIcon = document.createElement("img");
    let match = matches[i];
    let championIcon = document.createElement("img");
    let championName = championIdToName(match["champion"]);
    let newHeader = document.createElement("h2");
    let contentBox = document.createElement("div");
    let queueName = queueIdToName(match["queue"]);

    newMatch.setAttribute("id", "a" + match["gameId"]);
    newMatch.classList.add("match-history-tab");

    if (match["queue"] == "450") {
      laneIcon.src = "laneicons/MID.png";
      laneIcon.alt ="MID";
    }
    else {
      laneIcon.src = "laneicons/" + match["lane"] + ".png";
      laneIcon.alt = match["lane"];
    }
    laneIcon.classList.add("lane-icon");

    championIcon.alt = championName;
    //changedhere
    championIcon.src = "championicons/" + championName + "Square.png";
    //championIcon.src = "http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/" + championName + ".png";

    championIcon.classList.add("champion-icon");
    newMatch.alt = championName;

    newHeader.classList.add("header");
    newHeader.innerText = queueName;

    newMatch.style.backgroundImage = PROXY_URL + DDRAGON_URL + DDRAGON_SPLASH + championName + "0_jpg";

    contentBox.classList.add("flex");
    contentBox.classList.add("content-box");
    contentBox.appendChild(laneIcon);
    contentBox.appendChild(championIcon);

    // structure page
    newMatch.appendChild(newHeader);
    newMatch.appendChild(contentBox);

    matchHistoryBox.appendChild(newMatch);
    newMatch.addEventListener("click", openMatch);
    makeRequest(PROXY_URL + RIOT_URL + MATCH + match["gameId"] + API_KEY,
                fillTeams, checkStatusJSON);
    // makeRequest(PROXY_URL + RIOT_URL + MATCH + matchId + API_KEY, createMatchHistory, checkStatusJSON);
  }

  function fillTeams(responseData) {
    let thisMatch = qsa("#a" + responseData["gameId"] + " .content-box");
    //let userChampion = qsa("#a" + responseData["gameId"] + " .champion-icon");
    let teamBox = document.createElement("div");
    let team1 = document.createElement("div");
    let team2 = document.createElement("div");

    teamBox.classList.add("flex");
    teamBox.classList.add("team-box");

    team1.classList.add("flex");
    team1.classList.add("team");
    team2.classList.add("flex");
    team2.classList.add("team");


    let players = responseData["participants"];
    let playerIdentities = responseData["participantIdentities"];

    for (let i = 0; i <= 9; i++) {
      let currentPlayer = players[i];
      let currentTeam = currentPlayer["teamId"];
      let newChampion = document.createElement("img");
      let playerDiv = document.createElement("div");
      let championName = championIdToName(currentPlayer["championId"]);
      let playerName = document.createElement("p");

      playerName.innerText = playerIdentities[i]["player"]["summonerName"];
      playerName.classList.add("player-name");

      playerDiv.classList.add("flex");
      playerDiv.classList.add("player-div");
      playerDiv.classList.add("glitchlink");
      playerDiv.addEventListener("click", function(){
        let summonerName = playerName.innerText;
        clearSummonerPage();
        makeRequest(PROXY_URL + RIOT_URL + SUMMONERS_BY_NAME + summonerName + API_KEY, createSummonerPage, checkStatusJSON);
      });

      //changedhere
      newChampion.src = "championicons/" + championName + "Square.png";
      //newChampion.src = "http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/" + championName + ".png";
      newChampion.alt = championName;
      newChampion.classList.add("match-history-champion-icon");

      playerDiv.appendChild(newChampion);
      playerDiv.appendChild(playerName);
      if (currentTeam == "100") {
        team1.appendChild(playerDiv);
      }
      else {
        team2.appendChild(playerDiv);
      }

      if (pageOwnerId == playerIdentities[i]["player"]["accountId"]) {
        currentTeam = currentTeam / 100 - 1;
        let winLose = responseData["teams"][currentTeam]["win"];

        if (responseData["gameDuration"] <= 270) {
          thisMatch[0].classList.add("remake");
        }
        else {
          if (winLose == "Win") {
            thisMatch[0].classList.add("win");
          }
          else {
            thisMatch[0].classList.add("loss");
          }  
        }
        let kdaBox = document.createElement("div");
        kdaBox.classList.add("kda-box");
        kdaBox.innerText = currentPlayer["stats"]["kills"] + "/" +
                           currentPlayer["stats"]["deaths"] + "/" +
                           currentPlayer["stats"]["assists"];
        thisMatch[0].appendChild(kdaBox);
      }
    }

    teamBox.appendChild(team1);
    teamBox.appendChild(team2);
    thisMatch[0].appendChild(teamBox);

    scrambleTargets = qsa("h1, h2, h3, p, a, li");
    images = qsa("img");
  }

  function openMatch(responseData) {
    let newMatch = document.createElement("section");
    let team1 = document.createElement("div");
    let team2 = document.createElement("div");
    team1.classList.add("team-block");
    team2.classList.add("team-block");
  }

   /**
   *  This function creates information cards for all three of the pods, displaying
   *  their names, abilities, descriptions, and icons.
   *  @param {JSON Object} responseData - JSON returned from the GET request with all three
   *  pods and their information.
   */
  function loadAllPods(responseData) {
    if (isHPLow) {
      setLowHP();
    }
    for (let i = NUM_PODS - 1; i >= 0; i--) {
      let parent = qs("body");
      let key = responseData[i];
      let newSection = document.createElement("section");
      let newHeader = document.createElement("h2");
      let newParagraph = document.createElement("p");
      let newIcon = document.createElement("img");

      parent.insertBefore(newSection, parent.firstChild);
      newSection.classList.add("pod-info");
      newSection.appendChild(newHeader);
      newSection.appendChild(newParagraph);
      newSection.appendChild(newIcon);
      newIcon.src = responseData[key]["Icon"];
      newIcon.alt = responseData[key]["Name"];
      newHeader.innerText = responseData[key]["Name"];
      newParagraph.innerText = "User: " + currentOps[i] + "\nDescription: "
                             + responseData[key]["Info"]
                             + "\n Ability: " + responseData[key]["Ability"];
      newHeader.classList.add("header");
    }
    podsDisplayed = true;
    scrambleTargets = qsa("h1, h2, h3, p, a, li");
    images = qsa("img");
  }
   /**
   *  This function sets the menu into "low hp" mode wherein the header text
   *  is scrambled. Unscrambles all text if function is called while
   *  scrambling is active.
   */
  function setLowHP() {
    if (!isHPLow) {
      for (let i = 0; i < scrambleTargets.length; i++) {
        unscrambledText[i] = scrambleTargets[i].innerText;
      }
      textTimer = setInterval(function(){textRandomizer(scrambleTargets)}, 80);
      imageTimer = setInterval(function(){imageGlitcher(images)}, 80);
      isHPLow = true;
    }
    else if (isHPLow) {
      clearInterval(textTimer);
      clearInterval(imageTimer);
      for (let i = 0; i < scrambleTargets.length; i++) {
        scrambleTargets[i].innerText = unscrambledText[i];
      }
      for (let i = 0; i < images.length; i++) {
        images[i].classList.remove("invert", "blur", "huerotate", "contrast");
      }
      textTimer = null;
      imageTimer = null;
      isHPLow = false;
    }
  }
   /**
   *  This function scrambles the text of a specified element using the
   *  text present while the function is called.
   *  @param {DOM element} element - specified element whose innerText is to be scrambled
   */
  function textRandomizer(element) {
    console.log("Interval");
    for (let a = 0; a < element.length; a++ ) {
      let newText = "";
      let textArray = unscrambledText[a].split("");

      let randomGlitch = Math.random()*10;
      for (let i = 0; i < unscrambledText[a].length; i++) {
        if (randomGlitch > 4) {
          newText += textArray[Math.floor(Math.random()*textArray.length)];
        }
        else {
          newText += textArray[i];
        }
      }
      element[a].innerText = newText;
    }
  }
   /**
   *  This function scrambles the page's image classes
   *  @param {DOM element} element - specified image element to be messed with
   */
  function imageGlitcher(element) {
    for (let i = 0; i < element.length; i++) {
      let randomAbberation = Math.floor(Math.random() * 7);
      if (randomAbberation == 2) {
        element[i].classList.add("invert");
      }
      if (randomAbberation == 4) {
        element[i].classList.add("contrast");
      }
      if (randomAbberation == 6){
        element[i].classList.add("huerotate");
      }
      if (randomAbberation % 2 != 0) {
        element[i].classList.add("blur");
      }
      if (randomAbberation == 5){
        element[i].classList.remove("invert", "blur", "huerotate", "contrast");
      }
    }
  }
   /**
   *  Makes GET request to specified URL and runs specified function if
   *  request is successful.
   *  @param {String} apiURL - URL that get request is made to
   *  @param {function} successFunction - function to be run if GET request is successful
   */
  function makeRequest(apiURL, successFunction, checkStatus) {
    console.log(apiURL);
    // CORB blocked, need HTML encoding
    let myHeaders = new Headers();
    myHeaders.append("X-Content-Type-Options","nosniff");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Access-Control-Allow-Origin", "*");

    fetch(apiURL, {headers: myHeaders, mode:"cors"})
     .then(checkStatus)
     .then(successFunction)
     .catch(console.log);
  }
   /**
  * Helper function to return the response's result text if successful, otherwise
  * returns the rejected Promise result with an error status and corresponding text
  * @param {object} response - response to check for success/error
  * @returns {object} - valid result JSON if response was successful, otherwise rejected
  *                     Promise result
  */
   function checkStatusJSON(response) {
     if (response.status < 300) {
      console.log("source extracted");
      return response.json();
    } else {
      console.log("source: " + response.json());

      let profileDisplay = document.getElementById("info-display");
      let loadingGif = qsa("#info-display img")[0];
      let errorMessage = document.createElement("div");
      errorMessage.classList.add("error-message");
      profileDisplay.removeChild(loadingGif);

      if (response.status == "429") {
        errorMessage.innerText = "ERROR 429: TOO MANY REQUESTS";
      }
      else if (response.status == "404") {
        errorMessage.innerText = "ERROR 404: SUMMONER NOT FOUND";
      }

      else {
        errorMessage.innerText = "ERROR" + response.status;
      }
      profileDisplay.appendChild(errorMessage);
      return Promise.reject(new Error(response.status + ": " + response.statusText));

    }
   }
   /**
  * Helper function to return the response's result text if successful, otherwise
  * returns the rejected Promise result with an error status and corresponding text
  * @param {object} response - response to check for success/error
  * @returns {object} - valid result text if response was successful, otherwise rejected
  *                     Promise result
  */
   function checkStatusPlainText(response) {
     if (response.status < 300) {
      console.log("source extracted");
      return response.text();
    } else {
      console.log("source: " + response.json());
      return Promise.reject(new Error(response.status + ": " + response.statusText));
    }
   }

  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} query - CSS query selector.
   * @returns {object} The first DOM object matching the query.
   */
  function qs(query) {
    return document.querySelector(query);
  }
  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} query - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(query) {
    return document.querySelectorAll(query);
  }

  function queueIdToName(id) {
    switch(id) {
      //deprecated ids
      case 65: return "5V5 ARAM (PRE 7.19), HOWLING ABYSS"; break;

      case 400: return "NORMAL DRAFT, SUMMONER'S RIFT"; break;
      case 420: return "RANKED SOLO/DUO, SUMMONER'S RIFT"; break;
      case 430: return "NORMAL BLIND, SUMMONER'S RIFT"; break;
      case 440: return "5V5 FLEX, SUMMONER'S RIFT"; break;

      case 450: return "ARAM, HOWLING ABYSS"; break;
      case 460: return "3V3 BLIND PICK, TWISTED TREELINE"; break;
      case 470: return "3V3 RANKED FLEX, TWISTED TREELINE"; break;

      case 600: return "BLOOD HUNT, SUMMONER'S RIFT"; break;
      case 610: return "DARK STAR: SINGULARITY, COSMIC RUINS"; break;
      case 700: return "CLASH, SUMMONER'S RIFT"; break;

      case 800: return "INTERMEDIATE BOTS, TWISTED TREELINE"; break;
      case 810: return "INTRO BOTS, TWISTED TREELINE"; break;
      case 820: return "BEGINNER BOTS, TWISTED TREELINE"; break;

      case 830: return "INTRO BOTS, SUMMONER'S RIFT"; break;
      case 840: return "BEGINNER BOTS, SUMMONER'S RIFT"; break;
      case 850: return "INTERMEDIATE BOTS, SUMMONER'S RIFT"; break;

      case 900: return "ARURF, SUMMONER'S RIFT"; break;
      case 910: return "ASCENSION, CRYSTAL SCAR"; break;
      case 920: return "LEGEND OF THE PORO KING, HOWLING ABYSS"; break;
      case 940: return "NEXUS SIEGE, SUMMONER'S RIFT"; break;

      case 950: return "DOOM BOTS VOTING, SUMMONER'S RIFT"; break;
      case 960: return "DOOM BOTS STANDARD, SUMMONER'S RIFT"; break;

      case 980: return "STAR GUARDIAN INVASION: NORMAL, VALORAN CITY PARK"; break;
      case 990: return "STAR GUARDIAN INVASION: ONSLAUGHT, VALORAN CITY PARK"; break;

      case 1000: return "PROJECT: HUNTERS, OVERCHARGE"; break;

      case 1010: return "SNOW ARURF, SUMMONER'S RIFT"; break;
      case 1020: return "ONE FOR ALL, SUMMONER'S RIFT"; break;

      case 1030: return "ODYSSEY EXTRACTION: INTRO, CRASH SITE"; break;
      case 1040: return "ODYSSEY EXTRACTION: CADET, CRASH SITE"; break;
      case 1050: return "ODYSSEY EXTRACTION: CREWMEMBER, CRASH SITE"; break;
      case 1060: return "ODYSSEY EXTRACTION: CAPTAIN, CRASH SITE"; break;
      case 1070: return "ODYSSEY EXTRACTION: ONSLAUGHT, CRASH SITE"; break;

      case 2000: return "TUTORIAL?"; break;
    }
    return "UNRECOGNIZED GAMEMODE; ID: " + id;
  }

  // borrowed from https://github.com/Najsr/League-Of-Legends-Champions-ID-List/blob/master/list.php
  function championIdToName(id) {
    switch(id){
    case 266: return "Aatrox"; break;
    case 412: return "Thresh"; break;
    case 23: return "Tryndamere"; break;
    case 79: return "Gragas"; break;
    case 69: return "Cassiopeia"; break;
    case 136: return "Aurelion_Sol"; break;
    case 13: return "Ryze"; break;
    case 78: return "Poppy"; break;
    case 14: return "Sion"; break;
    case 1: return "Annie"; break;
    case 202: return "Jhin"; break;
    case 43: return "Karma"; break;
    case 111: return "Nautilus"; break;
    case 240: return "Kled"; break;
    case 99: return "Lux"; break;
    case 103: return "Ahri"; break;
    case 2: return "Olaf"; break;
    case 112: return "Viktor"; break;
    case 34: return "Anivia"; break;
    case 27: return "Singed"; break;
    case 86: return "Garen"; break;
    case 127: return "Lissandra"; break;
    case 57: return "Maokai"; break;
    case 25: return "Morgana"; break;
    case 28: return "Evelynn"; break;
    case 105: return "Fizz"; break;
    case 74: return "Heimerdinger"; break;
    case 238: return "Zed"; break;
    case 68: return "Rumble"; break;
    case 82: return "Mordekaiser"; break;
    case 37: return "Sona"; break;
    case 96: return "Kog'Maw"; break;
    case 55: return "Katarina"; break;
    case 117: return "Lulu"; break;
    case 22: return "Ashe"; break;
    case 30: return "Karthus"; break;
    case 12: return "Alistar"; break;
    case 122: return "Darius"; break;
    case 67: return "Vayne"; break;
    case 110: return "Varus"; break;
    case 77: return "Udyr"; break;
    case 89: return "Leona"; break;
    case 126: return "Jayce"; break;
    case 134: return "Syndra"; break;
    case 80: return "Pantheon"; break;
    case 92: return "Riven"; break;
    case 121: return "Kha'Zix"; break;
    case 42: return "Corki"; break;
    case 268: return "Azir"; break;
    case 51: return "Caitlyn"; break;
    case 76: return "Nidalee"; break;
    case 85: return "Kennen"; break;
    case 3: return "Galio"; break;
    case 45: return "Veigar"; break;
    case 432: return "Bard"; break;
    case 150: return "Gnar"; break;
    case 90: return "Malzahar"; break;
    case 104: return "Graves"; break;
    case 254: return "Vi"; break;
    case 10: return "Kayle"; break;
    case 39: return "Irelia"; break;
    case 64: return "Lee_Sin"; break;
    case 420: return "Illaoi"; break;
    case 60: return "Elise"; break;
    case 106: return "Volibear"; break;
    case 20: return "Nunu"; break;
    case 4: return "Twisted_Fate"; break;
    case 24: return "Jax"; break;
    case 102: return "Shyvana"; break;
    case 429: return "Kalista"; break;
    case 36: return "Dr._Mundo"; break;
    case 427: return "Ivern"; break;
    case 131: return "Diana"; break;
    case 223: return "Tahm_Kench"; break;
    case 63: return "Brand"; break;
    case 113: return "Sejuani"; break;
    case 8: return "Vladimir"; break;
    case 154: return "Zac"; break;
    case 421: return "Rek'Sai"; break;
    case 133: return "Quinn"; break;
    case 84: return "Akali"; break;
    case 163: return "Taliyah"; break;
    case 18: return "Tristana"; break;
    case 120: return "Hecarim"; break;
    case 15: return "Sivir"; break;
    case 236: return "Lucian"; break;
    case 107: return "Rengar"; break;
    case 19: return "Warwick"; break;
    case 72: return "Skarner"; break;
    case 54: return "Malphite"; break;
    case 157: return "Yasuo"; break;
    case 101: return "Xerath"; break;
    case 17: return "Teemo"; break;
    case 75: return "Nasus"; break;
    case 58: return "Renekton"; break;
    case 119: return "Draven"; break;
    case 35: return "Shaco"; break;
    case 50: return "Swain"; break;
    case 91: return "Talon"; break;
    case 40: return "Janna"; break;
    case 115: return "Ziggs"; break;
    case 245: return "Ekko"; break;
    case 61: return "Orianna"; break;
    case 114: return "Fiora"; break;
    case 9: return "Fiddlesticks"; break;
    case 31: return "Cho'Gath"; break;
    case 33: return "Rammus"; break;
    case 7: return "LeBlanc"; break;
    case 16: return "Soraka"; break;
    case 26: return "Zilean"; break;
    case 56: return "Nocturne"; break;
    case 222: return "Jinx"; break;
    case 83: return "Yorick"; break;
    case 6: return "Urgot"; break;
    case 203: return "Kindred"; break;
    case 21: return "Miss_Fortune"; break;
    case 62: return "Wukong"; break;
    case 53: return "Blitzcrank"; break;
    case 98: return "Shen"; break;
    case 201: return "Braum"; break;
    case 5: return "Xin_Zhao"; break;
    case 29: return "Twitch"; break;
    case 11: return "Master_Yi"; break;
    case 44: return "Taric"; break;
    case 32: return "Amumu"; break;
    case 41: return "Gangplank"; break;
    case 48: return "Trundle"; break;
    case 38: return "Kassadin"; break;
    case 161: return "Vel'Koz"; break;
    case 143: return "Zyra"; break;
    case 267: return "Nami"; break;
    case 59: return "Jarvan_IV"; break;
    case 81: return "Ezreal"; break;
    case 145: return "Kai'Sa"; break;
    case 555: return "Pyke"; break;
    case 518: return "Neeko"; break;
    case 141: return "Kayn"; break;
    case 498: return "Xayah"; break;
    case 350: return "Yuumi"; break;
    case 516: return "Ornn"; break;
    case 517: return "Sylas"; break;
    case 142: return "Zoe"; break;
    case 164: return "Camille"; break;
    case 497: return "Rakan"; break;
    }
    return id;
  }
})();
