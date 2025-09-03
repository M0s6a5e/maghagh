// JavaScript للبانر المتحرك
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dot');
    let currentSlide = 0;
    let slideInterval;
    
    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = (n + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    function startSlideShow() {
        slideInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 5000);
    }
    
    function stopSlideShow() {
        clearInterval(slideInterval);
    }
    
    // بدء العرض التلقائي للشرائح
    startSlideShow();
    
    // إضافة نقاط التنقل
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopSlideShow();
            showSlide(index);
            startSlideShow();
        });
    });
    
    // إيقاف العرض التلقائي عند التمرير فوق البانر
    const slider = document.querySelector('.slider');
    slider.addEventListener('mouseenter', stopSlideShow);
    slider.addEventListener('mouseleave', startSlideShow);
    
    // دعم اللمس للأجهزة المحمولة
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        stopSlideShow();
    });
    
    slider.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startSlideShow();
    });
    
    function handleSwipe() {
        const minSwipeDistance = 50;
        
        if (touchEndX < touchStartX && touchStartX - touchEndX > minSwipeDistance) {
            // سحب لليسار - التالي
            showSlide(currentSlide + 1);
        } 
        
        if (touchEndX > touchStartX && touchEndX - touchStartX > minSwipeDistance) {
            // سحب لليمين - السابق
            showSlide(currentSlide - 1);
        }
    }
});

// فلترة محلات الخصومات
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const discountCards = document.querySelectorAll('.discount-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // إزالة النشاط من جميع الأزرار
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // إضافة النشاط للزر المحدد
            button.classList.add('active');
            
            // الحصول على قيمة الفلتر
            const filterValue = button.getAttribute('data-filter');
            
            // تطبيق الفلتر
            discountCards.forEach(card => {
                if (filterValue === 'all') {
                    card.style.display = 'block';
                } else {
                    if (card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });
});

// نص يتغير كل 3 ثواني في الشعار
document.addEventListener('DOMContentLoaded', function() {
    const texts = [
        "M0S7A5E",
        "ومحلات تهمك",
        "جوايز ومكافاءت اسبوعية",
        "خصومات",
        "قم بالشراء من المحلات فى قسم محلات حديثة واحصل على نقاط",
        "يتم تجميع العروض والمحلات بظام تجميع ذكى ومباشر",
        "يمكنك الان الاجابة عن الاسئلة وربح نقاط لااسترداد هداية"
    ];
    
    let currentIndex = 0;
    const textElement = document.getElementById('changing-text');
    
    // تأكد من وجود العنصر قبل التنفيذ
    if (textElement) {
        function changeText() {
            // إضافة تأثير التغيير
            textElement.classList.remove('text-change');
            void textElement.offsetWidth; // إعادة تشغيل الأنيميشن
            textElement.classList.add('text-change');
            
            // تغيير النص
            textElement.textContent = texts[currentIndex];
            
            // الانتقال إلى النص التالي
            currentIndex = (currentIndex + 1) % texts.length;
        }
        
        // تغيير النص فوراً ثم كل 3 ثواني
        changeText();
        setInterval(changeText, 3000);
    }
});


// بيانات البحث (سيتم البحث في هذه العناصر)
const searchData = {
    discounts: [
        { name: "ضجة", category: "ملابس", type: "محل" },
        { name: "كولكشن فرع مغاغة", category: "ملابس", type: "محل" },
        { name: "ابو النسب", category: "ملابس", type: "محل" },
        { name: "حلو الشام", category: "مطاعم", type: "مطعم" },
        { name: "واحة النخيل", category: "كفيهات", type: "كافيه" },
        { name: "محلات H7", category: "ملابس", type: "محل" }
    ],
    categories: [
        { name: "خصومات", type: "قسم" },
        { name: "الجوائز", type: "قسم" },
        { name: "وظائف", type: "قسم" },
        { name: "محلات حديثة", type: "قسم" }
    ],
    jobs: [
        { name: "وظائف مغاغة", type: "قسم" }
    ]
};

// عناصر DOM
const searchInput = document.getElementById('globalSearch');
const searchSuggestions = document.getElementById('searchSuggestions');

// استمع لكتابة المستخدم
searchInput.addEventListener('input', handleSearchInput);
searchInput.addEventListener('focus', handleSearchFocus);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
});

// إغلاق الاقتراحات عند النقر خارجها
document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
        searchSuggestions.classList.remove('active');
    }
});

