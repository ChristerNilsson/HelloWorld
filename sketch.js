var a  // in: från Excel
var b  // ut: email 
var c  // ut: sms

function setup() {
  a = select('#a')
  b = select('#b')
  c = select('#c')
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