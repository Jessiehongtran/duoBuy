const API_URL = 'http://localhost:4001'

const productContainer = document.getElementById("products")
const newProduct = document.getElementById("newProduct")
const walletBudget = document.getElementsByClassName("money")[0]
const howItWorks = document.getElementsByClassName("how-it-works")[0]

let actualCobuyers = 1

function displayProducts(products){
    newProduct.style.display = 'none'
    
    if (productContainer.firstChild){
        while (productContainer.firstChild) {
            productContainer.removeChild(productContainer.firstChild);
        }
    }

    howItWorks.style.display = 'flex'
    howItWorks.style.flexDirection = 'column'
    howItWorks.style.width = '100%'
    howItWorks.style.alignItems = 'flex-start'

    //should not add more DOMS but only display them
    for (let i = 0; i < products.length; i++){
        const eachProduct = document.createElement("div")
        eachProduct.setAttribute('class', 'eachProduct')
        const imageContainer = document.createElement("div")
        imageContainer.setAttribute('class', 'imageContainer')
        const img = document.createElement("img")
        img.style.width = "100%"
        const nameContainer = document.createElement("div")
        nameContainer.setAttribute('class', 'nameContainer')
        const name = document.createElement("div")
        name.setAttribute('class', 'productName')
        const priceContainer = document.createElement("div")
        priceContainer.setAttribute('class', 'priceContainer')
        const maxPriceContainer = document.createElement("div")
        maxPriceContainer.setAttribute('class', 'maxPriceContainer')
        const maxIcon = document.createElement('img')
        maxIcon.setAttribute('class', 'maxIcon')
        maxIcon.src = "https://res.cloudinary.com/dfulxq7so/image/upload/v1616469856/money-bag_b7vvyv.png"
        const maxPrice = document.createElement("div")
        const minPriceContainer = document.createElement("div")
        minPriceContainer.setAttribute('class', 'minPriceContainer')
        const minIcon = document.createElement('img')
        minIcon.setAttribute('class', 'minIcon')
        minIcon.src = "https://res.cloudinary.com/dfulxq7so/image/upload/v1616469856/money-bag_b7vvyv.png"
        const minPrice = document.createElement("div")
        const joinBuyButton = document.createElement("button")
        joinBuyButton.innerHTML = "Join buying"
        joinBuyButton.setAttribute('class', 'join-btn')
        joinBuyButton.setAttribute('onclick', `updateCobuyersAndPrice(${i})`)
        img.src = products[i].product_image
        name.innerHTML = products[i].product_name
        maxPrice.innerHTML = products[i].current_price
        minPrice.innerHTML = Math.round(products[i].product_price/products[i].cobuyers_total)
        if (parseInt(maxPrice.innerHTML) < parseInt(minPrice.innerHTML)){
            minPriceContainer.style.display = 'none'
        }
        maxPriceContainer.append(maxIcon)
        maxPriceContainer.append(maxPrice)
        minPriceContainer.append(minIcon)
        minPriceContainer.append(minPrice)
        priceContainer.append(minPriceContainer)
        priceContainer.append(maxPriceContainer)
        nameContainer.append(name)
        nameContainer.append(priceContainer)
        imageContainer.append(img)
        eachProduct.appendChild(imageContainer)
        eachProduct.appendChild(nameContainer)
        eachProduct.appendChild(joinBuyButton)

        eachProduct.style.margin = '20px'
        img.style.width = '200px'
        img.style.height = '200px'
        img.style.border = '1px solid grey'

        productContainer.appendChild(eachProduct)

    }

    productContainer.style.display = 'flex'

}

const cloudName = 'demo'
const unsignedUploadPreset = 'doc_codepen_example';

function uploadFile(file, newProduct){
    let url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    let xhr = new XMLHttpRequest();
    let fd = new FormData();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.onreadystatechange = function(e){
        if (xhr.readyState == 4 && xhr.status == 200){
            //File uploaded successfully
            let response = JSON.parse(xhr.responseText);
            let url = response.secure_url;
            console.log('url', url)
            let tokens = url.split('/');
            tokens.splice(-2, 0, 'w_150,c_scale');
            newProduct.product_image = url;
            addProductToServer(newProduct)
        }
    }
    fd.append('upload_preset', unsignedUploadPreset);
    fd.append('tags', 'browser_upload'); // Optional - add tag for image admin in Cloudinary
    fd.append('file', file);
    xhr.send(fd);
}



function addProduct(){
    const name = document.getElementById("productName").value
    const price = document.getElementById("price").value
    const expectedCouyers = document.getElementById("cobuyer").value
    const productImg = document.getElementById("productImg").value
    const newProduct = {
        product_image: "",
        product_name: name,
        product_price: parseInt(price),
        current_price: Math.floor(parseInt(price)/2),
        cobuyers_total: parseInt(expectedCouyers),
        hostId: 1,
        host_code: Math.random().toString(36).slice(-3),
        actual_cobuyers: 1
    }

    if (productImg){
        uploadFile(productImg, newProduct)
    } else {
        newProduct.product_image = "https://az870929.vo.msecnd.net/cdn/media/data/default/product-large.ashx"
        addProductToServer(newProduct)
    }

    getProductsFromServer()

}

function updateCobuyersAndPrice(productID){
    handleJoinBuying(productID)
    products[productID].actual_cobuyers += 1
    products[productID].current_price = Math.round(products[productID].product_price/(1+products[productID].actual_cobuyers),2)
    //how to refresh and redisplay the products
    displayProducts()
}

const productImgFrame = document.getElementsByClassName("product-image")[0]
const productImgInput = document.getElementById("productImgInput")
const productImg = document.getElementById("productImg")
const browseButton = document.getElementById("inputButton")

productImgInput.addEventListener("change", handleImage, false)

function handleImage(){
    const image = this.files[0]
    uploadFile(image)
    let reader = new FileReader();

    reader.onload = function (e){
        productImg.src = e.target.result
        
    }

    reader.readAsDataURL(image)

    productImg.style.display = 'block'
    browseButton.style.display = 'none'
    productImgFrame.style.border = 'none'
}

function handleJoinBuying(i){
    //you need to pay this amount
    let money = document.getElementsByClassName("money")[0]
    money.innerHTML = parseInt(money.innerHTML) - products[i].current_price
    //reimburse for existing cobuyers an amount = price/cur_cobuyers - price/(cur_cobuyers + 1)
}



function addProductToServer(newProduct){
    console.log('new product', newProduct)
    let url = `${API_URL}/product`
    let xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onreadystatechange = function (e){
        if (xhr.readyState == 4 && xhr.status == 200){
            let response = JSON.parse(xhr.responseText);
            getProductsFromServer()
        }
    }
    xhr.send(JSON.stringify(newProduct)) 
}


function getProductsFromServer(){
    let url =  `${API_URL}/product`
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.onreadystatechange = function (e){
        if (xhr.readyState == 4 && xhr.status == 200){
            let response = JSON.parse(xhr.responseText);
            console.log('products', response)
            displayProducts(response)
        }
    
    }
    xhr.send()
}