// معالجة الكتابة في شريط البحث
function handleSearchInput() {
    const query = searchInput.value.trim();
    
    if (query.length === 0) {
        searchSuggestions.classList.remove('active');
        return;
    }
    
    const results = searchAllSections(query);
    displaySuggestions(results, query);
}

// معالجة التركيز على شريط البحث
function handleSearchFocus() {
    const query = searchInput.value.trim();
    if (query.length > 0) {
        const results = searchAllSections(query);
        displaySuggestions(results, query);
    }
}

// البحث في جميع الأقسام
function searchAllSections(query) {
    const results = [];
    const lowerQuery = query.toLowerCase();
    
    // البحث في الخصومات
    searchData.discounts.forEach(item => {
        if (item.name.toLowerCase().includes(lowerQuery) || 
            item.category.toLowerCase().includes(lowerQuery)) {
            results.push({
                type: 'خصم',
                name: item.name,
                category: item.category,
                display: `${item.name} - ${item.category}`,
                url: '#discounts-section'
            });
        }
    });
    
    // البحث في الأقسام
    searchData.categories.forEach(item => {
        if (item.name.toLowerCase().includes(lowerQuery)) {
            results.push({
                type: 'قسم',
                name: item.name,
                display: item.name,
                url: item.name === 'وظائف' ? '#jobs-section' : `#${item.name.toLowerCase()}`
            });
        }
    });
    
    // البحث في الوظائف
    searchData.jobs.forEach(item => {
        if (item.name.toLowerCase().includes(lowerQuery)) {
            results.push({
                type: 'وظيفة',
                name: item.name,
                display: item.name,
                url: '#jobs-section'
            });
        }
    });
    
    return results.slice(0, 8); // الحد الأقصى 8 نتائج
}

// عرض الاقتراحات
function displaySuggestions(results, query) {
    if (results.length === 0) {
        searchSuggestions.innerHTML = `
            <div class="suggestion-item no-results">
                <i class="fas fa-search"></i>
                <span>لا توجد نتائج لـ "${query}"</span>
            </div>
        `;
        searchSuggestions.classList.add('active');
        return;
    }
    
    searchSuggestions.innerHTML = results.map(result => `
        <div class="suggestion-item" data-url="${result.url}" data-type="${result.type}">
            <i class="${getSuggestionIcon(result.type)}"></i>
            <div class="suggestion-content">
                <div class="suggestion-title">${highlightText(result.display, query)}</div>
                <div class="suggestion-type">${result.type}</div>
            </div>
        </div>
    `).join('');
    
    // إضافة مستمعين للنقر
    document.querySelectorAll('.suggestion-item').forEach(item => {
        if (!item.classList.contains('no-results')) {
            item.addEventListener('click', () => {
                const url = item.getAttribute('data-url');
                navigateToResult(url);
            });
        }
    });
    
    searchSuggestions.classList.add('active');
}

// تنقل إلى النتيجة
function navigateToResult(url) {
    searchSuggestions.classList.remove('active');
    searchInput.value = '';
    
    if (url.startsWith('#')) {
        // تنقل داخل الصفحة
        const targetElement = document.querySelector(url);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
            targetElement.classList.add('highlight');
            setTimeout(() => targetElement.classList.remove('highlight'), 2000);
        }
    }
}

// البحث النهائي
function performSearch() {
    const query = searchInput.value.trim();
    if (query.length === 0) return;
    
    const results = searchAllSections(query);
    if (results.length > 0) {
        navigateToResult(results[0].url);
    }
}

// وظائف مساعدة
function getSuggestionIcon(type) {
    const icons = {
        'خصم': 'fas fa-percent',
        'قسم': 'fas fa-folder',
        'وظيفة': 'fas fa-briefcase'
    };
    return icons[type] || 'fas fa-search';
}

function highlightText(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}
// استمع لكتابة المستخدم
searchInput.addEventListener('input', handleSearchInput);
searchInput.addEventListener('focus', handleSearchFocus);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
});

// إغلاق الاقتراحات عند النقر خارجها
document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
        searchSuggestions.classList.remove('active');
    }
});

// معالجة الكتابة في شريط البحث
function handleSearchInput() {
    const query = searchInput.value.trim();
    
    if (query.length === 0) {
        searchSuggestions.classList.remove('active');
        return;
    }
    
    const results = searchAllSections(query);
    displaySuggestions(results, query);
}

