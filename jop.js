





// عناصر DOM
const jobsList = document.getElementById('jobsList');
const jobForm = document.getElementById('jobForm');
const loadingSection = document.getElementById('loadingSection');
const noJobsMessage = document.getElementById('noJobsMessage');
const adminLoginBtn = document.getElementById('adminLoginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const applyFilters = document.getElementById('applyFilters');

// حالة التطبيق
let isAdmin = false;
let allJobs = [];

// دالة اختبار الاتصال
async function testSupabaseConnection() {
    console.log('جاري اختبار الاتصال بـ Supabase...');
    
    // التحقق من وجود supabase أولاً
    if (typeof supabase === 'undefined' || !supabase) {
        console.error('❌ Supabase غير معرّف');
        showAlert('لم يتم تهيئة النظام بشكل صحيح', 'danger');
        return false;
    }
    
    try {
        // اختبار بسيط للاتصال
        const { data, error } = await supabase.from('jobs').select('count');
        
        if (error) {
            console.error('❌ خطأ في الاتصال:', error.message);
            showAlert('فشل الاتصال بقاعدة البيانات: ' + error.message, 'danger');
            return false;
        } else {
            console.log('✅ الاتصال ناجح! عدد الوظائف:', data[0]?.count || 0);
            return true;
        }
    } catch (err) {
        console.error('❌ خطأ غير متوقع:', err);
        showAlert('حدث خطأ غير متوقع أثناء الاتصال', 'danger');
        return false;
    }
}

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('تم تحميل الصفحة');
    
    // الانتظار لتحميل Supabase بالكامل
    setTimeout(() => {
        // اختبار الاتصال أولاً
        testSupabaseConnection().then(success => {
            if (success) {
                // جلب الوظائف عند تحميل الصفحة
                fetchJobs();
                
                // إعداد نموذج إضافة وظيفة
                if (jobForm) {
                    jobForm.addEventListener('submit', addJob);
                }
                
                // إعداد زر تصفية الوظائف
                if (applyFilters) {
                    applyFilters.addEventListener('click', filterJobs);
                }
                
                // إعداد زر تسجيل الدخول
                if (adminLoginBtn) {
                    adminLoginBtn.addEventListener('click', adminLogin);
                }
                
                // إعداد زر تسجيل الخروج
                if (logoutBtn) {
                    logoutBtn.addEventListener('click', adminLogout);
                }
                
                // التحقق من حالة تسجيل الدخول
                checkAuthState();
            } else {
                // إخفاء رسالة التحميل وإظهار رسالة الخطأ
                if (loadingSection) loadingSection.classList.add('hidden');
                if (noJobsMessage) {
                    noJobsMessage.textContent = 'تعذر الاتصال بقاعدة البيانات. يرجى المحاولة لاحقاً.';
                    noJobsMessage.classList.remove('hidden');
                }
            }
        });
    }, 500); // زيادة وقت الانتظار إلى 500 مللي ثانية
});

// جلب الوظائف من Supabase
async function fetchJobs() {
    try {
        if (loadingSection) loadingSection.classList.remove('hidden');
        if (noJobsMessage) noJobsMessage.classList.add('hidden');
        
        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Error fetching jobs:', error);
            showAlert('حدث خطأ في تحميل الوظائف: ' + error.message, 'danger');
            return;
        }
        
        allJobs = data || [];
        displayJobs(allJobs);
        
        if (allJobs.length === 0 && noJobsMessage) {
            noJobsMessage.classList.remove('hidden');
        }
        
        if (loadingSection) loadingSection.classList.add('hidden');
    } catch (err) {
        console.error('Error:', err);
        if (loadingSection) loadingSection.classList.add('hidden');
        showAlert('حدث خطأ غير متوقع', 'danger');
    }
}

