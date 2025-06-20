# Documentation de la bibliothèque PHP INSEE Sirene

[lufiipe/insee-sierene](https://github.com/lufiipe/insee-sierene) Permet d'interroger le répertoire Sirene des entreprises et des établissements, géré par l'Insee.

Avec ce package, vous pouvez utiliser entre autres :

- :white_check_mark: Recherche multicritères
- :white_check_mark: Facettes
- :white_check_mark: Parcours des résultats
- :white_check_mark: API Rate Limiting
- :white_check_mark: Events

## Prérequis

Pour accéder à une API de l'Insee, vous devez disposer d'une clé d'API. Veuillez suivre les étapes détaillées sur la page [Connexion à l'API Sirene - Mode d'emploi](https://portail-api.insee.fr/catalog/api/2ba0e549-5587-3ef1-9082-99cd865de66f/doc?page=85c5657d-b1a1-4466-8565-7db1a194667b) afin d'obtenir votre clé.

## Installation

```shell
composer require lufiipe/insee-sierene
```

## Utilisation rapide

```php
require_once "vendor/autoload.php";
use LuFiipe\InseeSierene\Exception\SireneException;
use LuFiipe\InseeSierene\Parameters\SearchParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

// Détail d'une unité légale depuis un numéro Siren
$sirene->siren('120027016')->getBody();

// Détail d'un établissement depuis un numéro Siret
$sirene->siret('12002701600563')->getBody();

// Recherche les unités légales dont la dénomination contient ou a contenu le nom "INSEE"
$parameters = (new SearchParameters)
    ->setQuery('periode(denominationUniteLegale:INSEE)');
$collection = $sirene->searchLegalUnits($parameters);
$collection->each(function (array $legalUnit) {
    var_dump($legalUnit);
});

// Recherche les établissements ayant comme dénomination "WWF"
$parameters = (new SearchParameters)
    ->setQuery('denominationUniteLegale:"WWF"');
$collection = $sirene->searchEstablishments($parameters);
$collection->each(function (array $establishment) {
    var_dump($establishment);
});

// Etat du service INSEE Sirene
try {
    $res = $sirene->informations();
} catch (SireneException $e) {
    // ../..
}
```

## Liens

 - [Documentation API Sirene](https://portail-api.insee.fr/catalog/api/2ba0e549-5587-3ef1-9082-99cd865de66f/doc)
 - [Connexion à l'API Sirene - Mode d'emploi](https://portail-api.insee.fr/catalog/api/2ba0e549-5587-3ef1-9082-99cd865de66f/doc?page=85c5657d-b1a1-4466-8565-7db1a194667b)