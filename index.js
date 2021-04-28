const API_URL = 'http://localhost:4001'

const products = [
    {
        uid: Date.now(),
        product_image: "https://az870929.vo.msecnd.net/cdn/media/data/default/product-large.ashx",
        product_name: "abc",
        product_price: 22,
        current_price: 11,
        cobuyers_num: 2,
        actual_cobuyers: 1
    }
]

const productContainer = document.getElementById("products")
const newProduct = document.getElementById("newProduct")
const walletBudget = document.getElementsByClassName("money")[0]
const howItWorks = document.getElementsByClassName("how-it-works")[0]

let actualCobuyers = 1

function displayProducts(){
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
        minPrice.innerHTML = Math.floor(products[i].product_price/products[i].cobuyers_num)
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

function uploadFile(file){
    console.log('file', file)
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
            products[products.length - 1].product_image = url;
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
        uid: Date.now(),
        product_image: "",
        product_name: name,
        product_price: parseInt(price),
        current_price: Math.floor(parseInt(price)/2),
        cobuyers_num: parseInt(expectedCouyers),
        group_code: Math.random().toString(36).slice(-4),
        host_code: Math.random().toString(36).slice(-3),
        actual_cobuyers: 1
    }

    //add product
    products.push(newProduct)

    if (productImg){
        uploadFile(productImg)
    } else {
        products[products.length - 1].product_image = "https://az870929.vo.msecnd.net/cdn/media/data/default/product-large.ashx"
    }

    displayProducts()
    

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
    

    //questions: who will hold this contributing money till the date to buy stuff
    //what's the motivation to pay first (to make the price cheaper?), the one who pays first should be paying less
    //$30: 1st per
    //$15: 2nd per, -15 for 1st per
    //$10: 3rd per, -5 for 1st per -5 for 2nd per
    //$7.5: 4th per, -2.5 for 1st per, -2.5 for 2nd per, -2.5 for 3rd per
    //there is also max cobuyers they can set so that they don't have to pay too much, once max-cobuyer is met or min-pay is met or expiration date or everyone decided to buy, 
    //the one who initiated will buy and share the thing to the group, how to ensure he will buy and share? also he does not collect money, how about we collect money and buy then distribute to them
    //but then they need to trust us? and how are we going to distribute the good to each of them
}


//100, 3 cobuyers >> total 4 >> 25 each ideally

//min: 25, max: 50
//host pays $100
//1st buy: pay $50, all got reimbursed price/cur_cobuyers - price/(cur_cobuyers + 1)
//min: 25, max: 33
//2nd buy: pay $33, all got reimbursed price/cur_cobuyers - price/(cur_cobuyers + 1)
//min: 0, max: 25
//3rd buy: pay $25, all got reimbursed price/cur_cobuyers - price/(cur_cobuyers + 1) 




//coins assemble
//what happens if they have enough money? who is owning all money at that time and who is going to buy

//who will buy: give them one time access into the fund? how do we make sure it's an agreement of all cobuyers (each contribute a part of the code, the code is combined of group code and individual code, after a certain time if the code is not decoded, money will be returned to each of them? do we take care of whether they actually share using it after buying?
// const password = 'abc123'
// const rounds = 10
// bcrypt.hash(password, rounds, (err, hash) => {
//     if (err){
//         console.error(err)
//         return 
//     }
//     console.log(hash)
// })


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
            console.log('response in post', response)
        }
        console.log(xhr.responseText)
    }
    xhr.send(JSON.stringify(newProduct)) 
    xhr.send(newProduct)
}

addProductToServer({
    product_name: 'CANON 4 camera',
	product_image: '',
	product_price: 123,
	current_price: 62,
	cobuyers_total: 2,
	actual_cobuyers: 1,
	host_code: 'CD',
	hostId: 1
})


function getProductsFromServer(){

}