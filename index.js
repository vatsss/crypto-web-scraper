const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

async function getPriceFeed(){
    try{
        const siteUrl = 'https://coinmarketcap.com/';

        const data = await axios({
            method: 'GET',
            url: siteUrl,
        })
       // console.log(data.data);

        const $ = cheerio.load(data.data);
        const elementSelector = '#__next > div > div.main-content > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div > div.h7vnx2-1.bFzXgL > table > tbody > tr';

        const keys = [
            'rank',
            'name',
            'price',
            '24h',
            '7d',
            'marketCap',
            'volume',
            'circulatingSupply'
        ]

        const coinArr = [];

        $(elementSelector).each((parentIdx,parentElem) => {
            let keyIdx = 0;
            const coinObj = {};

            if(parentIdx <= 50){
                $(parentElem).children().each((childIdx,childElem) =>{
                    const tdValue = $(childElem).text();
                    if(tdValue){
                        //console.log(keys[keyIdx]);
                        coinObj[keys[keyIdx]] = tdValue;
                        keyIdx++;
                    }
                })
               // console.log(coinObj);
               coinArr.push(coinObj);
            }
        })
         //console.log(coinArr);
         return coinArr;
    }
    catch(err){
        console.error(err);
    }
}

//getPriceFeed();
const app = express();
app.get('/api/price-feed', async(req,res)=>{
    try{
        const priceFeed = await getPriceFeed();
        return res.status(200).json({
            result: priceFeed,
        })
    }
    catch(err){
        return res.status(500).json({
            err: err.toString(),
        })
    }
})

app.listen(3000, ()=>{
    console.log("server is running on port 3000");
})