// عرض الوظائف في القائمة
function displayJobs(jobs) {
    if (!jobsList) return;
    
    jobsList.innerHTML = '';
    
    if (jobs.length === 0) {
        if (noJobsMessage) noJobsMessage.classList.remove('hidden');
        return;
    }
    
    if (noJobsMessage) noJobsMessage.classList.add('hidden');
    
    jobs.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.className = 'col-12 mb-3';
        jobCard.innerHTML = `
            <div class="card job-card">
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <h5 class="card-title">${job.title}</h5>
                        <span class="job-type ${job.type}">${getJobTypeText(job.type)}</span>
                    </div>
                    <h6 class="card-subtitle mb-2 text-muted">${job.company}</h6>
                    <p class="card-text">${job.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <span class="badge bg-secondary me-2">${getLocationText(job.location)}</span>
                            <span class="badge bg-light text-dark">${getCategoryText(job.category)}</span>
                        </div>
                        <small class="text-muted">${formatDate(job.created_at)}</small>
                    </div>
                    <div class="contact-info mt-2">
                        <strong>معلومات التواصل:</strong> ${job.contact_info}
                    </div>
                    ${isAdmin ? `
                        <div class="admin-controls">
                            <button class="btn btn-sm btn-danger delete-job" data-id="${job.id}">
                                <i class="fas fa-trash me-1"></i>حذف
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        jobsList.appendChild(jobCard);
    });
    
    // إضافة مستمعين لأزرار الحذف إذا كان مسؤولاً
    if (isAdmin) {
        document.querySelectorAll('.delete-job').forEach(button => {
            button.addEventListener('click', function() {
                const jobId = this.getAttribute('data-id');
                deleteJob(jobId);
            });
        });
    }
}

// إضافة وظيفة جديدة
async function addJob(e) {
    e.preventDefault();
    
    if (!jobForm) return;
    
    // التحقق من صحة النموذج
    const title = document.getElementById('jobTitle').value;
    const company = document.getElementById('companyName').value;
    
    if (!title || !company) {
        showAlert('يرجى ملء جميع الحقول المطلوبة', 'warning');
        return;
    }
    
    const jobData = {
        title: title,
        company: company,
        location: document.getElementById('jobLocation').value,
        type: document.getElementById('jobType').value,
        category: document.getElementById('jobCategory').value,
        description: document.getElementById('jobDescription').value,
        contact_info: document.getElementById('contactInfo').value
    };
    
    try {
        console.log('Adding job:', jobData);
        
        const { data, error } = await supabase
            .from('jobs')
            .insert([jobData])
            .select();
        
        if (error) {
            console.error('Error adding job:', error);
            showAlert('حدث خطأ أثناء إضافة الوظيفة: ' + error.message, 'danger');
            return;
        }
        
        // إضافة الوظيفة إلى القائمة
        if (data && data.length > 0) {
            allJobs.unshift(data[0]);
            displayJobs(allJobs);
            
            // إعادة تعيين النموذج
            jobForm.reset();
            
            showAlert('تم إضافة الوظيفة بنجاح', 'success');
            console.log('Job added successfully:', data[0]);
        } else {
            showAlert('لم يتم إضافة الوظيفة، يرجى المحاولة مرة أخرى', 'warning');
        }
        
    } catch (err) {
        console.error('Unexpected error:', err);
        showAlert('حدث خطأ غير متوقع: ' + err.message, 'danger');
    }
}

// حذف وظيفة (للمسؤول فقط)
async function deleteJob(jobId) {
    if (!isAdmin) {
        showAlert('ليست لديك صلاحية حذف الوظائف', 'danger');
        return;
    }
    
    if (!confirm('هل أنت متأكد من حذف هذه الوظيفة؟')) {
        return;
    }
    
    try {
        const { error } = await supabase
            .from('jobs')
            .delete()
            .eq('id', jobId);
        
        if (error) {
            console.error('Error deleting job:', error);
            showAlert('حدث خطأ أثناء حذف الوظيفة: ' + error.message, 'danger');
            return;
        }
        
        // إزالة الوظيفة من القائمة
        allJobs = allJobs.filter(job => job.id !== jobId);
        displayJobs(allJobs);
        
        showAlert('تم حذف الوظيفة بنجاح', 'success');
    } catch (err) {
        console.error('Error:', err);
        showAlert('حدث خطأ غير متوقع', 'danger');
    }
}

