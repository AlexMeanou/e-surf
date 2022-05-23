# Lancement de l'application

Afin de lancer ce projet il vous faudra passer par 3 étapes de préparation :

## Lancer la BDD

Il vous faudra télécharger mongodb si vous ne le possédez pas déjà. Voici comment faire si tel est le cas :

Télécharger l'archive via l'adresse suivante : https://www.mongodb.com/try/download/community avant de l'extraire à la racine de votre projet

Ensuite aller à la racine du projet et exécuter ces commandes :

    mkdir PFE
    ./mongodb/bin/mongod --dbpath ./PFE/


## Lancer l'api

Dans un terminal à part, aller dans le dossier s'appelant `api` et exécuter les commandes suivantes :

    
    pip install -r ../requirement.txt
    uvicorn main:app

## Lancer l'application angular

Dans un terminal à part, placer vous à la racine du projet et lancer les commandes suivantes :

    npm install
    npm start

## Accéder à votre application

A ce stade vous posséder une application fonctionelle accessible à l'adresse suivante : http://localhost:4200


<br><br><br> <hr>

# Compte Rendu

## Technologies utilisées

Afin de réaliser ce projet, je me suis servi de plusieurs technologies que nous avons brièvement abordées en cours cette année. En effet :

- La BDD présente est en MongoDB donc en NoSQL contrairement au SQL classique dont je me servais avant en cours et toujours à l'heure actuelle au travail.

- Il y a une API FastAPI permettant de gérer le "back" de mon application, c'est-à-dire la communication avec ce que l'on voit affiché à l'écran et l'endroit on l'on va prendre les données (BDD ou scrapping dans ce cas-ci).

- Les tokens JWT sont utilisés dans l'application afin de sécuriser l'authentification ainsi que certains endpoints de mon API bloquant ainsi les utilisateurs non identifiés d'accéder aux données.

- Le Front est en Angular / TypeScript, ce fut un choix un peu "stratégique". J'avais le choix entre vueJS et angular (2 des langages vus cette année) si je souhaitais améliorer mon niveau. Ayant réalisé le dernier projet en vueJS j'ai décidé de partir sur Angular afin de me remettre a jour et par soucis de temps également. En effet, selon ma vision, il est plus rapide de coder en angular qu'en VueJs, le choix fût donc vite fait.

- Afin de réaliser le scrapping, je me suis servi de la librairie Selenium et de l'outil logiciel Chromium, ces choix seront expliqués dans les difficultés rencontrées. Je me suis également servis de BeautifulSoup en combinaison de Chromium et Selenium afin d'extraire les données clés des balises du code source.

<br><hr>

## Difficultés rencontrés

Au cours du développement de mon application, j'ai rencontré quelques obstacles qui m'ont parfois pris beaucoup de temps à résoudre, mais c'est un des aspects du développement qui me plais, car ça me force à me pousser et à réfléchir de manière différente.

Le premier obstacle rencontré fut dès les premiers jours. J'ai commencé par réaliser un tuto de scrapping web ce qui m'a permis de me remettre à jour sur le scrapping. Ensuite j'ai cherché quel site j'allais scrapper afin d'obtenir mes données météorologiques, et après l'avoir trouvé, j'ai répliqué les mêmes méthodes revues dans le tuto et le TP réalisé dans l'année. Malheureusement ce ne s'est pas bien passé, je n'arrivais pas du tout à récupérer les données que je souhaitais, malgré le fait quelles étaient bel et bien présentes dans le code source de la page internet. Après avoir recherché d'où venait le problème, je me suis rendu compte que le code source que je récupérais ne possédais pas les données provenant du Javascript du site, et dans ce cas-là, il s'agissait des données météo dont j'avais besoin. Je suis donc parti chercher d'autres méthodes pour obtenir le code source d'un site web, et après avoir testé des librairie tel que *Request*, *urrlib* ou *Scrappy*, j'ai finalement trouvé la combinaison de **selenium** et **chromium**. 
<br>

Le second obstacle fut lors de l'implémentation de la gallerie photo. Mon idée de départ était de convertir les images en base64 et stocker le résultat en BDD, malheureusement cela n'était pas le plus optimal car ça me forcer à *Sanitize* les images et j'ai rencontré plusieurs difficultés au cours du développement. J'ai donc décidé de partir sur une autre idée et de directement stocker les images sur le serveur (ici, il s'agit du pc) et de stocker en BDD le path de ces photos afin d'ensuite pouvoir les afficher à l'écran.

<br> <hr>

## Amélioration possible 

J'ai pensé à plusieurs améliorations possibles de mon application que je n'ai malheureusement pas pu implémenter par manque de temps ou par complexité.

- Automatiser le scrapping en le planifiant plusieurs fois par jour et stocker les données récupérées en BDD afin qu'elles soient accessibles à tout moment sans avoir à attendre.

- Récupérer et combiner les données de plusieurs sites météorologiques afin d'avoir des résultats plus précis et plus de données disponibles

- Docker-iser l'application afin de simplifier le processus de lancement de l'application, on serait passé de trois étapes à seulement une. Cela aurait rendu l'application plus facile à lancer sur différents PC.

<br><hr>

# Conclusion 

Ce projet fut très enrichissant et m'a permis de consolider mes connaissances dans de nombreux domaines ce qui je suis sure me sera grandement utile au cours de ma vie professionnelle. 

J'ai également grandement apprécié la phase de recherche, au cours de laquelle mes amis et collègues surfeurs m'ont beaucoup appris sur le monde du surf et ont suivis l'évolution de mon application.