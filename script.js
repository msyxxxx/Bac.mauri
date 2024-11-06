document.addEventListener("DOMContentLoaded", () => {
    const languageToggle = document.getElementById("language-toggle");
    const fileSelection = document.getElementById("file-selection");
    const searchInterface = document.getElementById("search-interface");
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    const resultBox = document.getElementById("result");

    let currentFile = null;
    let data = [];
    let language = "ar";

    // تغيير اللغة
    languageToggle.addEventListener("click", () => {
        language = language === "ar" ? "fr" : "ar";
        updateLanguage();
    });

    function updateLanguage() {
        if (language === "ar") {
            document.title = "نموذج البحث في نتائج الباكالوريا";
            languageToggle.textContent = "تغيير اللغة";
            document.querySelector("h1").textContent = "اختر نوع الدورة";
            document.getElementById("normal-session").textContent = "الباكالوريا الدورة العادية";
            document.getElementById("complementary-session").textContent = "الباكالوريا الدورة التكميلية";
            searchButton.textContent = "بحث";
        } else {
            document.title = "Recherche des résultats du baccalauréat";
            languageToggle.textContent = "Changer la langue";
            document.querySelector("h1").textContent = "Choisissez le type de session";
            document.getElementById("normal-session").textContent = "Baccalauréat Session Normale";
            document.getElementById("complementary-session").textContent = "Baccalauréat Session Complémentaire";
            searchButton.textContent = "Rechercher";
        }
    }

    // اختيار الملف
    document.getElementById("normal-session").addEventListener("click", () => {
        loadData("xlsx1.xlsx");
    });

    document.getElementById("complementary-session").addEventListener("click", () => {
        loadData("xlsx2.xlsx");
    });

    // تحميل الملف
    function loadData(filename) {
        currentFile = filename;
        fetch(filename)
            .then(response => response.arrayBuffer())
            .then(dataBuffer => {
                const workbook = XLSX.read(dataBuffer, { type: "array" });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                data = XLSX.utils.sheet_to_json(sheet);
                // الانتقال إلى واجهة البحث بعد تحميل الملف
                fileSelection.style.display = "none";
                searchInterface.style.display = "block";
            })
            .catch(err => console.error("Error loading file:", err));
    }

    // البحث في البيانات
    searchButton.addEventListener("click", () => {
        const nodoss = searchInput.value.trim();
        const result = data.find(row => row.NODOSS == nodoss);
        
        if (result) {
            resultBox.innerHTML = `
                <p><strong>الاسم بالعربية:</strong> ${result.NOMPA}</p>
                <p><strong>الاسم بالفرنسية:</strong> ${result.NOMPL}</p>
                <p><strong>الرقم الوطني:</strong> ${result.NNI}</p>
                <p><strong>الشعبة:</strong> ${result.SERIE}</p>
                <p><strong>المعدل العام:</strong> ${result.Moybac}</p>
                <p><strong>المركز بالعربية:</strong> ${result.Centre_AR}</p>
                <p><strong>المركز بالفرنسية:</strong> ${result.Centre_FR}</p>
                <p><strong>الملاحظة:</strong> ${result.Decision}</p>
            `;
        } else {
            resultBox.innerHTML = `<p>لم يتم العثور على نتائج.</p>`;
        }
    });
});
