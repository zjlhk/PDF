// script.js - 处理语言切换、SEO 内容注入以及模拟文件处理逻辑

document.addEventListener('DOMContentLoaded', () => {
    const langSelector = document.getElementById('language-selector');
    
    // --- 1. 语言与内容渲染 ---
    
    function setLanguage(lang) {
        // Fallback to 'en' if language data is missing
        if (!i18nData[lang]) lang = 'en';
        
        document.documentElement.lang = lang;
        localStorage.setItem('preferred_lang', lang);
        
        // 1. Update simple text elements using data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const keys = el.dataset.i18n.split('.');
            let val = i18nData[lang];
            
            // Navigate the object path
            keys.forEach(k => val = val ? val[k] : null);
            
            if (val) el.textContent = val;
        });

        // 2. Update SEO Long Article (innerHTML injection)
        const seoContainer = document.getElementById('seo-article-content');
        if (seoContainer && i18nData[lang].seo_article_guide) {
            seoContainer.innerHTML = i18nData[lang].seo_article_guide;
        }

        // 3. Update Disclaimer
        const disclaimerEl = document.getElementById('disclaimer-text');
        if (disclaimerEl) disclaimerEl.textContent = i18nData[lang].disclaimer;
    }

    // Load GEO Articles (These are static, only the titles/text are set here)
    function loadGeoArticles() {
        const container = document.getElementById('geo-articles-grid');
        if (!container) return;
        container.innerHTML = ''; 
        
        geoArticles.forEach(geo => {
            const article = document.createElement('div');
            article.className = 'geo-card'; 
            article.innerHTML = `
                <div class="geo-flag-title">${geo.country} - ${geo.title}</div>
                <p class="geo-text">${geo.text}</p>
            `;
            container.appendChild(article);
        });
    }

    // Initialization Logic
    const savedLang = localStorage.getItem('preferred_lang') || 'zh'; // Default to Chinese
    if (langSelector) {
        langSelector.value = savedLang;
        langSelector.addEventListener('change', (e) => setLanguage(e.target.value));
    }
    
    setLanguage(savedLang);
    loadGeoArticles();

    // --- 2. 工具模拟逻辑 (仅在工具页生效) ---
    
    const fileInput = document.getElementById('file-upload');
    const actionBtn = document.getElementById('action-btn');
    const downloadBtn = document.getElementById('download-btn');
    const progressBar = document.querySelector('.progress-fill');
    const processArea = document.querySelector('.process-area');
    const fileNameDisplay = document.getElementById('file-name-display');

    if (fileInput && actionBtn) {
        // File selection listener
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                // Display file name(s)
                let name = e.target.files.length > 1 
                           ? `${e.target.files.length} files selected` 
                           : e.target.files[0].name;
                           
                fileNameDisplay.textContent = `📄 ${name}`;
                fileNameDisplay.style.color = 'var(--text-dark)';
                actionBtn.disabled = false;
                
                // Reset UI if a new file is selected after a run
                processArea.classList.remove('active');
                downloadBtn.style.display = 'none';
                actionBtn.style.display = 'inline-flex';
                progressBar.style.width = '0%';
            }
        });

        // Action button simulation (Convert/Merge/Split/Compress)
        actionBtn.addEventListener('click', () => {
            if (actionBtn.disabled) return;
            
            actionBtn.disabled = true;
            fileInput.disabled = true;
            processArea.classList.add('active');
            
            // Get current language for processing text
            const lang = document.documentElement.lang || 'en';
            const processingText = i18nData[lang].ui.processing;
            actionBtn.textContent = processingText;

            // Simulate Loading Animation
            let width = 0;
            const interval = setInterval(() => {
                // Smooth, slightly random increase
                width += Math.floor(Math.random() * 4) + 1; 
                
                if (width >= 100) {
                    width = 100;
                    clearInterval(interval);
                    
                    // Simulation Complete
                    actionBtn.style.display = 'none';
                    downloadBtn.style.display = 'inline-flex';
                    document.querySelector('.success-msg').textContent = i18nData[lang].ui.done;
                }
                progressBar.style.width = width + '%';
            }, 150); // Simulates 15 seconds max processing time
        });

        // Download button listener
        downloadBtn.addEventListener('click', () => {
            const lang = document.documentElement.lang || 'en';
            const alertMsg = lang === 'zh' 
                           ? '🎉 演示模式：前端逻辑完成。 (真实应用中文件已下载)' 
                           : '🎉 Demo Mode: Frontend logic completed successfully. (In a real app, the file would download now.)';
                           
            alert(alertMsg);
            
            // Reset state for next operation
            window.location.reload(); 
        });
    }
});
