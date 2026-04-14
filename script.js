// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有商品卡片
    const productCards = document.querySelectorAll('.product-card');
    // 获取购物车数量元素
    const cartCount = document.querySelector('.cart-count');
    // 购物车总数
    let totalItems = 0;

    // 为每个商品卡片添加点击事件
    productCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // 阻止事件冒泡，避免点击按钮时也触发卡片点击事件
            if (e.target.closest('.quantity-control') || e.target.closest('.add-to-cart-btn')) {
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
            totalItems += quantity;
            cartCount.textContent = totalItems;
            // 弹出成功提示
            const productName = card.dataset.name;
            alert(`已将 ${quantity} 个 ${productName} 加入购物车`);
        });
    });
});