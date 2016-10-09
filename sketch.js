var a0 // in: från .csv
var a  // in/ut: Excel
var b  // ut: email 
var c  // ut: sms

HEADER_A0 = "Reserved	C.firstName	x1	C.lastName	x2	C.birthDay	C.sex	C.email	C.mobile	C.streetAdress1	C.streetAdress2	C.zipcode	x3	C.city	x4	x5	P1.firstName	x6	P1.lastName	x7	P1.email	P1.mobile	P1.otherAdress	P1.streetAdress1	P1.streetAdress2	P1.zipcode	x8	P1.city	x9	x10	P2.firstName	x11	P2.lastName	x12	P2.email	P2.mobile	P2.otherAdress	P2.streetAdress1	P2.streetAdress2	P2.zipcode	x13	P2.city	x14	Consent	userID	inputID1	inputDate	source	x15	amount	transDate	transStatus	inputID2	browser	ipAddress"
 //           Reserved	inputID1	inputDate	C.firstName	C.lastName	C.sex	C.birthDay	C.personNummer	C.email	C.mobile	C.streetAdress1	C.zipcode	C.city	P1.firstName	P1.lastName	P1.sex	P1.birthDay	P1.personNummer	P1.email	P1.mobile	P1.otherTel	P1.streetAdress1	P1.zipcode	P1.city	P2.firstName	P2.lastName	P2.sex	P2.birthDay	P2.personNummer	P2.email	P2.mobile	P2.otherTel	P2.streetAdress1	P2.zipcode	P2.city	inpuID2	income	C.combined	siblings	comment	sendList"

HEADER_A = "Reserved\tinputID1	inputDate	C.firstName	C.lastName	C.sex	C.birthDay	C.personNummer	C.email	C.mobile	C.streetAdress1	C.zipcode	C.city	P1.firstName	P1.lastName	P1.sex	P1.birthDay	P1.personNummer	P1.email	P1.mobile	P1.otherTel	P1.streetAdress1	P1.zipcode	P1.city	P2.firstName	P2.lastName	P2.sex	P2.birthDay	P2.personNummer	P2.email	P2.mobile	P2.otherTel	P2.streetAdress1	P2.zipcode	P2.city	inpuID2	income	C.combined	siblings	comment	sendList"
HEADER_B = "C.combined	C.lastName	C.pronoun	P.pronoun	P.combined	P1.firstName	P1.lastName	P1.email	P1.mobile	P2.firstName	P2.lastName	cc	P2.mobile"
HEADER_C = "firstName	lastName	Category	email	mobile"

function setup() {
  a0 = select('#a0')
  a = select('#a')
  b = select('#b')
  c = select('#c')
  a0.input(transform_a0)
  a.input(transform_a)
  a.wrap = 'off'  
}

function ppronoun(cells,p1,p2) {
  var combined = []
  if (cells[p1] !== "" && cells[p1] !== null) combined.push(cells[p1])
  if (cells[p2] !== "" && cells[p2] !== null) combined.push(cells[p2])
  return ["","Du","Ni"][combined.length]
}

function pcombined(cells,p1,p2) {
  var combined = []
  if (cells[p1] !== "" && cells[p1] !== null) combined.push(cells[p1])
  if (cells[p2] !== "" && cells[p2] !== null) combined.push(cells[p2])
  return join(combined," och ")
}

function addera_c(cells,category,first,last,email,phone) {
  if (cells[phone] === undefined) return ""
  if (cells[phone].length != 13) return ""
  var res = [cells[first], cells[last], category, cells[email], cells[phone]]
  return join(res,"\t") + "\n"
}

// 0780-45 23 46
// 0702561234	
// 0752024061	
// 46730652211	
// 0730-6545899
// +46 8 25 46 78
// +46708 45 12 14
// 0046708 45 12 14
function prettyPhone(s) {  
  if (s===undefined) return ""
  
  // int bort
  if (s.startsWith("460")) s = s.replace("46","")
  if (s.startsWith("46")) s = s.replace("46","0")
  if (s.startsWith("+46")) s = s.replace("+46","0")
  if (s.startsWith("0046")) s = s.replace("0046","0")
  
  // tag bort blanktecken och bindestreck
  s = s.replace(/ /g,"") 
  s = s.replace(/-/g,"") 
  
  // Lägg in bindestreck om det saknas. Specialbehandla 08
  if (s.startsWith('08')) {
    if (s.indexOf('-')==-1) s = s.substr(0,2) + "-" + s.substr(2) // saknas - så lägg in
  } else {
    if (s.indexOf('-')==-1) s = s.substr(0,4) + "-" + s.substr(4) // saknas - så lägg in
  }
  
  // lägg in två blanktecken
  n = s.length
  s = s.substr(0,n-4) + " " + s.substr(n-4) 
  n = s.length
  s = s.substr(0,n-2) + " " + s.substr(n-2) 
  
  return s  
}

