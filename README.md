# 🎤 Events Materials Hub
## Knowledge Sharing & Event Resources

---

## 📖 Panoramica

Il repository raccoglie materiali relativi agli eventi organizzati e partecipati, suddivisi per categoria, anno e tipologia.

L'obiettivo è mantenere un archivio centralizzato, facilmente consultabile e aggiornabile, contenente presentazioni, documentazione tecnica, laboratori pratici e risorse condivise durante gli eventi.

---

## 🗂️ Struttura del Repository

L'organizzazione segue il pattern:

**Anno > Evento > Tipologia Materiale**

```
events-materials/
│
├── 📂 2026/
│   ├── 📁 VMware/
│   │   ├── 📁 VCF Workshop/
│   │   │   ├── 📄 Presentation.pdf
│   │   │   ├── 📄 Lab-Guide.md
│   │   │   └── 📁 Resources/
│   │   │
│   │   └── 📁 Aria Operations Deep Dive/
│   │       └── 📄 Slides.pdf
│   │
│   ├── 📁 Kubernetes/
│   │   ├── 📁 Kubernetes Introduction/
│   │   │   ├── 📄 Slides.pdf
│   │   │   └── 📁 Lab/
│   │   │
│   │   └── 📁 Cloud Native Workshop/
│   │
│   └── 📁 Security/
│       └── 📁 Zero Trust Fundamentals/
│
├── 📂 Internal Training/
│   ├── 📁 System Administration/
│   └── 📁 Cloud Infrastructure/
│
└── 📂 Resources/
    ├── 📄 Templates/
    └── 📄 References/
```

---

## 🛠️ Linee Guida per il Contributo

Per mantenere il repository ordinato e facilmente consultabile:

### 📅 Organizzazione
- Creare una cartella dedicata all'evento.
- Utilizzare l'anno come primo livello di categorizzazione.
- Separare slide, documentazione e laboratori pratici.

### 📝 Nomenclatura

Utilizzare nomi chiari e descrittivi.

Esempio:

```
VCF-Introduction-Slides.pdf
Kubernetes-Lab-Guide.md
Aria-Operations-Demo.yaml
```

Evitare nomi generici:

```
slides_final.pdf
documentazione_new_v2.pdf
test.pdf
```

### 🔄 Aggiornamenti

- Prima di caricare nuovo materiale verificare se esiste già una versione aggiornata.
- Evitare duplicati dello stesso contenuto.
- Conservare lo storico tramite Git.

---

## 📌 Note e Link Utili

🌐 **Sito ufficiale:** www.deso.tech

👥 **Contributori:**  
Lo storico delle modifiche è disponibile tramite:

```
git log
```

---

📚 Repository dedicato alla condivisione della conoscenza tecnica e dei materiali relativi agli eventi.
