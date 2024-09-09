const express = require('express');
const path = require('path');
const fs = require("fs");
const { getPostById } = require('./a');
const app = express();
const axios = require('axios');
const { on } = require('events');
const PORT = process.env.PORT || 3000;
const indexPath = path.resolve(__dirname, '..', 'build', 'index.html');

// static resources should just be served as they are
app.use(express.static(
    path.resolve(__dirname, '..', 'build'),
    { maxAge: '30d' },
));

let MetaTags = {
    title: "DigiphyNFT",
    description: "Buy NFTs From Your Favourite Brands, Now you can buy your favourite products from the brands you love and get complimentary Metaverse NFTs and Crypto Reward.",
    thumbnail: "https://api.digiphynft.shop/api/uploads/image-1656053820251.png"
}

// here we serve the index.html page

app.get('/*', async (req, res, next) => {

    try {
        fs.readFile(indexPath, 'utf8', async (err, htmlData) => {
            if (err) {
                throw err;
            }
            if (req.url.split('/').length == 4) {

                const item_edition_id = req.url.split('/')[3];
                const res = await itemDetails(item_edition_id);
                
                MetaTags = {
                    title: res.response.name,
                    description: res.response.description,
                    thumbnail: "https://digiphy.mypinata.cloud/ipfs/" + res.response.image
                }
            }
            htmlData = htmlData.replace(
                "<title>React App</title>",
                `<title>${MetaTags.title}</title>`
            )
                .replace('__META_OG_TITLE__', MetaTags.title)
                .replace('__META_OG_DESCRIPTION__', MetaTags.description)
                .replace('__META_DESCRIPTION__', MetaTags.description)
                .replace('__META_OG_IMAGE__', MetaTags.thumbnail)

            return res.send(htmlData);
        });
    } catch (error) {
        console.log(error.toString())
    }
});
// listening...
app.listen(PORT, (error) => {
    if (error) {
        return console.log('Error during app startup', error);
    }
    console.log("listening on " + PORT + "...");
});

async function itemDetails(id) {
    var data = JSON.stringify({
        "item_edition_id": id
    });

    var config = {
        method: 'post',
        url: 'https://api.digiphynft.shop/api/itemdetail',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    const res = await axios(config);
    return res.data;
}