// معالجة التركيز على شريط البحث
function handleSearchFocus() {
    const query = searchInput.value.trim();
    if (query.length > 0) {
        const results = searchAllSections(query);
        displaySuggestions(results, query);
    }
}

// البحث في جميع الأقسام
function searchAllSections(query) {
    const results = [];
    const lowerQuery = query.toLowerCase();
    
    // البحث في الخصومات
    searchData.discounts.forEach(item => {
        if (item.name.toLowerCase().includes(lowerQuery) || 
            item.category.toLowerCase().includes(lowerQuery)) {
            results.push({
                type: 'خصم',
                name: item.name,
                category: item.category,
                display: `${item.name} - ${item.category}`,
                url: '#discounts-section',
                searchTerm: item.name
            });
        }
    });
    
    // البحث في الأقسام
    searchData.categories.forEach(item => {
        if (item.name.toLowerCase().includes(lowerQuery)) {
            results.push({
                type: 'قسم',
                name: item.name,
                display: item.name,
                url: item.name === 'وظائف' ? '#jobs-section' : `#${item.name.toLowerCase()}`,
                searchTerm: item.name
            });
        }
    });
    
    // البحث في الوظائف
    searchData.jobs.forEach(item => {
        if (item.name.toLowerCase().includes(lowerQuery)) {
            results.push({
                type: 'وظيفة',
                name: item.name,
                display: item.name,
                url: '#jobs-section',
                searchTerm: item.name
            });
        }
    });
    
    return results.slice(0, 8); // الحد الأقصى 8 نتائج
}

// عرض الاقتراحات
function displaySuggestions(results, query) {
    if (results.length === 0) {
        searchSuggestions.innerHTML = `
            <div class="suggestion-item no-results">
                <i class="fas fa-search"></i>
                <span>لا توجد نتائج لـ "${query}"</span>
            </div>
        `;
        searchSuggestions.classList.add('active');
        return;
    }
    
    searchSuggestions.innerHTML = results.map(result => `
        <div class="suggestion-item" data-url="${result.url}" data-search="${result.searchTerm}">
            <i class="${getSuggestionIcon(result.type)}"></i>
            <div class="suggestion-content">
                <div class="suggestion-title">${highlightText(result.display, query)}</div>
                <div class="suggestion-type">${result.type}</div>
            </div>
        </div>
    `).join('');
    
    // إضافة مستمعين للنقر على الاقتراحات
    document.querySelectorAll('.suggestion-item:not(.no-results)').forEach(item => {
        item.addEventListener('click', function() {
            const url = this.getAttribute('data-url');
            const searchTerm = this.getAttribute('data-search');
            
            // إغلاق قائمة الاقتراحات
            searchSuggestions.classList.remove('active');
            
            // تنقل إلى القسم المطلوب
            navigateToSection(url, searchTerm);
        });
    });
    
    searchSuggestions.classList.add('active');
}

// تنقل إلى القسم مع تمييز النتائج
function navigateToSection(url, searchTerm) {
    // مسح حقل البحث
    searchInput.value = searchTerm;
    
    if (url.startsWith('#')) {
        const targetElement = document.querySelector(url);
        if (targetElement) {
            // الانتقال السلس إلى القسم
            targetElement.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            
            // تمييز القسم
            highlightSection(targetElement, searchTerm);
        }
    }
}

// تمييز القسم والنتائج
function highlightSection(section, searchTerm) {
    // إضافة تأثير تمييز مؤقت
    section.style.transition = 'all 0.5s ease';
    section.style.boxShadow = '0 0 0 3px rgba(255, 126, 95, 0.3)';
    
    setTimeout(() => {
        section.style.boxShadow = 'none';
    }, 2000);
    
    // إذا كان قسم الخصومات، تمييز المتاجر ذات الصلة
    if (section.id === 'discounts-section') {
        highlightStores(searchTerm);
    }
    
    // إذا كان قسم الوظائف، تمييز الوظائف ذات الصلة
    if (section.id === 'jobs-section') {
        highlightJobs(searchTerm);
    }
}

