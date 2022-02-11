const fs = require('fs')

const axios = require('axios')

axios
  .get('https://provinces.open-api.vn/api/?depth=3')
  .then((response) => {
    console.log(response.data)
    const parsed = JSON.stringify(response.data)
    fs.writeFile('provinceData.json', parsed, (error, data) => {
      if (error) console.log(error)
    })
  })
  .catch(console.log)
