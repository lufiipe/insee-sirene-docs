# Liens de succession

La recherche multicritères de liens de succession se fait avec la methode `LuFiipe\InseeSierene\Sirene::searchEstablishmentsSuccessions()`.

Puis en passant une instance de `LuFiipe\InseeSierene\Parameters\SuccessionLinksParameters` qui permet:
- D'effectuer des requêtes avec la méthode `setQuery()`.
- Trier les résulats avec `addSort()`.
- De limiter les résultats avec `setPerPage()` ou de débuter la pagination depuis un index avec `setOffset()`.
- Utiliser la pagination profonde avec `withCursor()`.

Les recherches multicritères de liens de succession retournent une instance de [LuFiipe\InseeSierene\Response\Collection](responses.md#collection) avec laquelle on peut parcourir les résultats par itération avec `each()` ou manuellement avec des méthodes comme `firstPage()`, `nextPage()`, `previousPage()` et `lastPage()`.

## Requête

Les requêtes multicritères se font avec la méthode `setQuery()`.

Exemple de recherche avec l'établissement successeur du siret 31300257800042 :

```php
use LuFiipe\InseeSierene\Parameters\SuccessionLinksParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

$parameters = (new SuccessionLinksParameters)
    ->setQuery('siretEtablissementPredecesseur:31300257800042');

$sirene->searchEstablishmentsSuccessions($parameters);
```

### Elimination

Il est possible de construire une requête en recherchant tous les établissements qui n'ont pas une caractéristique en utilisant le caractère " - ".

Exemple avec la recherche de tous les liens de succession sans transferts de siège :

```php
use LuFiipe\InseeSierene\Parameters\SuccessionLinksParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

$parameters = (new SuccessionLinksParameters)
    ->setQuery('-continuiteEconomique:true');

$sirene->searchEstablishmentsSuccessions($parameters);
```

### Opérateurs AND, OR

Les mots clés AND et OR sont autorisés et peuvent être combinés avec des parenthèses ; sans parenthèses le AND prévaut sur le OR.

Exemple avec la recherche de tous les liens de succession avec l'établissement 53331016500022 comme successeur, pour lesquels il y a continuité économique : 

```php
use LuFiipe\InseeSierene\Parameters\SuccessionLinksParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

$parameters = (new SuccessionLinksParameters)
    ->setQuery('siretEtablissementSuccesseur:53331016500022 AND continuiteEconomique:true');

$sirene->searchEstablishmentsSuccessions($parameters);
```

### Requête sur les variables de type date

Les variables dates requêtables sont *dateLienSuccession* et *dateDernierTraitementLienSuccession*.

```php
use LuFiipe\InseeSierene\Parameters\SuccessionLinksParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

$parameters = (new SuccessionLinksParameters)
    ->setQuery('dateLienSuccession:2019-02-02');

$sirene->searchEstablishmentsSuccessions($parameters);
```

::: tip Pour plus d'info voir : Documentation API Sirene
[Recherche sur les liens de succession](https://www.sirene.fr/static-resources/documentation/multi_ls_q_311.html)
:::

## Tri

Par défaut, les résultats sont triés par *siretEtablissementPredecesseur*. La seule autre possibilité est le tri par *siretEtablissementSuccesseur*.
- `SortInterface::SORT_SIRET_ETABLISSEMENT_PREDECESSEUR` : trie par *siretEtablissementPredecesseur*.
- `SortInterface::SORT_SIRET_ETABLISSEMENT_SUCCESSEUR` : trie par *siretEtablissementSuccesseur*.

Exemple de tri *siretEtablissementSuccesseur* :

```php
use LuFiipe\InseeSierene\Parameters\Contracts\SortInterface;
use LuFiipe\InseeSierene\Parameters\SuccessionLinksParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

$parameters = (new SuccessionLinksParameters)
    ->setQuery('transfertSiege:true')
    ->addSort(SortInterface::SORT_SIRET_ETABLISSEMENT_SUCCESSEUR);

$sirene->searchEstablishmentsSuccessions($parameters);
```

## Paginations

Tous les résultats des recherches multicritères sont renvoyés par page. La pagination peut se faire de manière classique avec une `limit` et un `offset`. Ou en utilisant un système de `curseur`.

### Limit, Offset

- `setPerPage()` Permet d'indiquer le nombre d'éléments à retourner par page.
- `setOffset()` Permet d'indiquer le rang de classement du premier élément à retourner sur la page.

Exemple en limitant la pagination à 8 éléments par page et en débutant la pagination à l'index N° 4 :

```php
use LuFiipe\InseeSierene\Parameters\SuccessionLinksParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

$parameters = (new SuccessionLinksParameters)
    ->setQuery('continuiteEconomique:true')
    ->setPerPage(8)
    ->setOffset(4);
```

### Curseur

Si vous désirez parcourir un grand nombre de résultats, notamment pour obtenir des résultats au-delà de la limite indiquée dans le tableau (1000), il est fortement recommandé d'utiliser des curseurs.

Exemple de recherche avec tous les liens de succession enregistrés entre le 20 et le 22 décembre 2020 : 

```php
use LuFiipe\InseeSierene\Parameters\SuccessionLinksParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

$parameters = (new SuccessionLinksParameters)
    ->setQuery('dateLienSuccession:[2020-12-20 TO 2020-12-22]')
    ->setPerPage(1000)
    ->withCursor();
```

::: tip Pour plus d'info voir : Documentation API Sirene
[Liens de succession : résultat et pagination](https://www.sirene.fr/static-resources/documentation/multi_ls_resultat_311.html)
:::
