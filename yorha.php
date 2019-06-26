<?php
  $RIOT_URL = "https://na1.api.riotgames.com";
  $SUMMONERS_BY_NAME = "/lol/summoner/v4/summoners/by-name/";
  $MATCHLIST = "/lol/match/v4/matchlists/by-account/";
  $MATCH = "/lol/match/v4/matches/";
  $PROXY_URL = "https://cors-anywhere.herokuapp.com/";
  $OPGG_URL = "http://opgg-static.akamaized.net/images/profile_icons/profileIcon";
  // API Key, needs to be updated every 24 hrs
  $API_KEY = "?api_key=RGAPI-299f4e9a-ef18-4838-b017-59829014e729";

  $DDRAGON_URL = "http://ddragon.leagueoflegends.com/cdn/6.24.1/img/";
  $DDRAGON_SPLASH = "champion/splash/";

  $allPods = array("Pod A", "Pod B", "Pod C");

  $allPods["Pod A"]["Weapon"] = "Machine Gun";
  $allPods["Pod A"]["Ability"] = "Gravity";
  $allPods["Pod A"]["Icon"] = "imgs/pod-a.jpg";
  $allPods["Pod A"]["Info"] = "Default Pod given to you at the start of the game.";
  $allPods["Pod A"]["Name"] = "Pod A";

  $allPods["Pod B"]["Weapon"] = "Laser";
  $allPods["Pod B"]["Ability"] = "Charged Laser";
  $allPods["Pod B"]["Icon"] = "imgs/pod-b.png";
  $allPods["Pod B"]["Info"] = "Pod b fires a laser that does constant damage but is short range";
  $allPods["Pod B"]["Name"] = "Pod B";

  $allPods["Pod C"]["Weapon"] = "Homing Missiles";
  $allPods["Pod C"]["Ability"] = "Bomb";
  $allPods["Pod C"]["Icon"] = "imgs/pod-c.png";
  $allPods["Pod C"]["Info"] = "???";
  $allPods["Pod C"]["Name"] = "Pod C";


  $allOperators = "2B,9S,A2";

  if (isset($_GET["pods"])) {
    header("Content-Type: application/json");
    $pods = $_GET["pods"];

    if ($pods === "all") {
      echo json_encode($allPods);
    }

    else if ($pods === "pod-a") {
      echo json_encode($allPods["Pod A"]);
    }
    else if ($pods === "pod-b") {
      echo json_encode($allPods["Pod B"]);
    }
    else if ($pods === "pod-c") {
      echo json_encode($allPods["Pod C"]);
    }
    else {
      header("HTTP/1.1 400 Invalid Request");
      echo "Missing valid value for 'pod' parameter";
    }
  }

  else if (isset($_GET["operators"])) {
    header("Content-Type: text/plain");
    $operators = $_GET["operators"];
    if ($operators === "all") {
      print_r($allOperators);
    }
    else {
      header("HTTP/1.1 400 Invalid Request");
      echo "Missing valid value for 'operators' parameter";
    }
  }

  else if (isset($_GET["summoners"])) {
    $summoners = $_GET["summoners"];
    echo "test";
    makeRequest(PROXY_URL + RIOT_URL + SUMMONERS_BY_NAME + summonerName + API_KEY, responseData, checkStatusJSON);
  }

  else {
    header("HTTP/1.1 400 Invalid Request");
    echo "Missing required 'pods' or 'operators' GET parameter";
  }


  function printJSON($responseData) {
    header("Content-Type: application/json");
    echo json_encode(responseData);
  }

  /**
  *  Makes GET request to specified URL and runs specified function if
  *  request is successful.
  *  @param {String} apiURL - URL that get request is made to
  *  @param {function} successFunction - function to be run if GET request is successful
  */
 function makeRequest($apiURL, $successFunction, $checkStatus) {
   // CORB blocked, need HTML encoding
   $myHeaders = new Headers();
   $myHeaders.append("X-Content-Type-Options","nosniff");
   $myHeaders.append("Content-Type", "application/json");
   $myHeaders.append("Access-Control-Allow-Origin", "*");

   fetch($apiURL)
    .then($checkStatus)
    .then($successFunction)
    .catch(echo);
 }
  /**
 * Helper function to return the response's result text if successful, otherwise
 * returns the rejected Promise result with an error status and corresponding text
 * @param {object} response - response to check for success/error
 * @returns {object} - valid result JSON if response was successful, otherwise rejected
 *                     Promise result
 */
  function checkStatusJSON($response) {
    if ($response.status < 300) {
     echo "source extracted";
     return $response.json();
   } else {
     echo "source: ".$response.json();
     return Promise.reject(new Error($response.status + ": " + $response.statusText));
   }
  }
  /**
 * Helper function to return the response's result text if successful, otherwise
 * returns the rejected Promise result with an error status and corresponding text
 * @param {object} response - response to check for success/error
 * @returns {object} - valid result text if response was successful, otherwise rejected
 *                     Promise result
 */
  function checkStatusPlainText($response) {
    if ($response.status < 300) {
     echo "source extracted";
     return $response.text();
   } else {
     echo "source: ".$response.json();
     return Promise.reject(new Error($response.status.": ".$response.statusText));
   }
  }
?>
