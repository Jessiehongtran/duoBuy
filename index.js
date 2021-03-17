const products = [
    {
        uid: Date.now(),
        product_image: "",
        product_name: "abc",
        product_price: 22,
        cobuyers_num: 2,
        actual_cobuyers: 0
    }
]

const productContainer = document.getElementById("products")
const newProduct = document.getElementById("newProduct")


let actualCobuyers = 1

function displayProducts(product){
    products.push(product)
    newProduct.style.display = 'none'
    console.log(productContainer)

    //should not add more DOMS but only display them
    for (let i = 0; i < products.length; i++){
        const eachProduct = document.createElement("div")
        const img = document.createElement("img")
        const name = document.createElement("div")
        const price = document.createElement("div")
        const joinBuyButton = document.createElement("button")
        joinBuyButton.innerHTML = "Join buying"
        joinBuyButton.setAttribute('onclick', `increaseCoBuyers(${i})`)
        img.src = products[i].product_image
        name.innerHTML = products[i].product_name
        price.innerHTML = "$" + products[i].product_price
        eachProduct.appendChild(img)
        eachProduct.appendChild(name)
        eachProduct.appendChild(price)
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
            let tokens = url.split('/');
            tokens.splice(-2, 0, 'w_150,c_scale');
            let img = new Image(); //HTML5 Constructor
            img.src = tokens.join('/');
            img.alt = response.public_id;
            console.log('img', img)
        }
    }
    fd.append('upload_preset', unsignedUploadPreset);
    fd.append('tags', 'browser_upload'); // Optional - add tag for image admin in Cloudinary
    fd.append('file', file);
    xhr.send(fd);
}



function updatePrice(){
    const name = document.getElementById("productName").value
    const price = document.getElementById("price").value
    const expectedCouyers = document.getElementById("cobuyer").value
    const productImg = document.getElementById("productImg").value
    uploadFile(productImg)

    //add product
    const newProduct = {
        uid: Date.now(),
        product_image: "",
        product_name: name,
        product_price: parseInt(price),
        cobuyers_num: parseInt(expectedCouyers)
    }
    displayProducts(newProduct)
    
    //what is the proper formula?
    //way1: price = (price - price/expectedCobuyers*actualCobuyers)

    //way2: at first it's $30, if another person jump in, it's $15, 

}

function increaseCoBuyers(productID){
    products[productID].actual_cobuyers += 1
    products[productID].product_price = products[productID].product_price - products[productID].product_price/products[productID].cobuyers_num*(1+products[productID].actual_cobuyers)
    //how to refresh and redisplay the products
}

const productImgInput = document.getElementById("productImgInput")
const productImg = document.getElementById("productImg")
productImgInput.addEventListener("change", handleImage, false)

function handleImage(){
    const image = this.files[0]
    let reader = new FileReader();

    reader.onload = function (e){
        productImg.src = e.target.result
        productImg.style.display = 'block'
    }

    reader.readAsDataURL(image)
    productImgInput.style.display = 'none'
}
