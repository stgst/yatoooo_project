jdata = [1, 2, 3, 4, 5]

var i = 0
for ( var item of jdata ){
    if (item == 3){
        jdata.splice(i, 1)
        i++
        console.log(jdata)
    }else if (item == 5){
        jdata.splice(i, 1)
        i++
        console.log(jdata)
    }else {
        i++
    }
}
console.log(jdata.length)