// تمييز المتاجر التي تطابق البحث
function highlightStores(searchTerm) {
    const discountCards = document.querySelectorAll('.discount-card');
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    discountCards.forEach(card => {
        const storeName = card.querySelector('h3').textContent.toLowerCase();
        const storeDesc = card.querySelector('.store-desc').textContent.toLowerCase();
        
        if (storeName.includes(lowerSearchTerm) || storeDesc.includes(lowerSearchTerm)) {
            card.style.transform = 'scale(1.02)';
            card.style.boxShadow = '0 5px 20px rgba(255, 126, 95, 0.4)';
            card.style.zIndex = '10';
            
            setTimeout(() => {
                card.style.transform = 'scale(1)';
                card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.08)';
                card.style.zIndex = '1';
            }, 2000);
        }
    });
}

// تمييز الوظائف التي تطابق البحث
function highlightJobs(searchTerm) {
    const jobCards = document.querySelectorAll('.job-card');
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    jobCards.forEach(card => {
        const jobTitle = card.querySelector('.card-title').textContent.toLowerCase();
        const companyName = card.querySelector('.card-subtitle').textContent.toLowerCase();
        const jobDesc = card.querySelector('.card-text').textContent.toLowerCase();
        
        if (jobTitle.includes(lowerSearchTerm) || 
            companyName.includes(lowerSearchTerm) || 
            jobDesc.includes(lowerSearchTerm)) {
            
            card.style.borderLeft = '4px solid #ff7e5f';
            card.style.transform = 'translateX(10px)';
            
            setTimeout(() => {
                card.style.borderLeft = '4px solid var(--primary-color)';
                card.style.transform = 'translateX(0)';
            }, 2000);
        }
    });
}

// البحث النهائي عند الضغط على Enter
function performSearch() {
    const query = searchInput.value.trim();
    if (query.length === 0) return;
    
    const results = searchAllSections(query);
    if (results.length > 0) {
        navigateToSection(results[0].url, results[0].searchTerm);
    }
}

// وظائف مساعدة
function getSuggestionIcon(type) {
    const icons = {
        'خصم': 'fas fa-percent',
        'قسم': 'fas fa-folder',
        'وظيفة': 'fas fa-briefcase',
        'محل': 'fas fa-store',
        'مطعم': 'fas fa-utensils',
        'كافيه': 'fas fa-coffee'
    };
    return icons[type] || 'fas fa-search';
}

function highlightText(text, query) {
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}




// دالة اختيار الباقة
function selectPlan(planName, planPrice) {
    // نص الرسالة التلقائية
    const message = `مرحباً، أريد الاشتراك في ${planName} بسعر ${planPrice} جنيه شهرياً. أود معرفة الخطوات التالية للبدء.`;
    
    // ترميز النص للرابط
    const encodedMessage = encodeURIComponent(message);
    
    // رقم الواتساب
    const phoneNumber = '201148179176';
    
    // إنشاء رابط الواتساب
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // فتح الرابط في نافذة جديدة
    window.open(whatsappURL, '_blank');
    
    // إضافة تأثير visual feedback
    const planCard = document.querySelector(`[data-plan="${planName}"]`);
    if (planCard) {
        planCard.style.animation = 'planSelected 0.6s ease';
        setTimeout(() => {
            planCard.style.animation = '';
        }, 600);
    }
}

// تأثير CSS للاختيار
const style = document.createElement('style');
style.textContent = `
    @keyframes planSelected {
        0% { transform: scale(1); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); }
        50% { transform: scale(1.05); box-shadow: 0 15px 35px rgba(255, 126, 95, 0.4); }
        100% { transform: scale(1); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); }
    }
    
    .plan-card {
        animation: none;
    }
`;
document.head.appendChild(style);

// استمع لأزرار الباقات
document.addEventListener('DOMContentLoaded', function() {
    const planButtons = document.querySelectorAll('.plan-select-btn');
    planButtons.forEach(button => {
        button.addEventListener('click', function() {
            const planCard = this.closest('.plan-card');
            const planName = planCard.getAttribute('data-plan');
            const planPrice = planCard.getAttribute('data-price');
            selectPlan(planName, planPrice);
        });
    });
});


// دالة اختيار الباقة (يجب أن تكون موجودة في script.js)
function selectPlan(planName, planPrice) {
    const message = `مرحباً، أريد الاشتراك في ${planName} بسعر ${planPrice} جنيه شهرياً. أود معرفة الخطوات التالية للبدء.`;
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = '201148179176';
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
    
    const planCard = document.querySelector(`[data-plan="${planName}"]`);
    if (planCard) {
        planCard.style.animation = 'planSelected 0.6s ease';
        setTimeout(() => {
            planCard.style.animation = '';
        }, 600);
    }
}

