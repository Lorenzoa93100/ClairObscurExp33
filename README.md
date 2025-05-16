# Clair Obscur: Combat Simulator

Une petite base de simulateur de combat en boucle, inspirée de **Clair Obscur: Expedition 33** et des simulateurs de combats type Sans (Undertale).

## Fonctionnalités

- Boucle infinie de boss fight : le combat recommence automatiquement quand le joueur ou le boss est vaincu.
- Système de points de vie et barres de vie dynamiques (player & boss).
- Mécaniques basiques : déplacement, esquive de projectiles ennemis, attaque au corps-à-corps (touche `Espace`).
- Implémenté avec **Phaser.js** : structure de scènes claire (`BootScene`, `BattleScene`).
- Code commenté et facilement extensible pour ajouter de nouvelles attaques, animations ou combattants.

## Hébergement sur GitHub Pages

1. Crée un nouveau repository GitHub et place tous les fichiers (`index.html`, `style.css`, `main.js`, `README.md`).
2. Active GitHub Pages depuis les **Settings > Pages** sur la branche `main` (dossier racine).
3. Une fois déployé, l'URL GitHub Pages servira directement le jeu.

## Structure

```
clairObscurExp33/
├── index.html    # Page principale
├── style.css     # Styles UI et fond
├── main.js       # Logique Phaser.js
└── README.md     # Infos & instructions
```

## Personnalisation

- **Sprites** : remplace les URLs dans `BootScene.preload()` par tes propres images (hébergées ou dans un dossier `assets/`).
- **Attaques boss** : modifie `bossAttack()` pour créer différents patterns de projectiles.
- **Mouvements joueur** : ajuste la vitesse dans `handlePlayerMovement()`.
- **Dégâts / HP** : change `playerMaxHP`, `bossMaxHP`, et valeurs de dégâts.

Amuse-toi bien !
