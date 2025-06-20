# Les réponses

Les réponses fournies par les API INSEE Sirene peuvent être de deux types : une réponse unitaire ou une collection.

## Réponse unitaire

Les réponses unitaires (`LuFiipe\InseeSierene\Response\Response`) sont structurées en 2 parties qui peuvent être consultées avec les méthodes :
- `getHeader()` : Le header (à ne pas confondre avec l'en-tête http ni l'en-tête de réponse) qui contient le code retour et le message d'erreur.
- `getBody()` : Le corps qui contient les informations relatives d'une unité légale ou d'un établissement.
- `get()` : qui est un alias de `getBody()`.

Exemple:

```php
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');
$legalUnit = $sirene->siren('120027016')->getBody();

// Informations d'une unité légale
var_dump($legalUnit->getBody());
```

### Header

La partie header, contient le code retour et le message d'erreur.
- `getStatus()` : Code status de l'erreur.
- `getMessage()` : Message de l'erreur.

## Collection

Une collection (`LuFiipe\InseeSierene\Response\Collection`) permet de parcourir les éléments d'un résultat, soit par itération, soit manuellement à l'aide d'un ensemble de méthodes dédiées.

### Par itération

Les résultats sont parcourus par itération à l'aide de la méthode `each()`, qui applique une closure à chaque élément.

La closure prenant quatre arguments, ordonnés de la manière suivante : 
- `array` `$item` : Les données d'une unité légale ou d'un établissement.
- `int` `$key` : N° de l'offset en cours.
- `LuFiipe\InseeSierene\Response\Pagination` `$pagination` : Instance de la pagination en cours.
- `LuFiipe\InseeSierene\Response\Header` `$header` : Instance de l'header en cours.

```php
$collection->each(function (array $item, int $key, Pagination $pagination, Header $header) {
    // ...
});
```

Vous pouvez arrêter l'itération des éléments à tout moment en retournant `false` depuis votre closure :

```php
$collection->each(function (array $item) {
    if (/* condition */) {
        return false;
    }
});
```

### Manuellement

Le parcours des résultats en manuel se fait avec le jeu de méthodes suivantes:
- `firstPage()` : Renvoie la première page. *Remarque* : si un offset est spécifié dans la requête, la première page commencera à partir de cet offset.
- `nextPage()` : Renvoie la page suivante.
- `previousPage()` : Renvoie la page précédente.
- `lastPage()` : Renvoie la page dernière page.
- `count()` : Renvoie le nombre total d'éléments dans la collection.

Les méthodes `firstPage()`, `nextPage()`, `previousPage()` et `lastPage()` retournent une instance de `LuFiipe\InseeSierene\Response\ResponsePaginated`.

`ResponsePaginated` partage le même principe d'utilisation que `Response`, sauf pour les points suivants :
- Elle inclut des informations de pagination accessibles via la méthode `getPagination()`,
- Et la méthode `getBody()` retourne l'ensemble des éléments contenus dans une page.

Exemple 1 : Pagination manuelle :

```php
use LuFiipe\InseeSierene\Parameters\SearchParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

// Recherche les établissements INSEE créés le 01/09/2016
$parameters = (new SearchParameters)
    ->setQuery('siren:120027016 AND dateCreationEtablissement:2016-09-01')
    ->setFields(['siret'])
    ->addSort('siret')
    ->setPerPage(5);
$collection = $sirene->searchEstablishments($parameters);

// 30 éléments
$collection->count();

// Débute à la page N° 1
$collection->firstPage();

// Continue sur la page N° 2
$collection->nextPage();

// Continue sur la page N° 3
$collection->nextPage();

// Reviens sur la page N° 2
$collection->previousPage();

// Passe à la dernière page
$collection->lastPage();
```

Exemple 2 : Si un offset est défini dans la requête, la pagination commencera à partir de cet offset.

```php
// Recherche les établissements INSEE créés le 01/09/2016
$parameters = (new SearchParameters)
    ->setQuery('siren:120027016 AND dateCreationEtablissement:2016-09-01')
    ->setFields(['siret'])
    ->addSort('siret')
    ->setPerPage(5)
    ->setOffset(12);
$collection = $sirene->searchEstablishments($parameters);

// Débute à la page N°1, mais en ignorant les 12 premiers éléments
$collection->firstPage();
```

Exemple 3 : Aperçu de l'utilisation d'une instance de `ResponsePaginated`

```php
// Recherche les établissements INSEE
$parameters = (new SearchParameters)
    ->setQuery('siren:120027016')
    ->setPerPage(5);
$collection = $sirene->searchEstablishments($parameters);

// Débute à la page N°1
$result = $collection->firstPage();

// Code de statut HTTP de la réponse
$result->getHeader()->getStatus();

// Informations de pagination pour la première page
$pagination = $result->getPagination();

// Nombre total d'établissements trouvés
$pagination->getTotal();

// Position actuelle dans les résultats (offset)
$pagination->getOffset();

// Liste des 5 premiers établissements trouvés
$result->getBody();
```
