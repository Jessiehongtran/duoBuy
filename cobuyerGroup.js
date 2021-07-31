const API_URL = 'http://localhost:4001'

let productId = getProductId(window.location.href) 
getCobuyersOfAProduct()

let cobuyers = []

function getCobuyersOfAProduct(){
    if (productId){
        let url =  `${API_URL}/product/${productId}/cobuyer`
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.onreadystatechange = function (e){
            if (xhr.readyState == 4 && xhr.status == 200){
                let response = JSON.parse(xhr.responseText);
                console.log('cobuyers', response)
                cobuyers = response
            }
        
        }
        xhr.send()  
    }
}

function getProductId(url){
    for (let i = 0; i < url.length; i++){
        if (url.slice(i, i+4) === "url="){
            return url.slice(i+4, url.length )
        }

    }
    return null
}
