const API_URL = 'http://localhost:4001'

let productId = getProductId(window.location.href) 

getCobuyersOfAProduct()
getProductById()

let cobuyers = []

let product 

function getProductById(){
    if (productId){
        let url =  `${API_URL}/product/${productId}`
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.onreadystatechange = function (e){
            if (xhr.readyState == 4 && xhr.status == 200){
                product = JSON.parse(xhr.responseText);
                console.log('product', product)
            }
        
        }
        xhr.send()  
    }
}

function getCobuyersOfAProduct(){
    if (productId){
        let url =  `${API_URL}/product/${productId}/cobuyer`
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.onreadystatechange = function (e){
            if (xhr.readyState == 4 && xhr.status == 200){
                cobuyers = JSON.parse(xhr.responseText);
                console.log('cobuyers', cobuyers)
            }
        
        }
        xhr.send()  
    }
}

function getProductId(url){
    for (let i = 0; i < url.length; i++){
        if (url.slice(i, i+10) === "productId="){
            return url.slice(i+10, url.length )
        }

    }
    return null
}