// تأثير CSS للباقات
const style = document.createElement('style');
style.textContent = `
    @keyframes planSelected {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);



// دالة اختيار الباقة مع التوجيه المباشر للواتساب
function selectPlan(planName, planPrice) {
    // إنشاء رسالة واتساب جاهزة
    const whatsappMessage = `🎯 *طلب اشتراك جديد في ${planName}*
    
📋 *تفاصيل الطلب:*
• *الباقة:* ${planName}
• *السعر:* ${planPrice} جنيه شهرياً
• *التاريخ:* ${new Date().toLocaleDateString('ar-EG')}
• *الوقت:* ${new Date().toLocaleTimeString('ar-EG')}

💼 *لمواصلة عملية الاشتراك، يرجى إرسال:*
1. اسم المحل 🏪
2. صور المحل 📸
3. رقم الهاتف 📞
4. الموقع 📍

⚡ *سيتم تفعيل الإشتراك خلال 24 ساعة بعد استكمال البيانات*`;

    // ترميز الرسالة للرابط
    const encodedMessage = encodeURIComponent(whatsappMessage);
    
    // رقم الواتساب
    const phoneNumber = '201148179176';
    
    // إنشاء رابط الواتساب
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // فتح الواتساب في نافذة جديدة
    window.open(whatsappURL, '_blank');
    
    // إضافة تأثير visual feedback
    const planCard = document.querySelector(`[data-plan="${planName}"]`);
    if (planCard) {
        planCard.style.animation = 'planSelected 0.6s ease';
        setTimeout(() => {
            planCard.style.animation = '';
        }, 600);
    }
    
    // حفظ في localStorage لتتبع الطلبات
    saveOrderHistory(planName, planPrice);
}

// حفظ سجل الطلبات
function saveOrderHistory(planName, planPrice) {
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    
    const newOrder = {
        id: Date.now(),
        planName: planName,
        planPrice: planPrice,
        timestamp: new Date().toLocaleString('ar-EG'),
        status: 'pending'
    };
    
    orderHistory.unshift(newOrder);
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
}

// تأثير CSS للباقات
const style = document.createElement('style');
style.textContent = `
    @keyframes planSelected {
        0% { 
            transform: scale(1); 
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        50% { 
            transform: scale(1.05); 
            box-shadow: 0 20px 40px rgba(255, 126, 95, 0.4);
        }
        100% { 
            transform: scale(1); 
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
    }
    
    .plan-card {
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(style);

// استمع لأزرار الباقات
document.addEventListener('DOMContentLoaded', function() {
    const planButtons = document.querySelectorAll('.plan-select-btn');
    planButtons.forEach(button => {
        button.addEventListener('click', function() {
            const planCard = this.closest('.plan-card');
            const planName = planCard.getAttribute('data-plan');
            const planPrice = planCard.getAttribute('data-price');
            selectPlan(planName, planPrice);
        });
    });
    
    // عرض إحصائيات الطلبات إذا كان مسؤولاً
    if (isAdmin) {
        showOrderStatistics();
    }
});

// عرض إحصائيات الطلبات (للمسؤول فقط)
function showOrderStatistics() {
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    console.log('📊 إحصائيات الطلبات:', orderHistory);
    
    if (orderHistory.length > 0) {
        const statsElement = document.createElement('div');
        statsElement.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(255, 126, 95, 0.9);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-size: 12px;
            z-index: 10000;
        `;
        statsElement.innerHTML = `📊 الطلبات: ${orderHistory.length}`;
        document.body.appendChild(statsElement);
    }
}


// دالة اختيار الباقة مع التوجيه المباشر للواتساب
function selectPlan(planName, planPrice) {
    // إنشاء رسالة واتساب جاهزة
    const whatsappMessage = `🎯 *طلب اشتراك جديد في ${planName}*
    
📋 *تفاصيل الطلب:*
• *الباقة:* ${planName}
• *السعر:* ${planPrice} جنيه شهرياً
• *التاريخ:* ${new Date().toLocaleDateString('ar-EG')}
• *الوقت:* ${new Date().toLocaleTimeString('ar-EG')}

💼 *لمواصلة عملية الاشتراك، يرجى إرسال:*
1. اسم المحل 🏪
2. صور المحل 📸
3. رقم الهاتف 📞
4. الموقع 📍

⚡ *سيتم تفعيل الإشتراك خلال 24 ساعة بعد استكمال البيانات*`;

    // ترميز الرسالة للرابط
    const encodedMessage = encodeURIComponent(whatsappMessage);
    
    // رقم الواتساب
    const phoneNumber = '201148179176';
    
    // إنشاء رابط الواتساب
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // فتح الواتساب في نافذة جديدة
    window.open(whatsappURL, '_blank');
    
    // إضافة تأثير visual feedback
    const planCard = document.querySelector(`[data-plan="${planName}"]`);
    if (planCard) {
        planCard.style.animation = 'planSelected 0.6s ease';
        setTimeout(() => {
            planCard.style.animation = '';
        }, 600);
    }
}

// تأثير CSS للباقات
const style = document.createElement('style');
style.textContent = `
    @keyframes planSelected {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// دالة اختيار الباقة مع التوجيه المباشر للواتساب
function selectPlan(planName, planPrice) {
    console.log('تم اختيار الباقة:', planName, planPrice);
    
    // إنشاء رسالة واتساب جاهزة
    const whatsappMessage = `🎯 *طلب اشتراك جديد في ${planName}*
    
📋 *تفاصيل الطلب:*
• *الباقة:* ${planName}
• *السعر:* ${planPrice} جنيه شهرياً
• *التاريخ:* ${new Date().toLocaleDateString('ar-EG')}
• *الوقت:* ${new Date().toLocaleTimeString('ar-EG')}

💼 *لمواصلة عملية الاشتراك، يرجى إرسال:*
1. اسم المحل 🏪
2. صور المحل 📸
3. رقم الهاتف 📞
4. الموقع 📍

⚡ *سيتم تفعيل الإشتراك خلال 24 ساعة بعد استكمال البيانات*`;

    // ترميز الرسالة للرابط
    const encodedMessage = encodeURIComponent(whatsappMessage);
    
    // رقم الواتساب
    const phoneNumber = '201148179176';
    
    // إنشاء رابط الواتساب
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    console.log('رابط الواتساب:', whatsappURL);
    
    // فتح الواتساب في نافذة جديدة
    window.open(whatsappURL, '_blank');
    
    // إضافة تأثير visual feedback
    const planCard = document.querySelector(`[data-plan="${planName}"]`);
    if (planCard) {
        planCard.style.animation = 'planSelected 0.6s ease';
        setTimeout(() => {
            planCard.style.animation = '';
        }, 600);
    }
}

// تأثير CSS للباقات
const planStyle = document.createElement('style');
planStyle.textContent = `
    @keyframes planSelected {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .plan-card {
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(planStyle);

// اختبار الدالة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('تم تحميل صفحة الباقات');
    
    // اختبار أن الدالة تعمل
    window.testPlan = function() {
        selectPlan('الباقة الأساسية', 100);
    };
});



// دالة فلترة العقارات
function filterProperties(filterValue) {
    console.log('جاري التصفية حسب:', filterValue);
    
    const propertyCards = document.querySelectorAll('.property-card');
    let visibleCount = 0;
    
    propertyCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (filterValue === 'all' || cardCategory === filterValue) {
            card.style.display = 'block';
            visibleCount++;
            console.log('إظهار العقار:', cardCategory);
        } else {
            card.style.display = 'none';
            console.log('إخفاء العقار:', cardCategory);
        }
    });
    
    console.log('عدد العقارات الظاهرة:', visibleCount);
    
    // إظهار رسالة إذا لم توجد نتائج
    showNoResultsMessage(visibleCount === 0, filterValue);
}

// عرض رسالة عدم وجود نتائج
function showNoResultsMessage(show, filterValue) {
    // إزالة أي رسالة موجودة مسبقاً
    const existingMessage = document.getElementById('no-results-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    if (show) {
        const message = document.createElement('div');
        message.id = 'no-results-message';
        message.style.cssText = `
            text-align: center;
            padding: 40px;
            background: #f8f9fa;
            border-radius: 10px;
            margin: 20px 0;
            border: 2px dashed #ff7e5f;
        `;
        
        message.innerHTML = `
            <i class="fas fa-search" style="font-size: 3rem; color: #ff7e5f; margin-bottom: 15px;"></i>
            <h3 style="color: #333; margin-bottom: 10px;">لا توجد عقارات</h3>
            <p style="color: #666;">لا توجد عقارات متاحة في التصنيف: ${getArabicCategoryName(filterValue)}</p>
            <button onclick="resetFilters()" style="
                margin-top: 15px;
                padding: 12px 25px;
                background: #ff7e5f;
                color: white;
                border: none;
                border-radius: 25px;
                cursor: pointer;
                font-weight: bold;
            ">
                عرض جميع العقارات
            </button>
        `;
        
        const grid = document.querySelector('.real-estate-grid');
        if (grid) {
            grid.parentNode.insertBefore(message, grid.nextSibling);
        }
    }
}

// إعادة تعيين الفلتر
function resetFilters() {
    console.log('إعادة تعيين الفلتر');
    
    // إعادة تعيين الأزرار
    const filterButtons = document.querySelectorAll('.real-estate-filters .filter-btn');
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // تفعيل زر "الكل"
    const allButton = document.querySelector('[data-filter="all"]');
    if (allButton) {
        allButton.classList.add('active');
    }
    
    // إظهار جميع العقارات
    filterProperties('all');
    
    // إزالة رسالة عدم وجود نتائج
    const message = document.getElementById('no-results-message');
    if (message) {
        message.remove();
    }
}

// الحصول على الاسم العربي للتصنيف
function getArabicCategoryName(category) {
    const categories = {
        'all': 'الكل',
        'شقق': 'شقق للبيع',
        'شقق-ايجار': 'شقق للإيجار',
        'عقارات': 'عقارات',
        'اراضي': 'أراضي',
        'فلل': 'فلل'
    };
    return categories[category] || category;
}

// دالة الاتصال بالمالك
function contactOwner(propertyTitle, price) {
    const message = `مرحباً، أنا مهتم بالعقار: ${propertyTitle}`;
    alert('📞 رقم الاتصال: 01148179176\n\n' + message);
}

// دالة التواصل عبر واتساب
function whatsappOwner(propertyTitle, price) {
    const message = `مرحباً، أنا مهتم بالعقار: ${propertyTitle}\nأريد الاستفسار عن التفاصيل والمزيد من المعلومات.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/201148179176?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
}

// تهيئة الفلترة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('تم تحميل الصفحة، جاري تهيئة فلترة العقارات...');
    
    // الانتظار قليلاً لضمان تحميل جميع العناصر
    setTimeout(function() {
        const filterButtons = document.querySelectorAll('.real-estate-filters .filter-btn');
        const propertyCards = document.querySelectorAll('.property-card');
        
        console.log('تم العثور على:', filterButtons.length, 'أزرار فلترة');
        console.log('تم العثور على:', propertyCards.length, 'بطاقة عقار');
        
        if (filterButtons.length === 0) {
            console.error('لم يتم العثور على أزرار الفلترة!');
            return;
        }
        
        if (propertyCards.length === 0) {
            console.error('لم يتم العثور على بطاقات العقارات!');
            return;
        }
        
        // إضافة event listeners لكل زر
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                console.log('تم النقر على:', this.textContent);
                
                // إزالة النشاط من جميع الأزرار
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // إضافة النشاط للزر المحدد
                this.classList.add('active');
                
                // الحصول على قيمة الفلتر
                const filterValue = this.getAttribute('data-filter');
                
                // تطبيق الفلتر
                filterProperties(filterValue);
            });
        });
        
        // تفعيل زر "الكل" افتراضياً
        const allButton = document.querySelector('[data-filter="all"]');
        if (allButton) {
            allButton.classList.add('active');
        }
        
        console.log('تم تهيئة الفلترة بنجاح!');
        
    }, 100); // تأخير بسيط لضمان تحميل DOM
});

// دالة لاختبار الفلترة يدوياً من ال console
window.testFilter = function(filterValue = 'all') {
    console.log('🔧 اختبار الفلترة يدوياً:', filterValue);
    filterProperties(filterValue);
};

// دالة لعرض معلومات التصفية
window.showFilterInfo = function() {
    console.log('📊 معلومات التصفية:');
    console.log('الأزرار:', document.querySelectorAll('.real-estate-filters .filter-btn').length);
    console.log('البطاقات:', document.querySelectorAll('.property-card').length);
    
    document.querySelectorAll('.property-card').forEach((card, index) => {
        console.log(`البطاقة ${index + 1}:`, card.getAttribute('data-category'));
    });
};