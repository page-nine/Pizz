const functions = require('firebase-functions');
var admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);

var firestore = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.webhook = functions.https.onRequest((request, response) => {
        console.log("request.body.result.parameters: ",request.body.result.parameters);
        //{
        //const agent = new WebhookClient({ request, response });

        let params = request.body.result.parameters;
        
        if (params.sides === 'Yes'){
            sides(params)
        }

        if (params.confirmation === 'No'){
            response.send({
                speech:
                `Do you have anything more to order?`
            });
        }

        function sides (params) {

            response.send({
                    speech:
                    `Do you want fries, ice cream, pancake`
            });

            if (params.sideskind === 'Fries'){
                response.send({
                    speech:
                    `What size of fries do you want?`
                });
            }
        }


        firestore.collection('orders')
            .add(params)
            .then(() => {
                if (params.sides === 'Yes'){
                    if (params.sideskind === 'Fries'){
                        response.send({
                            speech:
                                `Your order request for ${params.number} ${params.pizza_size} Pizza 
                                with ${params.toppings} and a ${params.Friessize} ${params.sideskind} 
                                is fowarded`
                        });
                    }else{
                        response.send({
                            speech:
                                `Your order request for ${params.number} ${params.pizza_size} Pizza 
                                with ${params.toppings} and a ${params.sideskind} is fowarded`
                        });
                    }
                }else{
                    response.send({
                        speech:
                            `Your order request for ${params.number} ${params.pizza_size} Pizza 
                            with ${params.toppings} is fowarded`
                    });
                }
                return 0;
            })
            .catch((e=>{
                console.log('error: ',e);
                response.send({
                    speech:
                        `something went wrong when writing on database`
                });
            }))
})