function prettyZipcode(zip) {
  var zip = zip.toString().replace(' ','')
  return zip.slice(0, 3) + " " + zip.slice(3)
}

function equal(a,b) {
  a = a.split("\t")
  b = b.split("\t")
  var n=a.length
  if (a.length != b.length) {
    alert("Olika antal kolumner: " + a.length + " != " + b.length)
    return false
  }
  for (var i=0; i<n; i++) {
    if (a[i]!=b[i]) {
      alert (a[i] + " != " + b[i])
      return false
    }
  }
  return true
}

function moveMobile(res,i,j) {
  console.log(res[i])
  if (res[i] === null) return
  if (res[i].length===13 && res[i].startsWith("07")) return
  res[j] = res[i]
  res[i] = ""
}

function utskick(zipcode) {return zipcode < "200" ? "Utskick" : ""  }

function capitalize1(string) { // eva-stina => Eva-Stina
  var state = 0
  var res = ""
  for (var i=0; i<string.length; i++) {
    var ch = string[i]
    if (state==0) {
      ch = ch.toUpperCase()
      state=1
    }
    res += ch;
    if (ch==' ' || ch=='-') state=0
  }
  return res
}
  
function capitalize(string) {return string.toUpperCase();}

function transform_a0() {
  var txt = a0.value()
  var lines = split(txt,"\n")
  var ar = HEADER_A + "\n"
  var header = lines.shift()
  
  if (!equal(header,HEADER_A0)) {
    return
  }
  for (var rad of lines) {
    var cells = split(rad,"\t")    
    if (cells.length < 45) continue
    if (cells[1]=="") continue

    var res = [""]      // 0 reserved
    res.push(cells[45]) // 1 ID
    res.push(cells[46]) // 2 DATUM 
    
    res.push(capitalize1(cells[1])) // 3 barn.förnamn
    res.push(capitalize1(cells[3])) // 4 barn.efternamn
    res.push(cells[6]) // 5 barn.sex
    res.push(cells[5]) // 6 barn.födelsedag
    res.push("")       // 7 barn.personnummer
    res.push(cells[7]) // 8 barn.email
    res.push(prettyPhone(cells[8])) // 9 barn.mobil
    res.push(capitalize1(cells[9]) + cells[10]) // 10 barn.streetadr
    res.push(prettyZipcode(cells[11])) // 11 barn.zipcode
    res.push(capitalize(cells[13])) // 12 barn.city

    res.push(capitalize1(cells[16]))  // 13 parent1.förnamn
    res.push(capitalize1(cells[18]))  // 14 parent1.efternamn
    res.push("") // 15 parent1.sex
    res.push("") // 16 parent1.födelsedag
    res.push("") // 17 parent1.personnummer
    res.push(cells[20]) // 18 parent1.email
    res.push(prettyPhone(cells[21])) // 19 parent1.mobil
    res.push("") // 20 parent1.otherTel
    if (cells[22]=="Annan adress?") {
      res.push(capitalize1(cells[23]) + cells[24]) // 21 parent1.streetadr
      res.push(prettyZipcode(cells[25])) // 22 parent1.zipcode
      res.push(capitalize(cells[27])) // 23 parent1.city
    } else {
      res.push(capitalize1(cells[9]) + cells[10]) // 21 parent1.streetadr
      res.push(prettyZipcode(cells[11])) // 22 parent1.zipcode
      res.push(capitalize(cells[13])) // 23 parent1.city
    }

    res.push(capitalize1(cells[30]))  // 24 p2.förnamn
    res.push(capitalize1(cells[32]))  // 25 p2.efternamn
    res.push("") // 26 parent2.sex
    res.push("") // 27 parent2.födelsedag
    res.push("") // 28 parent2.personnummer
    res.push(cells[34]) // 29 parent2.email
    res.push(prettyPhone(cells[35])) // 30 parent2.mobil
    res.push("") // 31 parent2.othertel
    if (cells[36]=="Annan adress?") {
      res.push(capitalize1(cells[37]) + cells[38]) // 32 parent2.streetadr
      res.push(prettyZipcode(cells[39])) // 33 parent2.zipcode
      res.push(capitalize(cells[41])) // 34 parent2.city
    } else {
      res.push(capitalize1(cells[9]) + cells[10]) // 32 parent2.streetadr
      res.push(prettyZipcode(cells[11])) // 33 parent2.zipcode
      res.push(capitalize(cells[13])) // 34 parent2.city
    }
    
    res.push("") // 35 inputID2
    res.push("") // 36 income
    res.push("") // 37 C.combined
    res.push("") // 38 siblings
    res.push("") // 39 comment
    res.push(utskick(cells[11])) // 40 sendList
    
    moveMobile(res,19,20)
    moveMobile(res,30,31)
    
    ar += join(res,"\t") + "\n"
  }
  a.value(ar)
  transform_a()
}

