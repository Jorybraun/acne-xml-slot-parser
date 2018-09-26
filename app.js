var fs = require('fs'),
    xml2js = require('xml2js');
 
var parser = new xml2js.Parser();

const checkForContentId = (content, id) => {
    if (content instanceof Array) {
        const contentAssets = content[0]['content-assets']
        // checkout the content assets tag for corresponding element with ID
        if (contentAssets && contentAssets.length) {
            contentAssets[0]['content-asset'].forEach((contentId) => {
                return contentId.$['content-id'].includes(id)
            })
        }
    }
}

// create new xml file from json

const parseFile = (file) => {
    return fs.readFile(file, (err, file) => {
        return parser.parseString(file, (err, json) => {
            const slots = json['slot-configurations']['slot-configuration']

            for (const slot of slots) {
                const content = slot.content
                // check slot for site specific id this doesnt belong
                if (checkForContentId(content, 'acne_se')) {
                    // delete the slot
                    delete slot
                }
            }
            return slots
        })
    })
}

modules.exports = parseFile