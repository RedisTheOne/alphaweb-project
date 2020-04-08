const express = require('express');
const router = express.Router();
const Shopify = require('shopify-api-node');
const request = require('request');

const shopify = new Shopify({
    shopName: "alphaweb-imb",
    apiKey: "b1af561f1fe9c1c95c3adc724f8aac75",
    password: "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"
});

const merrArtikujOptions = {
    'method': 'POST',
    'url': 'http://34.76.9.124:3033/artikujpost',
    'headers': {
        'Content-Type': ['application/json', 'application/json'],
        'Authorization': 'Basic a29uZmlnOmJkZTJkMGI4YTE4MGY3ZmJmMmJjOWJhYzMxNDY0M2RjMjFhNjc3NmVjOWE3YTVhNDZkMGE2Yzg5MGVhZTEyY2I=',
        'ndermarrjaserver': 'Alpha WEB'
    },
    body: JSON.stringify({"art":[{"NRSEL":"","NRCHUNK":"","MARRE":"1900-01-01T00:00:00","PERDORUES":"Henrik"}]})
};

//Initialize Products From AlphaWeb to Shopify
router.post('/initialize', (req, res) => {
    request(merrArtikujOptions, function (error, response) { 
        if (error) throw new Error(error);
        const products = JSON.parse(response.body).entiteteTeReja.artRi;
        products.forEach((product, i) => {
            shopify.product
            .create({
                title: product.PERSHKRIMARTIKULLI,
                body_html: `<strong>${product.PERSHKRIMARTIKULLI}</strong>`,
                vendor: "IMB",
                product_type: "Alpha web product",
                tags: [
                "IMB",
                "Alpha Web"
                ]
            })
            .then(result => {
                if(i === products.length) {
                    res.json({message: "Initialization done!"});
                }
            })
            .catch(err => res.json(err))
        })
        res.json(JSON.parse(response.body));
      });
});

//Shton produktin ne api e alphes, shembull i req.body
// "KODI":"Henrik",
// "PERSHKRIMI":"Henrik",
// "NJESIA1":"1",
// "KONTROLLGJENDJE":"1",
// "KLASA":"2",
// "LLOGARIINVENTARI":"311",
// "LLOGARIBLERJE":"6011",
// "LLOGARISHITJE":"701",
// "METODEKOSTO":"3",
// "AKTIV":"1",
// "LLOJI":"4",
// "ISHITSHEM":"1"
router.post('/add/alpha', (req, res) => {
    console.log(req.body);
    if(req.body.KODI && req.body.PERSHKRIMI && req.body.NJESIA1 && req.body.KONTROLLGJENDJE && req.body.KLASA && req.body.LLOGARIINVENTARI 
    && req.body.LLOGARIBLERJE && req.body.LLOGARISHITJE && req.body.METODEKOSTO && req.body.AKTIV && req.body.LLOJI && req.body.ISHITSHEM) {
        var options = {
            'method': 'POST',
            'url': 'http://34.76.9.124:3033/importoEksportin',
            'headers': {
            'Content-Type': ['application/json', 'application/json'],
            'Authorization': 'Basic a29uZmlnOmJkZTJkMGI4YTE4MGY3ZmJmMmJjOWJhYzMxNDY0M2RjMjFhNjc3NmVjOWE3YTVhNDZkMGE2Yzg5MGVhZTEyY2I=',
            'ndermarrjaserver': 'Alpha WEB'
            },
            body: JSON.stringify({
            "listEksportuar":{
                "kokaEksport":[
                {
                    "IDIMPORTKOKA":"",
                    "KODI":req.body.KODI,
                    "PERSHKRIMI":req.body.PERSHKRIMI,
                    "NJESIA1":req.body.NJESIA1,
                    "KONTROLLGJENDJE": req.body.KONTROLLGJENDJE,
                    "KLASA":req.body.KLASA,
                    "LLOGARIINVENTARI":req.body.LLOGARIINVENTARI,
                    "LLOGARIBLERJE":req.body.LLOGARIBLERJE,
                    "LLOGARISHITJE:":req.body.LLOGARISHITJE,
                    "METODEKOSTO":req.body.METODEKOSTO,
                    "AKTIV":req.body.AKTIV,
                    "LLOJI":req.body.LLOJI,
                    "ISHITSHEM":req.body.ISHITSHEM
                }
                ]
            },
            "formatPerImport":"ImportArtikuj","formatObjekti":"Artikull"})
        };
        request(options, function (error, response) { 
            if (error) throw new Error(error);
            console.log(response.body)
            res.json(JSON.parse(response.body));
        });
    } else {
        res.json({message: "Initialization done!"});
    }
});

//Products
router.get("/products/:limit", async (req, res) => {
    let params = { limit: req.params.limit };
    let productsArr = []
    do {
        const products = await shopify.product.list(params);
        productsArr = products;
   
      params = products.nextPageParameters;
    } while (params !== undefined);

    res.json(productsArr)
});

//Orders
router.get("/orders", (req, res) => {
    shopify.order
        .list()
        .then(orders => {
            res.json(orders)
        })
        .catch(err => {
            res.json(err)
        })
})

//Customers
router.get("/customers", (req, res) => {
    shopify.customer
        .list()
        .then(constumers => {
            res.json(constumers)
        })
        .catch(err => {
            res.json(err)
        })
})

//Countries Avaiable
router.get("/countries", (req, res) => {
    shopify.country
        .list()
        .then(constumers => {
            res.json(constumers)
        })
        .catch(err => {
            res.json(err)
        })
});

//Add Customer, req.body example
// {
// 	"firstName": "Redis",
// 	"lastName": "Rira",
// 	"email": "redis123445@gmail.com",
// 	"phone": "+355 69 644 0817",
// 	"address": "Tirana, Albania",
// 	"city": "Tirana",
// 	"province": "TR",
// 	"zip": "1001",
// 	"country": "Albania"
// }
router.post("/add/customer", (req, res) => {
    if(req.body.firstName && req.body.lastName && req.body.email && req.body.phone && req.body.address && req.body.city  && req.body.zip && req.body.country) {
        shopify.customer
        .create({
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            verified_email: false,
            addresses: [
                {
                  address1: req.body.address,
                  city: req.body.city,
                  province: req.body.province,
                  phone: req.body.phone,
                  zip: req.body.zip,
                  last_name: req.body.firstName,
                  first_name: req.body.lastName,
                  country: req.body.country
                }
              ]
        })
        .then(result => res.json(result))
        .catch(err => res.json(err))
    } else {
        res.json({message: "Please provide the required credentials"});
    }
});

//Shto Produkt Ne Shopify, shembull i req.body
router.post("/add/product", (req, res) => {
    shopify.product
        .create({
            title: req.body.title,
            body_html: `<strong>${req.body.body_html}</strong>`,
            vendor: "IMB",
            product_type: "Alpha web product",
            tags: [
            "IMB",
            "Alpha Web"
            ]
        })
        .then(result => {
            res.json(result);
        });
});

module.exports = router;