function transform_a() {
  transform_a_b()
  transform_a_c()
}

function cpronoun(group) {
  if (group.length>1) return "dom"
  child = group[0]
  return child[5]=="Kille" || child[5]=="kille" ? "han" : "hon" 
}

function ccombined(group) {
  var res = ''
  for (var i=0; i<group.length; i++) {
    var child = group[i]
    res += child[3]  
    if (i<group.length-2) {
      res += ', '
    } else if (i==group.length-2) {
      res += ' och '
    }
  }
  return res
}

function mailcombined(group) {
  var res = []
  for (key in group) {
    var child = group[key]
    if (child[8]!="") res.push(child[8])
    if (child[29]!="") res.push(child[29])
  }
  function onlyUnique(value, index, self) { return self.indexOf(value) === index;}
  var unique = res.filter( onlyUnique );  
  return join(unique, ", ")
}

function transform_a_b() {
  var txt = a.value()
  var lines = split(txt,"\n")
  var br = HEADER_B + "\n"

  var header = lines.shift()
  if (!equal(header,HEADER_A)) {
    return
  }

  // Organisera om lines. De ska ligga som listor i en dict nycklad pa p1.email
  dictionary = {}
  for (var rad of lines) {
    var cells = split(rad,"\t")    
    key = cells[18]
    if  (!(key in dictionary)) {
      dictionary[key] = []
    }
    dictionary[key].push(cells)
  }
  
  for (var key in dictionary) {
    var group = dictionary[key]
    var child = group[0]
    res = []
    res.push(ccombined(group)) // C.combined
    res.push(child[4]) // E C.lastName
    res.push(cpronoun(group)) // C.pronoun
    res.push(ppronoun(child,13,24)) // P.pronoun
    res.push(pcombined(child,13,24)) // P.combined
    res.push(child[13]) // N P1.firstName
    res.push(child[14]) // O P1.lastName
    res.push(child[18]) // S P1.email
    res.push(child[19]) // T P1.mobile
    res.push(child[24]) // Y P2.firstName
    res.push(child[25]) // Z P2.lastName
    res.push(mailcombined(group)) // cc
    res.push(child[30]) // AE P2.mobile

    if (join(res,"\t").length>40) br += join(res,"\t") + "\n"

  }
  b.value(br)
}

function savePhone(d,cells,msg,firstName,lastName,email,mobile) {
  if (cells[mobile]==='' || cells[mobile]===null) return
  d[cells[mobile]] = [msg,cells[firstName],cells[lastName],cells[email],cells[mobile]]
}

function transform_a_c() {
  var txt = a.value()
  var lines = split(txt,"\n")
  var cr = HEADER_C + "\n"

  var header = lines.shift()
  if (!equal(header,HEADER_A)) {
    return
  }

  // Organisera om lines. De ska ligga som listor i en dict nycklad pa mobile
  dictionary = {}
  for (var rad of lines) {
    var cells = split(rad,"\t")
    savePhone(dictionary,cells,"child",3,4,8,9)
    savePhone(dictionary,cells,"parent",13,14,18,19)
    savePhone(dictionary,cells,"parent",24,25,29,30)
  }
  
  for (var key in dictionary) {
    var person = dictionary[key]
    res = []
    res.push(person[1]) // firstName
    res.push(person[2]) // lastName
    res.push(person[0]) // child/parent
    res.push(person[3]) // email
    res.push(person[4]) // mobile

    if (join(res,"\t").length > 20) {
      cr += join(res,"\t") + "\n"
    }

  }
  c.value(cr)
}

