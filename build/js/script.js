(function () {
  // Cart

  const porductsBtn = document.querySelectorAll('.products__button');
  const productsList = document.querySelector('.cart-order__list');
  const cart = document.querySelector('.cart-order');
  const fullPrice = document.querySelector('.cart-order__price span');
  const cartTotal = document.querySelector('.inform__wrap--cart');
  const orderBtn = document.querySelector('.cart-order__button');
  const sendProduct = document.querySelector('.send-product');

  let price = 0;

  // проверка на наличие товаров в корзине
  const checkProduct = () => {
    if (productsList.children.length <= 0) {
      orderBtn.disabled = true;
      orderBtn.style.opacity = 0.3;
    } else {
      orderBtn.disabled = false;
      orderBtn.style.opacity = 1;
    }
  }

  const priceWithoutSpaces = (str) => {
    return str.replace(/\s/g, '');
  };

  const normalPrice = (str) => {
    return String(str).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
  };

  const plusFullPrice = (currentPrice) => {
    return price += currentPrice;
  };

  const minusFullPrice = (currentPrice) => {
    price -= currentPrice;
    return price;
  };

  const printFullPrice = () => {
    fullPrice.textContent = `${normalPrice(price)} ₽`
  };

  const printTotalPrice = () => {
    let length = productsList.children.length;
    cartTotal.innerHTML = `
    ${normalPrice(price)} ₽
    <span>${length} товаров</span>
    `
  }

  const generateCartProduct = (img, title, price, id) => {
    return `
      <li class="cart-order__item">
          <article class="cart-card" data-id="${id}">
            <img src="${img}" alt="Яблочный крамбл" width="245" height="190">
            <div class="cart-card__text">
              <h3 class="cart-card__title">${title}</h3>
              <span class="cart-card__price">${price}</span>
            </div>
            <button class="cart-card__delete button" aria-label="Удалить товар" type="button">
              <svg width="31" height="35" viewBox="0 0 31 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                <use xlink:href="img/sprite.svg#basket"></use>
              </svg>
            </button>
          </article>
      </li>
    `;
  };

  // создать пустой массив
  let goods = [];

  // получаем данные из LS
  const getCartData = () => {
    return JSON.parse(localStorage.getItem('goods'));
  }

  // записываем данные в LS
  const setCartData = (o) => {
    localStorage.setItem('goods', JSON.stringify(o));
    return false;
  }

  console.log("jy", localStorage.getItem('goods'));

  // проверить наличие данных в LS
  if (localStorage.getItem('goods')) {

    // получить данные из LS
    let cartData = getCartData();

    // добавляем данные в LS
    for (let i = 0; i <= cartData.length - 1; i++) {
      goods.push(cartData[i])
    }

    // отрисовываем корзину
    goods.forEach(e => {
      productsList.insertAdjacentHTML('afterbegin', generateCartProduct(e.productsImg, e.productsName, e.productsPrice, e.productsID));
      let currentPrice = parseInt(priceWithoutSpaces(e.productsPrice));
      plusFullPrice(currentPrice);
      printFullPrice();
      printTotalPrice();
    });
  }

  porductsBtn.forEach(el => {
    el.addEventListener('click', (e) => {
      let self = e.currentTarget;
      let parent = self.closest('.products__card');
      let id = parent.dataset.id;
      let img = parent.querySelector('img').getAttribute('src');
      let title = parent.querySelector('.products__description h2').textContent;
      let price = parent.querySelector('.products__price p').textContent;
      let currentPrice = parseInt(priceWithoutSpaces(parent.querySelector('.products__price p').textContent));

      // добавили карточку в массив
      goods.push({
        productsID: id,
        productsImg: img,
        productsName: title,
        productsPrice: price
      });

      // добавить маассив в LS
      setCartData(goods);

      plusFullPrice(currentPrice);
      printFullPrice();
      productsList.insertAdjacentHTML('afterbegin', generateCartProduct(img, title, price, id));
      printTotalPrice();

      sendProduct.classList.remove('visually-hidden');

      setTimeout(() => {
        sendProduct.classList.add('visually-hidden');
      }, 2000);
    })
  });

  const deleteProducts = (el) => {
    let id = el.querySelector('.cart-card').dataset.id;

    for (let i = 0; i < goods.length; i++) {
      let indexOb = goods[i];

      if (indexOb.productsID === id) {
        goods.splice(i, 1);
      }
    }

    setCartData(goods);
    let currentPrice = parseInt(priceWithoutSpaces(el.querySelector('.cart-card__price').textContent));
    minusFullPrice(currentPrice);
    printFullPrice();
    el.remove();
    printTotalPrice();
  }

  productsList.addEventListener('click', (e) => {
    if (e.target.classList.contains('cart-card__delete')) {
      deleteProducts(e.target.closest('.cart-order__item'))
    }
    checkProduct();
  });

  orderBtn.addEventListener('click', (e) => {
    e.preventDefault();

    cart.classList.add('visually-hidden');
    customerModal.classList.remove('visually-hidden');
  })

  // Swiper

  const swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    slidesPerGroup: 1,
    simulateTouch: false,

    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  // Modal window

  const body = document.querySelector('body');
  const modal = document.querySelector('.modal');
  const closeModalButton = modal.querySelectorAll('.modal__close');
  const openCart = document.querySelector('.inform__link--cart');
  const openDrinks = document.querySelectorAll('.drinks-link');
  const customerModal = document.querySelector('.customer-form');
  const drinksModal = document.querySelector('.drinks');
  const feedbackForm = document.querySelector('.customer-form__field')
  const sendForm = document.querySelector('.send-form');


  function existVerticalScroll() {
    return document.body.offsetHeight > window.innerHeight
  };

  function getBodyScrollTop() {
    return self.pageYOffset || (document.documentElement && document.documentElement.ScrollTop) || (document.body && document.body.scrollTop);
  };

  const checkClass = (i) => {
    if (!i.classList.contains('visually-hidden')) {
      i.classList.add('visually-hidden');
    }
  }

  openCart.addEventListener('click', e => {
    e.preventDefault();

    checkProduct();
    body.dataset.scrollY = getBodyScrollTop();

    modal.classList.remove('visually-hidden');
    cart.classList.remove('visually-hidden');

    if (existVerticalScroll()) {
      body.classList.add('body-lock')
      body.style.top = `-${body.dataset.scrollY}px`
    };
  })

  openDrinks.forEach((el) => {
    el.addEventListener('click', e => {
      e.preventDefault();

      body.dataset.scrollY = getBodyScrollTop();

      modal.classList.remove('visually-hidden');
      drinksModal.classList.remove('visually-hidden');

      if (existVerticalScroll()) {
        body.classList.add('body-lock')
        body.style.top = `-${body.dataset.scrollY}px`
      };
    })
  })

  console.log(openDrinks);

  closeModalButton.forEach((el) => {
    el.addEventListener('click', e => {
      e.preventDefault();

      checkClass(modal);
      checkClass(cart);
      checkClass(customerModal);
      checkClass(drinksModal);

      if (existVerticalScroll()) {
        body.classList.remove('body-lock')
        window.scrollTo(0, body.dataset.scrollY)
      };
    })
  })

  document.addEventListener('keydown', (evt) => {
    if (evt.keyCode === 27) {
      if (!modal.classList.contains('visually-hidden')) {
        checkClass(modal);
        checkClass(cart);
        checkClass(customerModal);
        checkClass(drinksModal);
      }

      if (existVerticalScroll()) {
        body.classList.remove('body-lock')
        window.scrollTo(0, body.dataset.scrollY)
      }
    };
  });

  modal.addEventListener('click', (evt) => {
    if (evt.target === modal) {
      checkClass(modal);
      checkClass(cart);
      checkClass(customerModal);
      checkClass(drinksModal);
    }

    if (existVerticalScroll()) {
      body.classList.remove('body-lock')
      window.scrollTo(0, body.dataset.scrollY)
    };
  });

  async function sendData(a) {

    try {
      const response = await fetch('https://belkatesto.ru/send.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.parse(a) // данные могут быть 'строкой' или {объектом}!
      });
      const json = await response.json();
      console.log('Успех:', JSON.stringify(json));
    } catch (error) {
      console.error('Ошибка:', error);
    }
  }


  feedbackForm.addEventListener('submit', () => {
    // e.preventDefault();
    let list = [];

    const name = document.querySelector('#name');
    const telephone = document.querySelector('#telephone');

    customerModal.classList.add('visually-hidden');
    sendForm.classList.remove('visually-hidden');



    for (let i = 0; i <= goods.length - 1; i++) {
      let card = goods[i];

      let product = {
        "Type": card.productsID,
        "Price": card.productsPrice,
      }

      list.push(product);
    }

    const finalList = Object.assign({}, list);
    const repl = JSON.stringify(finalList);

    // setTimeout(() => {
    //   var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance
    //   xmlhttp.open("POST", "/send.php");
    //   xmlhttp.setRequestHeader("Content-Type", "application/json");
    //   xmlhttp.send(JSON.stringify(repl));
    // }, 100);

    sendData(repl);

    price = 0;
    productsList.innerHTML = '';
    printTotalPrice();
    printFullPrice()

    setTimeout(() => {
      name.value = '';
      telephone.value = '';
      localStorage.clear();
      modal.classList.add('visually-hidden');
      sendForm.classList.add('visually-hidden');
    }, 5000);
  });

  // Form validation

  window.addEventListener("DOMContentLoaded", function () {

    function setCursorPosition(pos, elem) {
      elem.focus();
      if (elem.setSelectionRange) elem.setSelectionRange(pos, pos);
      else if (elem.createTextRange) {
        var range = elem.createTextRange();
        range.collapse(true);
        range.moveEnd("character", pos);
        range.moveStart("character", pos);
        range.select()
      }
    };

    function mask(event) {
      var matrix = "+7 (___) ___ ____",
        i = 0,
        def = matrix.replace(/\D/g, ""),
        val = this.value.replace(/\D/g, "");

      if (val.length < 10) {
        this.setCustomValidity('Номер введен не полностью');
      } else {
        this.setCustomValidity('');
      }

      if (def.length >= val.length) val = def;
      this.value = matrix.replace(/./g, function (a) {
        return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? "" : a
      });

      if (event.type == "blur") {
        if (this.value.length == 2) this.value = ""
      } else setCursorPosition(this.value.length, this)
    };

    const fields = document.querySelectorAll('input[type="tel"]');
    fields.forEach((input) => {
      input.addEventListener("input", mask, false);
      input.addEventListener("focus", mask, false);
      input.addEventListener("blur", mask, false);
    });
  });
})();
