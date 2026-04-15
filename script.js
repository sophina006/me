// 购物车数据
let cart = [];

// 移动端菜单切换
function toggleMenu() {
    const categoryList = document.getElementById('categoryList');
    categoryList.classList.toggle('active');
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 分类展开/折叠功能
    const categoryToggles = document.querySelectorAll('.category-toggle');
    categoryToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.toggle('active');
            const subcategory = this.nextElementSibling;
            subcategory.classList.toggle('show');
        });
    });
    
    // 获取所有商品卡片
    const productCards = document.querySelectorAll('.product-card');
    // 获取购物车数量元素
    const cartCount = document.querySelector('.cart-count');

    // 为每个商品卡片添加点击事件
    productCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // 阻止事件冒泡，避免点击按钮时也触发卡片点击事件
            if (e.target.closest('.quantity-control') || e.target.closest('.add-to-cart-btn') || e.target.closest('.buy-btn') || e.target.closest('.favorite-btn')) {
                return;
            }
            // 获取商品名称
            const productName = this.dataset.name;
            // 弹出商品名称
            alert(`您点击了: ${productName}`);
        });

        // 获取当前卡片的数量控制元素
        const decreaseBtn = card.querySelector('.decrease-btn');
        const increaseBtn = card.querySelector('.increase-btn');
        const quantityElement = card.querySelector('.quantity');
        const addToCartBtn = card.querySelector('.add-to-cart-btn');
        const buyBtn = card.querySelector('.buy-btn');
        const favoriteBtn = card.querySelector('.favorite-btn');

        // 初始数量
        let quantity = 1;

        // 减少数量按钮点击事件
        decreaseBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            if (quantity > 1) {
                quantity--;
                quantityElement.textContent = quantity;
            }
        });

        // 增加数量按钮点击事件
        increaseBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            quantity++;
            quantityElement.textContent = quantity;
        });

        // 加入购物车按钮点击事件
        addToCartBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            const productName = card.dataset.name;
            const price = parseFloat(card.querySelector('.product-price').textContent.replace('¥', ''));
            const image = card.querySelector('.product-image img').src;
            
            // 检查商品是否已在购物车中
            const existingItem = cart.find(item => item.name === productName);
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({
                    name: productName,
                    price: price,
                    quantity: quantity,
                    image: image
                });
            }
            
            updateCartCount();
            updateCartUI();
        });

        // 购买按钮点击事件
        buyBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            const productName = card.dataset.name;
            const price = parseFloat(card.querySelector('.product-price').textContent.replace('¥', ''));
            const image = card.querySelector('.product-image img').src;
            
            // 清空购物车并添加当前商品
            cart = [{
                name: productName,
                price: price,
                quantity: quantity,
                image: image
            }];
            
            updateCartCount();
            updateCartUI();
            openCart();
        });

        // 收藏按钮点击事件
        favoriteBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            this.classList.toggle('active');
            const toast = this.nextElementSibling;
            
            // 显示收藏提示
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 1000);
        });
    });

    // 购物车侧边栏功能
    setupCartSidebar();

    // 初始化购物车
    updateCartCount();
    updateCartUI();
});

// 购物车侧边栏功能
function setupCartSidebar() {
    // 打开购物车
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', openCart);
    }
    
    // 关闭购物车
    const closeCartBtn = document.querySelector('.close-cart');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }
    
    // 点击遮罩层关闭购物车
    const overlay = document.querySelector('.overlay');
    if (overlay) {
        overlay.addEventListener('click', closeCart);
    }
}

// 打开购物车
function openCart() {
    document.querySelector('.cart-sidebar').classList.add('open');
    document.querySelector('.overlay').classList.add('show');
}

// 关闭购物车
function closeCart() {
    document.querySelector('.cart-sidebar').classList.remove('open');
    document.querySelector('.overlay').classList.remove('show');
}

// 更新购物车数量
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = cartCount;
        cartCountElement.style.display = cartCount > 0 ? 'flex' : 'none';
    }
}

// 更新购物车UI
function updateCartUI() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalPriceElement = document.querySelector('.total-price');
    
    if (!cartItemsContainer || !totalPriceElement) return;
    
    // 清空购物车
    cartItemsContainer.innerHTML = '';
    
    // 计算总价格
    let totalPrice = 0;
    
    // 添加商品到购物车
    cart.forEach(item => {
        totalPrice += item.price * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">¥${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="cart-decrease" data-name="${item.name}">-</button>
                    <span>${item.quantity}</span>
                    <button class="cart-increase" data-name="${item.name}">+</button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    // 更新总价格
    totalPriceElement.textContent = `¥${totalPrice.toFixed(2)}`;
    
    // 添加购物车数量控制
    setupCartQuantityControls();
}

// 购物车数量控制
function setupCartQuantityControls() {
    // 减少数量
    document.querySelectorAll('.cart-decrease').forEach(btn => {
        btn.addEventListener('click', function() {
            const productName = this.getAttribute('data-name');
            const item = cart.find(item => item.name === productName);
            
            if (item) {
                if (item.quantity > 1) {
                    item.quantity--;
                } else {
                    // 从购物车中移除
                    cart = cart.filter(cartItem => cartItem.name !== productName);
                }
                
                updateCartCount();
                updateCartUI();
            }
        });
    });
    
    // 增加数量
    document.querySelectorAll('.cart-increase').forEach(btn => {
        btn.addEventListener('click', function() {
            const productName = this.getAttribute('data-name');
            const item = cart.find(item => item.name === productName);
            
            if (item) {
                item.quantity++;
                updateCartCount();
                updateCartUI();
            }
        });
    });
}