// تسجيل الدخول كمسؤول
async function adminLogin() {
    if (!adminLoginBtn) return;
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        showAlert('يرجى إدخال البريد الإلكتروني وكلمة المرور', 'warning');
        return;
    }
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) {
            console.error('Login error:', error);
            showAlert('فشل تسجيل الدخول: ' + error.message, 'danger');
            return;
        }
        
        // التحقق من الصلاحيات باستخدام دالة محسنة
        const isUserAdmin = await checkAdminStatus();
        if (isUserAdmin) {
            showAlert('تم تسجيل الدخول كمسؤول بنجاح', 'success');
            document.getElementById('adminLoginSection').classList.add('hidden');
            document.getElementById('adminControlsSection').classList.remove('hidden');
            document.getElementById('adminEmail').textContent = email;
            isAdmin = true;
            
            // إعادة تحميل الوظائف لظهور أزرار الحذف
            fetchJobs();
        } else {
            showAlert('ليست لديك صلاحية مسؤول', 'danger');
            await supabase.auth.signOut();
        }
    } catch (err) {
        console.error('Unexpected error:', err);
        showAlert('حدث خطأ غير متوقع', 'danger');
    }
}

// تسجيل الخروج
async function adminLogout() {
    await supabase.auth.signOut();
    document.getElementById('adminLoginSection').classList.remove('hidden');
    document.getElementById('adminControlsSection').classList.add('hidden');
    isAdmin = false;
    displayJobs(allJobs);
    showAlert('تم تسجيل الخروج', 'info');
}

// التحقق من حالة المصادقة
async function checkAuthState() {
    try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
            const isUserAdmin = await checkAdminStatus();
            if (isUserAdmin) {
                document.getElementById('adminLoginSection').classList.add('hidden');
                document.getElementById('adminControlsSection').classList.remove('hidden');
                document.getElementById('adminEmail').textContent = data.session.user.email;
                isAdmin = true;
            }
        }
    } catch (err) {
        console.error('Error checking auth state:', err);
    }
}

// التحقق إذا كان المستخدم مسؤولاً
// التحقق إذا كان المستخدم مسؤولاً
async function checkAdminStatus() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        console.log('جاري التحقق من صلاحية المسؤول للمستخدم:', user.id);

        // التحقق من جدول public.users
        const { data: userData, error } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .maybeSingle(); // استخدام maybeSingle بدلاً من single

        if (error) {
            console.log('خطأ في التحقق:', error);
            return false;
        }

        // إذا لم يوجد مستخدم في الجدول، أضفه تلقائياً
        if (!userData) {
            console.log('المستخدم غير موجود في الجدول، جاري إضافه...');
            const { error: insertError } = await supabase
                .from('users')
                .insert([
                    { 
                        id: user.id, 
                        email: user.email,
                        role: 'user' // افتراضيًاً يكون user
                    }
                ]);

            if (insertError) {
                console.log('خطأ في إضافة المستخدم:', insertError);
                return false;
            }
            
            return false; // بعد الإضافة يكون role = 'user'
        }

        console.log('صلاحية المستخدم:', userData.role);
        return userData.role === 'admin';
        
    } catch (err) {
        console.error('خطأ غير متوقع:', err);
        return false;
    }
}

// تصفية الوظائف
function filterJobs() {
    const typeFilter = document.getElementById('job-type').value;
    const locationFilter = document.getElementById('job-location').value;
    const categoryFilter = document.getElementById('job-category').value;
    
    const filteredJobs = allJobs.filter(job => {
        return (typeFilter === 'all' || job.type === typeFilter) &&
               (locationFilter === 'all' || job.location === locationFilter) &&
               (categoryFilter === 'all' || job.category === categoryFilter);
    });
    
    displayJobs(filteredJobs);
}

// وظائف مساعدة
function getJobTypeText(type) {
    const types = {
        'full-time': 'دوام كامل',
        'part-time': 'دوام جزئي',
        'contract': 'عقد',
        'freelance': 'عمل حر'
    };
    return types[type] || type;
}

function getLocationText(location) {
    const locations = {
        'downtown': 'وسط المدينة',
        'north': 'شمال مغاغة',
        'south': 'جنوب مغاغة',
        'industrial': 'المنطقة الصناعية'
    };
    return locations[location] || location;
}

function getCategoryText(category) {
    const categories = {
        'retail': 'بيع بالتجزئة',
        'food': 'مطاعم وغذاء',
        'education': 'تعليم',
        'health': 'صحة',
        'technical': 'تقنية'
    };
    return categories[category] || category;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show success-alert`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // إزالة التنبيه بعد 3 ثوان
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 3000);
}