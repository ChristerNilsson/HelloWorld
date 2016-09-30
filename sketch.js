var a0 // in: från .csv
var a  // in/ut: Excel
var b  // ut: email 
var c  // ut: sms

function setup() {
  a0 = select('#a0')
  a = select('#a')
  b = select('#b')
  c = select('#c')
  a0.input(transform0)
  a.input(transform)
  a.wrap = 'off'  
}

function addera_b(res,cells,first,last,email,phone) {
  if (cells[first] === "") return
  if (cells[first] === undefined) return 
  res.push(cells[first])
  res.push(cells[last])
  res.push(cells[email])
  res.push(cells[phone])
}

function addera_b1(res,cells,sex,p1first,p2first) {
  var combined = []
  if (cells[p1first] !== "" && cells[p1first] !== null) combined.push(cells[p1first])
  if (cells[p2first] !== "" && cells[p2first] !== null) combined.push(cells[p2first])
  res.push(cells[sex]=="Kille" || cells[sex]=="kille" ? "Han" : "Hon" )
  res.push(["","Du","Ni"][combined.length])
  res.push(join(combined," och "))
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
  if (s.startsWith("+46")) s = s.replace("+46","0")
  if (s.startsWith("0046")) s = s.replace("0046","0")
  if (s.startsWith("46")) s = s.replace("46","0")
  
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

function transform0() {
  var txt = a0.value()
  var lines = split(txt,"\n")
  var ar = ""
  for (var rad of lines) {
    var cells = split(rad,"\t")    
    if (cells.length<45) continue

    var res = []
    res.push(cells[45]) // 0 ID
    res.push(cells[46]) // 1 DATUM 
    
    res.push(cells[1]) // 2 barn.förnamn
    res.push(cells[3]) // 3 barn.efternamn
    res.push(cells[6]) // 4 barn.sex
    res.push(cells[5]) // 5 barn.födelsedag
    res.push("")       // 6 barn.personnummer
    res.push(cells[7]) // 7 barn.email
    res.push(prettyPhone(cells[8])) // 8 barn.mobil
    res.push(cells[9] + cells[10]) // 9 barn.streetadr
    res.push(cells[13]) // 10 barn.zipcode
    res.push(cells[11]) // 11 barn.city

    res.push(cells[16])  // 12 parent1.förnamn
    res.push(cells[18])  // 13 parent1.efternamn
    res.push("") // 14 parent1.sex
    res.push("") // 15 parent1.födelsedag
    res.push("") // 16 parent1.personnummer
    res.push(cells[20]) // 17 parent1.email
    res.push(prettyPhone(cells[21])) // 18 parent1.mobil
    if (cells[22]=="Annan adress?") {
      res.push(cells[23] + cells[24]) // 19 parent1.streetadr
      res.push(cells[27]) // 20 parent1.zipcode
      res.push(cells[25]) // 21 parent1.city
    } else {
      res.push(cells[9]+cells[10]) // 19 parent1.streetadr
      res.push(cells[13]) // 20 parent1.zipcode
      res.push(cells[11]) // 21 parent1.city
    }

    res.push(cells[30])  // 22 parent2.förnamn
    res.push(cells[32])  // 23 parent2.efternamn
    res.push("") // 24 parent2.sex
    res.push("") // 25 parent2.födelsedag
    res.push("") // 26 parent2.personnummer
    res.push(cells[34]) // 27 parent2.email
    res.push(prettyPhone(cells[35])) // 28 parent2.mobil
    if (cells[36]=="Annan adress?") {
      res.push(cells[37] + cells[38]) // 29 parent2.streetadr
      res.push(cells[41]) // 30 parent2.zipcode
      res.push(cells[39]) // 31 parent2.city
    } else {
      res.push(cells[9]+cells[10]) // 29 parent2.streetadr
      res.push(cells[13]) // 30 parent2.zipcode
      res.push(cells[11]) // 31 parent2.city
    }
    
    res.push("") // 32 void1
    res.push("") // 33 void2
    res.push("") // 34 void3
    res.push("") // 35 void4
    res.push("") // 36 comment
    res.push("") // 37 mail
    ar += join(res,"\t") + "\n"
  }
  a.value(ar)
  transform()
}

function transform() {
  var txt = a.value()
  var lines = split(txt,"\n")
  var br = ""
  var cr = ""
  for (var rad of lines) {
    var cells = split(rad,"\t")    
    
    res = []
    addera_b(res,cells,2,3,7,8)
    addera_b1(res,cells,4,12,22)
    addera_b(res,cells,12,13,17,18)
    addera_b(res,cells,22,23,27,28)
    if (res.length>5) br += join(res,"\t") + "\n"

    cr += addera_c(cells,"child",2,3,7,8)
    cr += addera_c(cells,"parent",12,13,17,18)
    cr += addera_c(cells,"parent",22,23,27,28)

  }
  b.value(br)
  c.value(cr)
}