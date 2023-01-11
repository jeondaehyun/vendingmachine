let currentCash = 0;
const exchangeRate = 1800;
let wonClicked = 0;
let dollarClicked = 0;
const items = document.getElementsByClassName("item");
const price = document.getElementsByClassName("price");
const buttons = document.querySelectorAll(".btn_money button");
const btnReturns = document.querySelectorAll(".btn_return");

const modals = document.getElementsByClassName("modal");
const albumImgs = document.getElementsByClassName("display_img");
const modalCloseBtns = document.getElementsByClassName("close");

document.addEventListener("DOMContentLoaded", function () {
    function handleCash() {
        const queryID = this.id;
        if (queryID.indexOf('cent') !== -1 || queryID.indexOf('dollar') !== -1) {
            if (wonClicked === 1) {
                alert("dollar 를 넣을 수 없습니다. 원 단위 돈을 넣어주세요.");
                return;
            }
            dollarClicked = 1;
            updateCash(this.value);
        } else {
            if (dollarClicked === 1) {
                alert("원 단위를 넣을 수 없습니다. dollar를 넣어주세요.");
                return;
            }
            wonClicked = 1;
            updateCash(this.value);
        }
        changeActive();
    }

    function updateCash(val) {
        currentCash += parseFloat(val);
        if (wonClicked === 1) {
            document.getElementById("moneycount").value = currentCash;
            document.getElementById("dollarmoneycount").value = Math.floor(currentCash / exchangeRate * 100) / 100;
        } else {
            document.getElementById("dollarmoneycount").value = Math.floor(currentCash * 100) / 100;
            document.getElementById("moneycount").value = Math.floor(currentCash * exchangeRate * 100) / 100;
        }
    }

    function changeActive() {
        let newCash = currentCash;
        if (dollarClicked == 1) {
            newCash = newCash * exchangeRate;
        }

        for (let i = 0; i < price.length; i++) {
            let currentPrice = parseInt(price[i].textContent);
            if (newCash >= currentPrice) {
                items[i].classList.add("on");
            } else {
                items[i].classList.remove("on");
            }
        }
    }

    function buy() {
        let buyPrice = this.textContent;
        buyPrice = buyPrice.replace("원", "");

        if (dollarClicked === 1) {
            buyPrice = buyPrice / exchangeRate;
        };

        if (currentCash >= buyPrice) {
            alert("구매 완료");
            printPurchaseImage(this.id);
            updateCash(buyPrice * -1);
        } else {
            alert("잔액이 부족합니다. 현금을 넣어주세요.");
        };
        changeActive();
    }

    function restReturn() {
        printReturnValue();
        updateCash(-1 * currentCash);
        changeActive();
        clearImage();
        wonClicked = 0;
        dollarClicked = 0;
    }

    function clearImage() {
        let imagebody = document.getElementById("receiveList");
        while (imagebody.childNodes.length > 2) {
            imagebody.removeChild(imagebody.lastChild);
        }
    }

    function initReturnInfo() {
        let tableBodySet = document.getElementById("table").getElementsByTagName("tbody")[0];
        while (tableBodySet.childNodes.length !== 0) {
            tableBodySet.removeChild(tableBodySet.lastChild);
        }
    }

    function printPurchaseImage(id) {
        let purchaseImageID = id;
        imageList = document.getElementById("receiveList");
        purchaseImageID = purchaseImageID.replace("item", "album");
        let newImage = document.createElement("img");
        newImage.setAttribute("src", "img/" + purchaseImageID + ".png");
        imageList.appendChild(newImage);
    }

    function printReturnValue() {
        let tableBody = document.getElementById("table").getElementsByTagName('tbody')[0];
        let val = Math.floor(currentCash * 100);
        let dividor;
        document.getElementById("returnTotal").innerHTML = Math.floor(currentCash * 100) / 100;
        initReturnInfo();

        let unitType;
        if (wonClicked === 1) {
            unitType = " (원)";
            dividor = new Array(100, 500, 1000, 5000, 10000, 50000);
        } else {
            unitType = " ($)";
            dividor = new Array(0.01, 0.05, 0.10, 0.25, 0.5, 1, 2, 5, 10, 20, 50, 100);
        }

        for (let i = dividor.length - 1; i >= 0; i--) {
            let amount = parseInt(dividor[i] * 100);
            if (parseInt(val / amount) !== 0) {
                const row = document.createElement("tr");
                const d1 = document.createElement("td");
                const d2 = document.createElement("td");

                d1.appendChild(document.createTextNode(dividor[i]));
                d2.appendChild(document.createTextNode(parseInt(val / amount)));
                row.appendChild(d1);
                row.appendChild(d2);
                tableBody.appendChild(row);
                val -= (amount * parseInt(val / amount));
            }
        }
        document.getElementById("totalType").textContent = unitType;
    }

    function Modal(num) {
        albumImgs[num].onclick = function () {
            modals[num].style.display = "block";
        };

        modalCloseBtns[num].onclick = function () {
            modals[num].style.display = "none";
            
        };
    };

    for (var i = 0; i < albumImgs.length; i++) {
        Modal(i);
    }

    window.onclick = function (event) {
        if (event.target.className == "modal") {
            event.target.style.display = "none";
        }
    };

    buttons.forEach((button) => {
        button.addEventListener('click', handleCash, false);
    });

    document.querySelectorAll(".item").forEach((productBtn) => {
        productBtn.addEventListener('click', buy);
    });

    btnReturns.forEach((btnReturn) => {
        btnReturn.addEventListener('click', restReturn, false);
    });



    // swiper
    let ww = window.innerWidth;
    let mySwiper = undefined;

    function initSwiper() {
        if (ww < 680 && mySwiper == undefined) {
            mySwiper = new Swiper(".swiper-container", {
                slidesPerView: 3,
                spaceBetween: 10,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
            });
        } else if (ww >= 680 && mySwiper != undefined) {
            mySwiper.destroy();
            mySwiper = undefined;
        }
    }

    initSwiper();

    window.addEventListener('resize', function () {
        ww = window.innerWidth;
        initSwiper();
    });
    // e swiper

});