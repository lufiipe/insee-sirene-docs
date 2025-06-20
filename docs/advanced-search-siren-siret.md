# Recherche d'unités légales ou d'établissements

La recherche multicritères d'unités légales ou d'établissements se fait avec une instance de `LuFiipe\InseeSierene\Sirene`, en utilisant les méthodes suivantes :
- `searchLegalUnits()` : Recherche multicritères d'unités légales.
- `searchEstablishments()` : Recherche multicritères d'établissements.

Puis en passant une instance de `LuFiipe\InseeSierene\Parameters\SearchParameters` qui permet de :
- Effectuer des requêtes avec la méthode `setQuery()`.
- Appliquer les critères de recherche sur les champs historisés avec `setDate()`.
- Filtrer les attributs d'une unité légale ou d'un établissement retourné par l'api SIRENE avec `setFields()` et `setHideNull()`.
- Trier les résulats avec `addSort()`.
- Limiter les résultats avec `setPerPage()` ou débuter la pagination depuis un index avec `setOffset()`.
- Utiliser la pagination profonde avec `withCursor()`.

Les recherches multicritères d'unité légale ou d'établissement retournent une instance de [LuFiipe\InseeSierene\Response\Collection](responses.md#collection) avec lequel on peut parcourir les résultats par itération avec `each()` ou manuellement avec des méthodes comme `firstPage()`, `nextPage()`, `previousPage()` et `lastPage()`.

## Requête

Les requêtes multicritères se font avec la méthode `setQuery()`.

### Variable non-historisée

Exemple de recherche d'établissements avec la commune de Malakoff (code commune=92046) :

```php
use LuFiipe\InseeSierene\Parameters\SearchParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

$parameters = (new SearchParameters)
    ->setQuery('codeCommuneEtablissement:92046');

$collection = $sirene->searchEstablishments($parameters);
```

Exemple de recherche d'unités purgées :

```php
use LuFiipe\InseeSierene\Parameters\SearchParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

$parameters = (new SearchParameters)
    ->setQuery('unitePurgeeUniteLegale:true');

$collection = $sirene->searchLegalUnits($parameters);
```

::: tip Pour plus d'info voir : Documentation API Sirene
[Recherche sur une variable non-historisée](https://www.sirene.fr/static-resources/documentation/multi_histo_non_histo_311.html)
:::

### Variable historisée

Exemple de recherche d'unités légales dont la dénomination contient ou a contenu le mot GAZ :

```php
use LuFiipe\InseeSierene\Parameters\SearchParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

$parameters = (new SearchParameters)
    ->setQuery('periode(denominationUniteLegale:GAZ)');

$collection = $sirene->searchLegalUnits($parameters);
```

Exemple de recherche d'établissements dont le code de l'activité principale a été ou est 33.01 :

```php
use LuFiipe\InseeSierene\Parameters\SearchParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

$parameters = (new SearchParameters)
    ->setQuery('periode(activitePrincipaleEtablissement:33.01)');

$collection = $sirene->searchEstablishments($parameters);
```

::: tip Pour plus d'info voir : Documentation API Sirene
[Recherche sur une variable historiséee](https://www.sirene.fr/static-resources/documentation/multi_histo_non_histo_311.html)
:::

### Elimination

Il est possible de construire une requête en recherchant tous les établissements qui n'ont pas une caractéristique en utilisant le caractère " - ". 

Exemple avec la recherche de tous les établissements dont l'unité légale est considérée comme une personne morale :

```php
use LuFiipe\InseeSierene\Parameters\SearchParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

$parameters = (new SearchParameters)
    ->setQuery('-categorieJuridiqueUniteLegale:1000');

$collection = $sirene->searchEstablishments($parameters);
```

::: tip Pour plus d'info voir : Documentation API Sirene
[Recherche par élimination](https://www.sirene.fr/static-resources/documentation/multi_elimination_311.html)
:::

### Opérateurs AND, OR

Exemple de recherche d'établissements ayant comme dénomination "INSEE" :

```php
use LuFiipe\InseeSierene\Parameters\SearchParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

$query = str_replace(
    '%VAR%',
    'INSEE',
    '(raisonSociale:"%VAR%" OR (prenom1UniteLegale:"%VAR%" AND nomUniteLegale:"%VAR%") OR (prenom1UniteLegale:"%VAR%" AND nomUniteLegale:"%VAR%"))',
);

$parameters = (new SearchParameters)
    ->setQuery($query);

$collection = $sirene->searchEstablishments($parameters);
```

::: tip Pour plus d'info voir : Documentation API Sirene
[Requête sur plusieurs variables](https://www.sirene.fr/static-resources/documentation/multi_plusieurs_variables_311.html)
:::

### Utilisation de caractères spéciaux

#### "*" remplace une chaîne de caractères de taille quelconque

Exemple de recherche d'établissements dont l'activité principale commence par 8 :

```php
use LuFiipe\InseeSierene\Parameters\SearchParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

$parameters = (new SearchParameters)
    ->setQuery('activitePrincipaleUniteLegale:8*');

$collection = $sirene->searchEstablishments($parameters);
```

#### "?" remplace exactement un caractère

Exemple de recherche d'établissements dont l'unité légale a un sigle sur 3 positions :

```php
use LuFiipe\InseeSierene\Parameters\SearchParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

$parameters = (new SearchParameters)
    ->setQuery('sigleUniteLegale:???');

$collection = $sirene->searchLegalUnits($parameters);
```

#### "~" recherche approximative

Exemple de recherche d'établissements dont l'unité légale a comme *prenom1UniteLegale* "MICKAEL" à deux caractères près, mais pas exactement "MICKAEL" :

```php
use LuFiipe\InseeSierene\Parameters\SearchParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

$parameters = (new SearchParameters)
    ->setQuery('prenom1UniteLegale:MICKAEL~ AND -prenom1UniteLegale:MICKAEL');

$collection = $sirene->searchEstablishments($parameters);
```

::: tip Pour plus d'info voir : Documentation API Sirene
- [Utilisation de caractères spéciaux : « * » et « ? »](https://www.sirene.fr/static-resources/documentation/multi_car_speciaux_311.html)
- [Utilisation du caractère spécial « ~ » : recherche approximative](https://www.sirene.fr/static-resources/documentation/multi_car_speciaux2_311.html)
:::

### Requête sur une plage de valeurs

Exemple de recherche d'établissements de médecins généralistes dont le nombre de périodes va de 12 à 20 (inclus) :

```php
use LuFiipe\InseeSierene\Parameters\SearchParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

$parameters = (new SearchParameters)
    ->setQuery('categorieJuridiqueUniteLegale:1000 AND activitePrincipaleUniteLegale:86.21Z AND nombrePeriodesEtablissement:[12 TO 20]');

$collection = $sirene->searchEstablishments($parameters);
```

::: tip Pour plus d'info voir : Documentation API Sirene
[Requête sur une plage de valeurs](https://www.sirene.fr/static-resources/documentation/multi_plages_311.html)
:::

### Requête sur les variables de type date

Exemple de recherche de toutes les unités légales qui ont eu un changement de dénomination l'année 2017 :

```php
use LuFiipe\InseeSierene\Parameters\SearchParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

$parameters = (new SearchParameters)
    ->setQuery('periode(changementDenominationUniteLegale:true AND dateDebut:2017)');

$collection = $sirene->searchLegalUnits($parameters);
```

::: tip Pour plus d'info voir : Documentation API Sirene
[Requête sur les variables de type date](https://www.sirene.fr/static-resources/documentation/multi_variables_dates_311.html)
:::

## Requête sur les champs historisés

`setDate()` permet d'appliquer les critères de recherche sur les champs historisés.

Exemple de recherche d'établissements de Malakoff dont l'*activitePrincipaleEtablissement* est 56.10A (restauration traditionnelle) et actifs au 01/01/2018 :

```php
use LuFiipe\InseeSierene\Parameters\SearchParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

$parameters = (new SearchParameters)
    ->setQuery('periode(etatAdministratifEtablissement:A AND activitePrincipaleEtablissement:56.10A) AND codeCommuneEtablissement:92046')
    ->setDate(new DateTime('2018-01-01'));

$collection = $sirene->searchEstablishments($parameters);
```

## Filtres

Avec `LuFiipe\InseeSierene\Parameters\SearchParameters` il est aussi possible de filtrer les attributs des unités légales ou des établissements retournés par l'api SIRENE.

- `setFields()` : Liste des champs demandés.
- `setHideNull()` : Masque (true) ou affiche (false, par défaut) les attributs qui n'ont pas de valeur.

Exemple qui affiche uniquement les attributs *denominationUniteLegale* et *economieSocialeSolidaireUniteLegale* :

```php
use LuFiipe\InseeSierene\Parameters\SearchParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

$parameters = (new SearchParameters)
    ->setQuery('periode(denominationUniteLegale:INSEE)')
    ->setFields(['denominationUniteLegale', 'economieSocialeSolidaireUniteLegale']);

$collection = $sirene->searchLegalUnits($parameters);
```

Exemple qui cache les attributs `Null` du siret 12002701600563 :

```php
use LuFiipe\InseeSierene\Parameters\SearchParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

$parameters = (new SearchParameters)
    ->setQuery('raisonSociale:INSEE')
    ->setHideNull(true);

$collection = $sirene->searchEstablishments($parameters);
```

::: tip Pour plus d'info voir : Documentation API Sirene
[Requête avec le paramètre date](hhttps://www.sirene.fr/static-resources/documentation/multi_parametre_date_311.html)
:::

## Tri

Permet de trier les élements d'un résultat. Il est possible de trier les données sur un ou plusieurs attributs, par ordre ascendant ou descendant.
- `SortInterface::SORT_ORDER_ASC` : ordre ascendant.
- `SortInterface::SORT_ORDER_DESC` : ordre descendant.

Exemple de recherche d'unités légales ayant exactement "wilfrid" en premier prénom et dont le deuxième prénom commence par un "e", triée sur le deuxième prénom (tri ascendant par défaut) puis le siren en descendant :

```php
use LuFiipe\InseeSierene\Parameters\Contracts\SortInterface;
use LuFiipe\InseeSierene\Parameters\SearchParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

$parameters = (new SearchParameters)
    ->setQuery('prenom1UniteLegale:"wilfrid" AND prenom2UniteLegale:e*')
    ->addSort('prenom2UniteLegale')
    ->addSort('siren', SortInterface::SORT_ORDER_DESC);
```

::: tip Pour plus d'info voir : Documentation API Sirene
[Pagination des résultats : paramètres debut, nombre, tri](https://www.sirene.fr/static-resources/documentation/multi_pagination_311.html)
:::

## Paginations

Tous les résultats des recherches multicritères sont renvoyés par page. La pagination peut se faire de manière classique avec une `limit` et un `offset`. Ou en utilisant un système de `curseur`.

### Offset, PerPage

- `setPerPage()` Permet d'indiquer le nombre d'éléments à retourner par page.
- `setOffset()` Permet d'indiquer le rang de classement du premier élément à retourner sur la page.

Exemple en limitant la pagination à 4 éléments par page et en débutant la pagination à l'indexe N° 2 :

```php
use LuFiipe\InseeSierene\Parameters\SearchParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

$parameters = (new SearchParameters)
    ->setQuery('periode(denominationUniteLegale:"METEO-FRANCE")')
    ->setPerPage(4)
    ->setOffset(2);
```

### Curseur

Si vous désirez parcourir un grand nombre de résultats, notamment pour obtenir des résultats au-delà de la limite indiquée dans le tableau (1000), il est fortement recommandé d'utiliser des curseurs.

Exemple de recherche de tous les établissements actifs des associations et assimilés (catégorie juridique commençant par 92) du 1er arrondissement de Paris.

```php
use LuFiipe\InseeSierene\Parameters\SearchParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

$parameters = (new SearchParameters)
    ->setQuery('periode(etatAdministratifEtablissement:A) AND categorieJuridiqueUniteLegale:92* AND codeCommuneEtablissement:75101')
    ->setPerPage(1000)
    ->withCursor();
```

::: tip Pour plus d'info voir : Documentation API Sirene
[Pagination des résultats : utilisation du paramètre curseur](https://www.sirene.fr/static-resources/documentation/multi_pagination_curseur_311.html)
:::
