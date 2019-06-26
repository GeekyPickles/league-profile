# YORHA API Documentation
The YoRha API provides descriptions and icons of all three usable pods in
NieR Automata, as well as the names of the game's three playable characters.

## Get an associative array of all three pods
**Request Format:** yorha.php?pods=all

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Returns all three pods and their detailss


**Example Request:** yorha.php?pods=all

**Example Response:**
```
"0": "Pod A",
"1": "Pod B",
"2": "Pod C",
"Pod A": {
    "Weapon": "Machine Gun",
    "Ability": "Gravity",
    "Icon": "imgs/pod-a.jpg",
    "Info": "Default Pod given to you at the start of the game.",
    "Name": "Pod A"
},
"Pod B": {
    "Weapon": "Laser",
    "Ability": "Charged Laser",
    "Icon": "imgs/pod-b.png",
    "Info": "Pod b fires a laser that does constant damage but is short range",
    "Name": "Pod B"
},
"Pod C": {
    "Weapon": "Homing Missiles",
    "Ability": "Bomb",
    "Icon": "imgs/pod-c.png",
    "Info": "???",
    "Name": "Pod C"
}
}
```

**Error Handling:**
- If missing the `pods`, it will 400 error with a helpful message:
`Missing valid value for 'pods' parameter`
- If missing `all` for the value of `pods`, it will 400 error with a helpful message:
`Missing valid value for 'pods' parameter`
- If missing `pods` and `operators`, it will 400 error with a helpful message:
`Missing required 'pods' or 'operators' GET parameter`

## Get a string of all three operator names
**Request Format:** yorha.php?operators=all

**Request Type**: GET

**Returned Data Format**: Plain Text

**Description:** Returns all three operator names separated by commas in a String

**Example Request:** yorha.php?operators=all

**Example Response:**
```
'2B,9S,A2'
```

**Error Handling:**
- If missing the `operators`, it will 400 error with a helpful message:
`Missing valid value for 'operators' parameter`
- If missing `all` for the value of `operators`, it will 400 error with a helpful message:
`Missing valid value for 'operators' parameter`
- If missing `pods` and `operators`, it will 400 error with a helpful message:
`Missing required 'pods' or 'operators' GET parameter`
