class MercadinhoDigital {
  constructor() {
    this.products = []
    this.cart = this.loadCart()
    this.currentUser = this.getCurrentUser()
    this.users = this.loadUsers()
    this.init()
  }

  init() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html"

    switch (currentPage) {
      case "index.html":
      case "":
        this.initLogin()
        break
      case "register.html":
        this.initRegister()
        break
      case "catalog.html":
        this.checkAuth()
        this.initCatalog()
        break
      case "cart.html":
        this.checkAuth()
        this.initCart()
        break
      case "checkout.html":
        this.checkAuth()
        this.initCheckout()
        break
    }
  }

  checkAuth() {
    if (!this.currentUser) {
      window.location.href = "index.html"
    }
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser"))
  }

  loadUsers() {
    const users = localStorage.getItem("users")
    return users ? JSON.parse(users) : []
  }

  saveUsers() {
    localStorage.setItem("users", JSON.stringify(this.users))
  }

  initLogin() {
    const loginForm = document.getElementById("loginForm")
    const loginError = document.getElementById("loginError")

    if (this.currentUser) {
      window.location.href = "catalog.html"
      return
    }

    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault()

        const email = document.getElementById("email").value.trim()
        const password = document.getElementById("password").value.trim()

        if (!email || !password) {
          this.showErrorMessage("Por favor, preencha todos os campos.")
          return
        }

        const user = this.users.find((u) => u.email === email && u.password === password)

        if (user) {
          localStorage.setItem("currentUser", JSON.stringify(user))
          this.showSuccessMessage("Login realizado com sucesso! Redirecionando...")

          setTimeout(() => {
            window.location.href = "catalog.html"
          }, 1500)
        } else {
          this.showErrorMessage("Email ou senha incorretos. Verifique suas credenciais.")
          if (loginError) {
            loginError.textContent = "Email ou senha incorretos."
          }
        }
      })
    }
  }

  initRegister() {
    const registerForm = document.getElementById("registerForm")
    const registerError = document.getElementById("registerError")

    if (this.currentUser) {
      window.location.href = "catalog.html"
      return
    }

    if (registerForm) {
      registerForm.addEventListener("submit", (e) => {
        e.preventDefault()

        const fullName = document.getElementById("fullName").value.trim()
        const email = document.getElementById("email").value.trim()
        const phone = document.getElementById("phone").value.trim()
        const password = document.getElementById("password").value.trim()
        const confirmPassword = document.getElementById("confirmPassword").value.trim()

        if (registerError) registerError.textContent = ""

        if (!fullName || !email || !phone || !password || !confirmPassword) {
          this.showErrorMessage("Por favor, preencha todos os campos.")
          if (registerError) registerError.textContent = "Por favor, preencha todos os campos."
          return
        }

        if (password !== confirmPassword) {
          this.showErrorMessage("As senhas não coincidem.")
          if (registerError) registerError.textContent = "As senhas não coincidem."
          return
        }

        if (password.length < 6) {
          this.showErrorMessage("A senha deve ter pelo menos 6 caracteres.")
          if (registerError) registerError.textContent = "A senha deve ter pelo menos 6 caracteres."
          return
        }

        const existingUser = this.users.find((u) => u.email === email)
        if (existingUser) {
          this.showErrorMessage("Este email já está cadastrado.")
          if (registerError) registerError.textContent = "Este email já está cadastrado."
          return
        }

        const newUser = {
          id: Date.now(),
          fullName,
          email,
          phone,
          password,
          createdAt: new Date().toISOString(),
        }

        this.users.push(newUser)
        this.saveUsers()

        this.showSuccessMessage("Conta criada com sucesso! Redirecionando para o login...")

        setTimeout(() => {
          window.location.href = "index.html"
        }, 2000)
      })
    }
  }

  showSuccessMessage(text) {
    const message = document.createElement("div")
    message.textContent = text
    message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #16a34a;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            font-weight: bold;
            max-width: 300px;
            font-size: 14px;
            line-height: 1.4;
        `

    document.body.appendChild(message)

    setTimeout(() => {
      if (document.body.contains(message)) {
        document.body.removeChild(message)
      }
    }, 3000)
  }

  showErrorMessage(text) {
    const message = document.createElement("div")
    message.textContent = text
    message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #dc2626;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            font-weight: bold;
            max-width: 300px;
            font-size: 14px;
            line-height: 1.4;
        `

    document.body.appendChild(message)

    setTimeout(() => {
      if (document.body.contains(message)) {
        document.body.removeChild(message)
      }
    }, 4000)
  }

  async initCatalog() {
    this.setupHeader()
    this.displayUserName()
    await this.loadProducts()
    this.displayProducts()
    this.updateCartCount()
  }

  displayUserName() {
    const userName = document.getElementById("userName")
    if (userName && this.currentUser) {
      userName.textContent = this.currentUser.fullName.split(" ")[0]
    }
  }

  setupHeader() {
    const cartBtn = document.getElementById("cartBtn")
    const logoutBtn = document.getElementById("logoutBtn")

    if (cartBtn) {
      cartBtn.addEventListener("click", () => {
        window.location.href = "cart.html"
      })
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        this.logout()
      })
    }

    const backToCatalog = document.getElementById("backToCatalog")
    if (backToCatalog) {
      backToCatalog.addEventListener("click", () => {
        window.location.href = "catalog.html"
      })
    }

    const backToCart = document.getElementById("backToCart")
    if (backToCart) {
      backToCart.addEventListener("click", () => {
        window.location.href = "cart.html"
      })
    }

    this.displayUserName()
  }

  logout() {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("cart")
    window.location.href = "index.html"
  }

  async loadProducts() {
    const loading = document.getElementById("loading")
    try {
      const response = await fetch("https://fakestoreapi.com/products")
      this.products = await response.json()
      if (loading) loading.style.display = "none"
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
      if (loading) loading.textContent = "Erro ao carregar produtos. Tente novamente."
    }
  }

  displayProducts() {
    const productsGrid = document.getElementById("productsGrid")
    if (!productsGrid) return

    productsGrid.innerHTML = ""

    this.products.forEach((product) => {
      const productCard = document.createElement("div")
      productCard.className = "product-card"
      productCard.innerHTML = `
                <img src="${product.image}" alt="${product.title}" class="product-image">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">R$ ${product.price.toFixed(2).replace(".", ",")}</div>
                <button class="add-to-cart" onclick="mercadinho.addToCart(${product.id})">
                    Adicionar ao Carrinho
                </button>
            `
      productsGrid.appendChild(productCard)
    })
  }

  addToCart(productId) {
    const product = this.products.find((p) => p.id === productId)
    if (!product) return

    const existingItem = this.cart.find((item) => item.id === productId)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      this.cart.push({
        ...product,
        quantity: 1,
      })
    }

    this.saveCart()
    this.updateCartCount()
    this.showAddedToCartMessage()
  }

  showAddedToCartMessage() {
    const message = document.createElement("div")
    message.textContent = "Produto adicionado ao carrinho!"
    message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #16a34a;
            color: white;
            padding: 1rem;
            border-radius: 5px;
            z-index: 1000;
            font-weight: bold;
        `
    document.body.appendChild(message)

    setTimeout(() => {
      if (document.body.contains(message)) {
        document.body.removeChild(message)
      }
    }, 2000)
  }

  updateCartCount() {
    const cartCount = document.getElementById("cartCount")
    if (cartCount) {
      const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0)
      cartCount.textContent = totalItems
    }
  }

  initCart() {
    this.setupHeader()
    this.displayCartItems()
    this.setupCartActions()
  }

  displayCartItems() {
    const cartItems = document.getElementById("cartItems")
    const cartTotal = document.getElementById("cartTotal")

    if (!cartItems) return

    if (this.cart.length === 0) {
      cartItems.innerHTML = '<div class="empty-cart">Seu carrinho está vazio</div>'
      if (cartTotal) cartTotal.textContent = "0,00"
      return
    }

    cartItems.innerHTML = ""
    let total = 0

    this.cart.forEach((item) => {
      const cartItem = document.createElement("div")
      cartItem.className = "cart-item"
      cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">R$ ${item.price.toFixed(2).replace(".", ",")}</div>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="mercadinho.updateQuantity(${item.id}, -1)">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="mercadinho.updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-item" onclick="mercadinho.removeFromCart(${item.id})">Remover</button>
                </div>
            `
      cartItems.appendChild(cartItem)
      total += item.price * item.quantity
    })

    if (cartTotal) {
      cartTotal.textContent = total.toFixed(2).replace(".", ",")
    }
  }

  updateQuantity(productId, change) {
    const item = this.cart.find((item) => item.id === productId)
    if (!item) return

    item.quantity += change

    if (item.quantity <= 0) {
      this.removeFromCart(productId)
    } else {
      this.saveCart()
      this.displayCartItems()
    }
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter((item) => item.id !== productId)
    this.saveCart()
    this.displayCartItems()
  }

  setupCartActions() {
    const clearCart = document.getElementById("clearCart")
    const checkoutBtn = document.getElementById("checkoutBtn")

    if (clearCart) {
      clearCart.addEventListener("click", () => {
        if (confirm("Tem certeza que deseja limpar o carrinho?")) {
          this.cart = []
          this.saveCart()
          this.displayCartItems()
        }
      })
    }

    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        if (this.cart.length === 0) {
          alert("Seu carrinho está vazio!")
          return
        }
        window.location.href = "checkout.html"
      })
    }
  }

  initCheckout() {
    this.setupHeader()
    this.displayOrderSummary()
    this.setupCheckoutForm()
    this.prefillUserData()
  }

  prefillUserData() {
    if (this.currentUser) {
      const fullNameInput = document.getElementById("fullName")
      if (fullNameInput) {
        fullNameInput.value = this.currentUser.fullName
      }
    }
  }

  displayOrderSummary() {
    const orderItems = document.getElementById("orderItems")
    const orderTotal = document.getElementById("orderTotal")

    if (!orderItems) return

    let total = 0
    orderItems.innerHTML = ""

    this.cart.forEach((item) => {
      const orderItem = document.createElement("div")
      orderItem.className = "order-item"
      orderItem.innerHTML = `
                <span>${item.title} (${item.quantity}x)</span>
                <span>R$ ${(item.price * item.quantity).toFixed(2).replace(".", ",")}</span>
            `
      orderItems.appendChild(orderItem)
      total += item.price * item.quantity
    })

    if (orderTotal) {
      orderTotal.textContent = total.toFixed(2).replace(".", ",")
    }
  }

  setupCheckoutForm() {
    const checkoutForm = document.getElementById("checkoutForm")

    if (checkoutForm) {
      checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault()
        this.processOrder()
      })
    }
  }

  processOrder() {
    const formData = new FormData(document.getElementById("checkoutForm"))
    const orderData = {
      orderId: Date.now(),
      customer: {
        name: formData.get("fullName"),
        address: formData.get("address"),
        city: formData.get("city"),
        zipCode: formData.get("zipCode"),
        email: this.currentUser.email,
        phone: this.currentUser.phone,
      },
      payment: formData.get("payment"),
      items: this.cart,
      total: this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      date: new Date().toISOString(),
    }

    const userOrders = JSON.parse(localStorage.getItem("userOrders") || "[]")
    userOrders.push(orderData)
    localStorage.setItem("userOrders", JSON.stringify(userOrders))

    this.cart = []
    this.saveCart()

    alert(
      `Pedido #${orderData.orderId} confirmado com sucesso! Obrigado pela sua compra, ${this.currentUser.fullName}!`,
    )
    window.location.href = "catalog.html"
  }

  loadCart() {
    const savedCart = localStorage.getItem("cart")
    return savedCart ? JSON.parse(savedCart) : []
  }

  saveCart() {
    localStorage.setItem("cart", JSON.stringify(this.cart))
  }
}

const mercadinho = new MercadinhoDigital()
