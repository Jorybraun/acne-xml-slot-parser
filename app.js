var fs = require('fs'),
    xml2js = require('xml2js');
 
var parser = new xml2js.Parser();

fs.readFile('./home.xml', (err, file) => {
    console.log(file)
    parser.parseString(file, (err, json) => {
        const slots = Object.entries(json['slot-configurations']['slot-configuration'])
        
        console.log()

        for (const slot of slots) {
            console.log(slot[1].content)
        }

    })
})