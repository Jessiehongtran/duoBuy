const API_URL = 'http://localhost:4001'

let productId = getProductId(window.location.href) 

const productImage = document.getElementsByClassName("product-image")[0]
const productName = document.getElementsByClassName("product-name")[0]
const minPrice = document.getElementsByClassName("min-price")[0]
const maxPrice = document.getElementsByClassName("max-price")[0]
const cobuyerContainer = document.getElementsByClassName("cobuyers")[0]
const fundBarColor =  document.getElementsByClassName("fund-bar color")[0]
const joinBuyButton = document.getElementsByClassName("join-btn")[0]

getCobuyersOfAProduct()
getProductById()

let product 

function getProductById(){
    if (productId){
        console.log('productId', productId)
        let url =  `${API_URL}/product/${productId}`
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.onreadystatechange = function (e){
            if (xhr.readyState == 4 && xhr.status == 200){
                product = JSON.parse(xhr.responseText);
                console.log('product', product)
                if (product){
                    productImage.src = product.product_image
                    productName.innerHTML = product.product_name
                    minPrice.innerHTML = "$" + Math.round(product.product_price/product.cobuyers_total).toString()
                    maxPrice.innerHTML = "$" + product.current_price.toString()
                    fundBarColor.style.width = `${(1 - product.current_price/product.product_price)*100}%`
                }
            }
        
        }
        xhr.send()  
    }
}

function updateProduct(id, change){
    console.log('update', id, change)
    let url = `${API_URL}/product/${id}`
    let xhr = new XMLHttpRequest();
    xhr.open('PATCH', url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onreadystatechange = function (e){
        if (xhr.readyState == 4 && xhr.status == 200){
            let response = JSON.parse(xhr.responseText);
            getProductById()
        }
    }
    xhr.send(change) 
    
}

function buy(){
    console.log('buying')
    if (product && parseInt(product.actual_cobuyers) <= parseInt(product.cobuyers_total)){
            updateProduct(productId,
                JSON.stringify({
                    actual_cobuyers: product.actual_cobuyers + 1, 
                    current_price: Math.round(product.product_price/(2+product.actual_cobuyers),2),
            
                }) 
            )
            // handleJoinBuying(product.current_price) 
        
    } else {
            updateProduct(product.id,
                JSON.stringify({
                    achieved: true
                })
            )
    
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
                let cobuyers = JSON.parse(xhr.responseText);
                console.log('cobuyers', cobuyers)
                for (let i = 0; i < cobuyers.length; i++){
                    const row = document.createElement('div')
                    row.style.display = 'flex'
                    row.style.alignItems = 'center'
                    const newcoAvatar = document.createElement('div')
                    newcoAvatar.style.width = '50px'
                    newcoAvatar.style.height = '50px'
                    newcoAvatar.style.borderRadius = '50%'
                    newcoAvatar.style.backgroundColor = 'silver'
                    newcoAvatar.style.display = 'flex'
                    newcoAvatar.style.justifyContent = 'center'
                    newcoAvatar.style.alignItems = 'center'
                    newcoAvatar.style.marginRight = '10px'
                    newcoAvatar.innerHTML = cobuyers[i].firstName[0] + cobuyers[i].lastName[0]
                    const newcoName = document.createElement('div')
                    newcoName.innerHTML = cobuyers[i].firstName + " " + cobuyers[i].lastName
                    row.appendChild(newcoAvatar)
                    row.appendChild(newcoName)
                    cobuyerContainer.appendChild(row)
                }
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
