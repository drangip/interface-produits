import urllib.request
import ssl
import os
import sys

os.makedirs('lib', exist_ok=True)

def is_valid_js(path):
    """Verifie que le fichier est bien du JS et non une page HTML d'erreur"""
    if not os.path.exists(path):
        return False
    size = os.path.getsize(path)
    if size < 1000:    # minimum 1 KB (react.min.js fait ~10 KB)
        return False
    try:
        with open(path, 'rb') as f:
            header = f.read(50).decode('utf-8', errors='ignore').strip()
        # HTML error page = commence par <, JS valide par /, !, (, * etc.
        return not (header.startswith('<!') or header.lower().startswith('<html'))
    except Exception:
        return False

def download(url, path):
    print(f'    -> {url}')
    # Tentative normale
    try:
        urllib.request.urlretrieve(url, path)
        return True
    except Exception:
        pass
    # Fallback : SSL sans verification (proxy d'entreprise avec cert custom)
    try:
        ctx = ssl._create_unverified_context()
        with urllib.request.urlopen(url, context=ctx) as r:
            with open(path, 'wb') as f:
                f.write(r.read())
        return True
    except Exception as e:
        print(f'       Erreur: {e}')
        return False

LIBS = [
    ('lib/react.min.js', [
        'https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js',
        'https://unpkg.com/react@18.3.1/umd/react.production.min.js',
    ]),
    ('lib/react-dom.min.js', [
        'https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js',
        'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js',
    ]),
    ('lib/prop-types.min.js', [
        'https://cdn.jsdelivr.net/npm/prop-types@15.8.1/prop-types.min.js',
        'https://unpkg.com/prop-types@15.8.1/prop-types.min.js',
    ]),
    ('lib/recharts.js', [
        'https://cdn.jsdelivr.net/npm/recharts@2.6.2/umd/Recharts.js',
        'https://cdn.jsdelivr.net/npm/recharts@2.12.7/umd/Recharts.js',
        'https://unpkg.com/recharts@2.6.2/umd/Recharts.js',
        'https://unpkg.com/recharts@2.12.7/umd/Recharts.js',
    ]),
    ('lib/babel.min.js', [
        'https://cdn.jsdelivr.net/npm/@babel/standalone@7.24.0/babel.min.js',
        'https://unpkg.com/@babel/standalone@7.24.0/babel.min.js',
    ]),
]

all_ok = True
for path, urls in LIBS:
    if is_valid_js(path):
        kb = os.path.getsize(path) // 1024
        print(f'  [OK] {path} ({kb} KB)')
        continue

    # Supprime le fichier corrompu si present
    if os.path.exists(path):
        os.remove(path)
        print(f'  Fichier invalide supprime, re-telechargement...')
    else:
        print(f'  Telechargement {os.path.basename(path)}...')

    success = False
    for url in urls:
        if download(url, path):
            if is_valid_js(path):
                kb = os.path.getsize(path) // 1024
                print(f'       [OK] {kb} KB')
                success = True
                break
            else:
                print(f'       Fichier invalide (HTML?), essai suivant...')
                if os.path.exists(path):
                    os.remove(path)

    if not success:
        print(f'  [ERREUR] Impossible de telecharger {path}')
        all_ok = False

if all_ok:
    print('\n  Tous les fichiers sont valides!')
    print('  Relancez serve.bat puis ouvrez http://localhost:3000/dashboard.html')
else:
    print('\n  Certains fichiers n\'ont pas pu etre telecharges.')
    print('  Verifiez votre connexion internet ou votre proxy.')
    sys.exit(1)
