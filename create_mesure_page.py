"""
Génère mesure_efficacite.html depuis le fichier source Brico Dépôt.
Place le fichier source dans le dossier du projet et lance :
    python create_mesure_page.py
"""
import os, re, sys

# Cherche le fichier source
src_candidates = [
    "carte_test_learn_bricodepot_1 (1).html",
    "carte_test_learn_bricodepot_1.html",
]
src_path = None
for c in src_candidates:
    if os.path.exists(c):
        src_path = c
        break

if not src_path:
    print("ERREUR : fichier source introuvable.")
    print("Place 'carte_test_learn_bricodepot_1 (1).html' dans ce dossier puis relance.")
    sys.exit(1)

# Lecture et correction de l'encodage (double-encodage UTF-8/Latin-1)
with open(src_path, 'rb') as f:
    raw = f.read()

try:
    # Essai 1 : le fichier est du latin-1 contenant du UTF-8 mal décodé
    content = raw.decode('utf-8')
    # Si on voit encore des Ã© on tente la correction
    if 'Ã©' in content or 'Ã´' in content:
        content = content.encode('latin-1').decode('utf-8', errors='replace')
except Exception:
    content = raw.decode('latin-1')
    content = content.encode('latin-1').decode('utf-8', errors='replace')

NAV_BAR = '''<nav id="main-nav" style="position:fixed;top:0;left:0;right:0;z-index:9999;background:#0D1B4B;height:42px;display:flex;align-items:center;padding:0 20px;gap:8px;box-shadow:0 2px 8px rgba(0,0,0,.35);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif">
  <img src="public/images/logos/WPP-Media-logo-2.png" alt="WPP Media" style="height:26px" onerror="this.style.display=\'none\'">
  <div style="width:1px;height:24px;background:rgba(255,255,255,.2);margin:0 6px"></div>
  <a href="dashboard.html" style="padding:4px 14px;border-radius:20px;background:transparent;color:rgba(255,255,255,.55);text-decoration:none;font-size:12px;font-weight:600;transition:all .15s" onmouseover="this.style.color=\'#fff\'" onmouseout="this.style.color=\'rgba(255,255,255,.55)\'">Suivi Produits</a>
  <a href="audit_flux.html" style="padding:4px 14px;border-radius:20px;background:transparent;color:rgba(255,255,255,.55);text-decoration:none;font-size:12px;font-weight:600;transition:all .15s" onmouseover="this.style.color=\'#fff\'" onmouseout="this.style.color=\'rgba(255,255,255,.55)\'">Audit de flux</a>
  <a href="competitivite_prix.html" style="padding:4px 14px;border-radius:20px;background:transparent;color:rgba(255,255,255,.55);text-decoration:none;font-size:12px;font-weight:600;transition:all .15s" onmouseover="this.style.color=\'#fff\'" onmouseout="this.style.color=\'rgba(255,255,255,.55)\'">Compétitivité prix</a>
  <a href="local_castorama.html" style="padding:4px 14px;border-radius:20px;background:transparent;color:rgba(255,255,255,.55);text-decoration:none;font-size:12px;font-weight:600;transition:all .15s" onmouseover="this.style.color=\'#fff\'" onmouseout="this.style.color=\'rgba(255,255,255,.55)\'">Local Castorama</a>
  <a href="mesure_efficacite.html" style="padding:4px 14px;border-radius:20px;background:rgba(255,255,255,.15);color:#fff;text-decoration:none;font-size:12px;font-weight:600">Mesure d\'efficacité</a>
</nav>
<style>#map{top:42px !important;bottom:0;left:0;right:0;position:absolute}.panel-header{top:62px}.panel-filters{top:62px}.panel-top{top:62px}</style>
'''

# Injection de la nav après <body>
if '<body>' in content:
    content = content.replace('<body>', '<body>\n' + NAV_BAR, 1)
elif '<body ' in content:
    idx = content.index('<body ')
    end = content.index('>', idx)
    content = content[:end+1] + '\n' + NAV_BAR + content[end+1:]
else:
    content = NAV_BAR + content

# Mise à jour du titre
content = re.sub(r'<title>.*?</title>', '<title>Mesure d\'efficacité — Brico Dépôt | WPP Media</title>', content)

out = 'mesure_efficacite.html'
with open(out, 'w', encoding='utf-8') as f:
    f.write(content)

size_kb = os.path.getsize(out) // 1024
print(f'[OK] {out} créé ({size_kb} KB)')
print('Lance serve.bat puis ouvre http://localhost:3000/mesure_efficacite.html')
