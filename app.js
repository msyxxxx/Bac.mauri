let selectedFile = null;

document.getElementById("normalExamBtn").onclick = () => loadFile("xlsx1.xlsx");
document.getElementById("supplementaryExamBtn").onclick = () => loadFile("xlsx2.xlsx");

document.getElementById("arabicBtn").onclick = () => setLanguage("ar");
document.getElementById("frenchBtn").onclick = () => setLanguage("fr");

document.getElementById("searchBtn").onclick = search;

function loadFile(filename) {
    selectedFile = filename;
    document.querySelector(".search-section").style.display = "block";
    document.querySelector(".result-section").style.display = "none";
}

function search() {
    const searchInput = document.getElementById("searchInput").value;
    if (!searchInput || !selectedFile) return;

    fetch(selectedFile)
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet);

            const result = rows.find(row => row.NODOSS == searchInput);
            displayResult(result);
        });
}

function displayResult(result) {
    if (!result) {
        alert("لم يتم العثور على نتائج.");
        return;
    }

    document.querySelector(".result-section").style.display = "block";
    document.getElementById("nodoss").innerText = result.NODOSS || "";
    document.getElementById("nni").innerText = result.NNI || "";
    document.getElementById("serie").innerText = result.SERIE || "";
    document.getElementById("nompl").innerText = result.NOMPL || "";
    document.getElementById("nompa").innerText = result.NOMPA || "";
    document.getElementById("moybac").innerText = result.Moybac || "";
    document.getElementById("centre_ar").innerText = result.Centre_AR || "";
    document.getElementById("centre_fr").innerText = result.Centre_FR || "";
    document.getElementById("decision").innerText = result.Decision || "";
}

function setLanguage(lang) {
    const translations = {
        ar: {
            normalExamBtn: "الباكالوريا الدورة العادية",
            supplementaryExamBtn: "الباكالوريا الدورة التكميلية",
            searchPlaceholder: "ادخل رقم المترشح",
            searchBtn: "بحث"
        },
        fr: {
            normalExamBtn: "Baccalauréat Session Normale",
            supplementaryExamBtn: "Baccalauréat Session Supplémentaire",
            searchPlaceholder: "Entrez le numéro du candidat",
            searchBtn: "Rechercher"
        }
    };

    const t = translations[lang];
    document.getElementById("normalExamBtn").innerText = t.normalExamBtn;
    document.getElementById("supplementaryExamBtn").innerText = t.supplementaryExamBtn;
    document.getElementById("searchInput").placeholder = t.searchPlaceholder;
    document.getElementById("searchBtn").innerText = t.searchBtn;
}