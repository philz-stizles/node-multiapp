const request = require('request')

// GET /tasks?sortBy=createdAt:desc
exports.getWeather = (req, res) => {
    const { query, unit } = req.query

    let url = `${process.env.WEATHER_API_URI}/current?access_key=${process.env.WEATHER_API_ACCESS_KEY}&query=${query}`

    if(unit) {
        url +=`&units=${unit}`
    }
    
    console.log(url)

    request({ url, json: true }, (err, response, body) => { // Set the json option to parse the response as json, 
        // this means that response.body will already be an object and there will be no need for JSON.parse(response.body)

        console.log('error', err)
        console.log('response', response.body, response.statusCode)
        console.log("body", body)
        if(err) {
            return res.status(500).send({ status: false, data: error, message: error.message })
        }

        if(response.statusCode !== 200) {
            return res.status(400).send({ status: false, data: error, message: error.message })
        }
        
        // const { success, error } = response
        // if(!response.success) {
        //     return res.status(400).send({ status: success, message: error.info })
        // }

        console.log(response.body)

        // const data = JSON.parse(response.body) // This will not be required if the json option is set
        const data = response.body
        const { current } = data
        res.send({ 
            status: true, 
            data: data, 
            message: `${current.weather_descriptions[0]}. It is currently ${current.temperature} degrees out. It feels like ${current.feelslike}% degrees out` 
        })
    })
}