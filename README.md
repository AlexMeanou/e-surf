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
