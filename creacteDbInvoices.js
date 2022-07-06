const { API, endpoint } = require("./instances/instances");
const { createInvoice } = require("./utilsInvoice");


objCart =
    { "_id": "62c09be228fa266a49087cc6", "idTlgUser": 1869111983, "products": [{ "productId": "1", "quantity": 2 }, { "productId": "14", "quantity": 1 }, { "productId": "17", "quantity": 1 }, { "productId": "19", "quantity": 1 }, { "productId": "2", "quantity": 2 }, { "productId": "5", "quantity": 2 }, { "productId": "6", "quantity": 2 }, { "productId": "7", "quantity": 1 }], "email": "janetheglee@gmail.con", "nameUser": "Janeth HernÃ¡ndez", "location": 'Avenida caracas, edificio rosa.' };

(async (idUser) => {
    const tiempoTranscurrido = Date.now();
    const hoy = new Date(tiempoTranscurrido);
    let resp = await API.get(`${endpoint.GET_CARTS_ID}${idUser}`)
    let data = resp.data  //data del user
    let objCart = data[0]
    let productsUser = objCart.products
    let dataProduct = await API.get(endpoint.GET_PRODUCTS)
    let arrayProduct = dataProduct.data //data de los productos
    let mostrar = '', i, lenProductsUser = productsUser.length, total = 0, index, mostrarCorreo = '', items = [];     
   
    for (i = 0; i < lenProductsUser; i++) {
        
        index = productsUser[i].productId - 1
        total = total + (arrayProduct[index].price * productsUser[i].quantity)
        items.push({
            'item': arrayProduct[index].id,
            'description': arrayProduct[index].title.substring(0, 15),
            'quantity': productsUser[i].quantity,
            'amount': Number(productsUser[i].quantity * arrayProduct[index].price * 100)
            
        })
        
    }
    const invoice = {
        shipping: {
            name: objCart.nameUser,
            address: objCart.location,
            email: objCart.email 
        },
        items: items,
        subtotal: (total * 100),
        paid: 0,
        invoice_nr: 1234
    };
    
    createInvoice(invoice, "invoice.pdf");
    try {
        await API.post(endpoint.SEND_MAIL,
            {
                name: objCart.nameUser,
                from: 'TODO MARKET',
                text: `<h3>Un gusto atenderte te damos las gracias desde todo el equipo de:&nbsp;<strong>TODO MARKET 🛒</strong></h3><hr><p></p> <p><b>Total ${total.toFixed(2)}$<b></p>`,
                to: `todomarketbot@gmail.com, ${objCart.email}`
            })
    }
    catch (error) {
        console.log(error)
    };
    

})(368033112);








/*const { default: axios } = require("axios");


(async (id) => {
 
 
 
await axios.post(' http://localhost:8888/.netlify/functions/fn-send-invoice',
{
    idTlgUser: id, products: []
})})*/