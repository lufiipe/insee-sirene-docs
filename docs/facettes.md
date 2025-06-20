# Facettes

Les facettes permettent d'effectuer des comptages. Les facettes sont applicables à un champ, une requête ou un intervalle.

Pour utiliser des facettes lors d'une recherche multicritère, commencez par instancier `LuFiipe\InseeSierene\Parameters\Facet`, puis passez cette instance à la méthode `LuFiipe\InseeSierene\Parameters\SearchParameters::setFacet()`.

## Facettes sur champ

Pour générer des facettes, on doit ajouter le champ à la requête avec `addSetting()` en passant en paramètre `Facet::FACET_SETTING_FIELD` ("champ") suivi du nom du champ.

Exemple : Répartition des personnes physiques par sexe (renseigné) et par état administratif courant :

```php
use LuFiipe\InseeSierene\Parameters\Facet;
use LuFiipe\InseeSierene\Parameters\SearchParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

$facet = (new Facet)
    ->addSetting(Facet::FACET_SETTING_FIELD, 'sexeUniteLegale')
    ->addSetting(Facet::FACET_SETTING_FIELD, 'etatAdministratifUniteLegale');
$parameters = (new SearchParameters)
    ->setQuery('periode(categorieJuridiqueUniteLegale:1000) AND sexeUniteLegale:*')
    ->setDate(new DateTime('2099-12-31'))
    ->setFacet($facet);

$sirene->searchLegalUnits($parameters)->firstPage()->getBody();
```

::: tip Pour plus d'info voir : Documentation API Sirene
[Utilisation des facettes pour les requêtes multicritères](https://www.sirene.fr/static-resources/htm/multi_facettes_311.html)
:::

## Paramétrage des facettes

En complément du paramètre obligatoire `Facet::FACET_SETTING_FIELD` ("champ"), un certain nombre de paramétrages sont possibles :
- `Facet::FACET_SETTING_FIELD_DEBUT` : debut.
- `Facet::FACET_SETTING_FIELD_NOMBRE` : nombre.
- `Facet::FACET_SETTING_FIELD_MIN` : min.
- `Facet::FACET_SETTING_FIELD_TRI` : tri.
- `Facet::FACET_SETTING_FIELD_MANQUANT` : manquant.
- `Facet::FACET_SETTING_FIELD_TOTAL` : total.
- `Facet::FACET_SETTING_FIELD_MODALITE` : modalite.
- `Facet::FACET_SETTING_FIELD_PREFIXE` : prefixe.

### min

En définissant une valeur pour le paramètre `Facet::FACET_SETTING_FIELD_MIN` ("min"), seules les modalités ayant un comptage supérieur ou égal à cette valeur sont pris en compte.

Exemple avec paramètre min :

```php
use LuFiipe\InseeSierene\Parameters\Facet;
use LuFiipe\InseeSierene\Parameters\SearchParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

// Parmi les Sociétés par Actions Simplifiées (SAS), ventilation des établissements par nombre de périodes (compris entre 6 et 15 inclus), sans affichage des comptages inférieurs à 100
$facet = (new Facet)
    ->addSetting(Facet::FACET_SETTING_FIELD, 'categorieJuridiqueUniteLegale')
    ->addSetting(Facet::FACET_SETTING_FIELD, 'nombrePeriodesEtablissement')
    ->addSetting(Facet::FACET_SETTING_FIELD_MIN, 100);
$parameters = (new SearchParameters)
    ->setQuery('categorieJuridiqueUniteLegale:57* AND nombrePeriodesEtablissement:[6 TO 15]')
    ->setFacet($facet)
    ->setOffset(0);
$sirene->searchEstablishments($parameters)->firstPage();
```

Exemple avec paramètre min sur champ :

```php
use LuFiipe\InseeSierene\Parameters\Facet;
use LuFiipe\InseeSierene\Parameters\SearchParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

// Parmi les Sociétés par Actions Simplifiées (SAS), ventilation des établissements par nombre de périodes (compris entre 6 et 15 inclus), sans affichage des comptages de catégories juridiques inférieurs à 100
$facet = (new Facet)
    ->addSetting(Facet::FACET_SETTING_FIELD, 'nombrePeriodesEtablissement')
    ->addSetting(Facet::FACET_SETTING_FIELD_MIN, 100, 'categorieJuridiqueUniteLegale');
$parameters = (new SearchParameters)
    ->setQuery('categorieJuridiqueUniteLegale:57* AND nombrePeriodesEtablissement:[6 TO 15]')
    ->setFacet($facet);
$sirene->searchEstablishments($parameters)->firstPage();
```

::: tip Pour plus d'info voir : Documentation API Sirene
[Utilisation des facettes pour les requêtes multicritères : le paramètre min](https://www.sirene.fr/static-resources/documentation/multi_facette_min_311.html)
:::

### tri

Le paramètre `Facet::FACET_SETTING_FIELD_TRI` ("tri") permet de classer les facettes. Les valeurs possibles sont :
- `Facet::FACET_SETTING_FIELD_DEBUT` : count:desc.
- `Facet::FACET_SETTING_FIELD_TRI_COUNT_ASC` : count:asc.
- `Facet::FACET_SETTING_FIELD_TRI_INDEX_DESC` : index:desc.
- `Facet::FACET_SETTING_FIELD_TRI_INDEX_ASC` : index:asc.

`count` trie par nombre de résultats, `index` par ordre alphabétique.

`desc` ou `asc` représentent l'ordre descendant ou ascendant.

Exemple avec paramètre tri ascendant sur valeurs :

```php
use LuFiipe\InseeSierene\Parameters\Facet;
use LuFiipe\InseeSierene\Parameters\SearchParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

// Comptage des établissements parisiens de personnes physiques, selon l'arrondissement et l'état administratif
$facet = (new Facet)
    ->addSetting(Facet::FACET_SETTING_FIELD, 'etatAdministratifEtablissement')
    ->addSetting(Facet::FACET_SETTING_FIELD_NOMBRE, 20, 'codeCommuneEtablissement')
    ->addSetting(Facet::FACET_SETTING_FIELD_TRI, Facet::FACET_SETTING_FIELD_TRI_INDEX_ASC);
$parameters = (new SearchParameters)
    ->setQuery('categorieJuridiqueUniteLegale:1000 AND codeCommuneEtablissement:75*')
    ->setFacet($facet);
$sirene->searchEstablishments($parameters)->firstPage();
```

Exemple avec paramètre tri ascendant sur valeur pour l'arrondissement et descendant sur les occurrences pour l'état administratif

```php
use LuFiipe\InseeSierene\Parameters\Facet;
use LuFiipe\InseeSierene\Parameters\SearchParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

// Comptage des établissements parisiens de personnes physiques, selon l'arrondissement et l'état administratif
$facet = (new Facet)
    ->addSetting(Facet::FACET_SETTING_FIELD_NOMBRE, 20, 'codeCommuneEtablissement')
    ->addSetting(Facet::FACET_SETTING_FIELD_TRI, Facet::FACET_SETTING_FIELD_TRI_INDEX_ASC, 'codeCommuneEtablissement')
    ->addSetting(Facet::FACET_SETTING_FIELD_TRI, Facet::FACET_SETTING_FIELD_TRI_COUNT_DESC, 'etatAdministratifEtablissement');
$parameters = (new SearchParameters)
    ->setQuery('categorieJuridiqueUniteLegale:1000 AND codeCommuneEtablissement:75*')
    ->setFacet($facet);
$sirene->searchEstablishments($parameters)->firstPage();
```

::: tip Pour plus d'info voir : Documentation API Sirene
[Utilisation des facettes pour les requêtes multicritères : le paramètre tri](https://www.sirene.fr/static-resources/documentation/multi_facette_tri_311.html)
:::

### manquant

Le paramètre `Facet::FACET_SETTING_FIELD_MANQUANT` ("manquant") permet d'afficher le décompte des valeurs manquantes, de manière à compléter les comptages de valeurs pour atteindre exactement le total

Exemple avec paramètre manquant :

```php
use LuFiipe\InseeSierene\Parameters\Facet;
use LuFiipe\InseeSierene\Parameters\SearchParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

// Comptage des établissements de personnes physiques, selon le sexe
$facet = (new Facet)
    ->addSetting(Facet::FACET_SETTING_FIELD, 'sexeUniteLegale')
    ->addSetting(Facet::FACET_SETTING_FIELD_MANQUANT, true);
$parameters = (new SearchParameters)
    ->setQuery('categorieJuridiqueUniteLegale:1000')
    ->setFacet($facet);
$sirene->searchEstablishments($parameters)->firstPage();
```

::: tip Pour plus d'info voir : Documentation API Sirene
[Utilisation des facettes pour les requêtes multicritères : le paramètre manquant](https://www.sirene.fr/static-resources/documentation/multi_facette_manquant_311.html)
:::

### total

Le paramètre `Facet::FACET_SETTING_FIELD_TOTAL` ("total") permet d'afficher la somme des comptages de valeurs, sans les valeurs manquantes.

Exemple avec paramètre total :

```php
use LuFiipe\InseeSierene\Parameters\Facet;
use LuFiipe\InseeSierene\Parameters\SearchParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

// Comptage des établissements de personnes physiques, selon le sexe
$facet = (new Facet)
    ->addSetting(Facet::FACET_SETTING_FIELD, 'sexeUniteLegale')
    ->addSetting(Facet::FACET_SETTING_FIELD_TOTAL, true);
$parameters = (new SearchParameters)
    ->setQuery('categorieJuridiqueUniteLegale:1000')
    ->setFacet($facet);
$sirene->searchEstablishments($parameters)->firstPage();
```

::: tip Pour plus d'info voir : Documentation API Sirene
[Utilisation des facettes pour les requêtes multicritères : le paramètre total](https://www.sirene.fr/static-resources/documentation/multi_facette_total_311.html)
:::

### modalite

Le paramètre `Facet::FACET_SETTING_FIELD_MODALITE` ("modalite") permet d'afficher le nombre total de valeurs prises par la variable, indépendamment du nombre de comptages affichés.

Exemple avec paramètre modalite :

```php
use LuFiipe\InseeSierene\Parameters\Facet;
use LuFiipe\InseeSierene\Parameters\SearchParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

// Comptage des établissements de personnes physiques dans les Yvelines, selon la commune
$facet = (new Facet)
    ->addSetting(Facet::FACET_SETTING_FIELD, 'codeCommuneEtablissement')
    ->addSetting(Facet::FACET_SETTING_FIELD_MODALITE, true);
$parameters = (new SearchParameters)
    ->setQuery('categorieJuridiqueUniteLegale:1000 AND codeCommuneEtablissement:78*')
    ->setFacet($facet);
$sirene->searchEstablishments($parameters)->firstPage();
```

::: tip Pour plus d'info voir : Documentation API Sirene
[Utilisation des facettes pour les requêtes multicritères : le paramètre modalite](https://www.sirene.fr/static-resources/documentation/multi_facette_modalite_311.html)
:::

### prefixe

Le paramètre `Facet::FACET_SETTING_FIELD_PREFIXE` ("prefixe") permet de n'inclure que les facettes commençant par le préfixe saisi.

Exemple avec paramètre prefixe :

```php
use LuFiipe\InseeSierene\Parameters\Facet;
use LuFiipe\InseeSierene\Parameters\SearchParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

// Comptage des établissements de personnes physiques, selon le prénom, s'il commence par un "P"
$facet = (new Facet)
    ->addSetting(Facet::FACET_SETTING_FIELD, 'prenom1UniteLegale')
    ->addSetting(Facet::FACET_SETTING_FIELD_PREFIXE, 'P');
$parameters = (new SearchParameters)
    ->setQuery('categorieJuridiqueUniteLegale:1000 AND prenom1UniteLegale:*')
    ->setFacet($facet);
$sirene->searchEstablishments($parameters)->firstPage();
```

::: tip Pour plus d'info voir : Documentation API Sirene
[Utilisation des facettes pour les requêtes multicritères : le paramètre prefixe](https://www.sirene.fr/static-resources/documentation/multi_facette_prefixe_311.html)
:::

## Facettes sur requête

Les facettes sur requête, définies par l'utilisateur, permettent d'obtenir un comptage spécifique d'une portion du champ ciblé par le paramètre `q`, en sélectionnant les éléments correspondant à la fois à la requête `q` et à celle de la facette. En l'absence de paramètre `q`, seuls les comptages liés aux facettes définies sont retournés.

Exemple avec la répartition des établissements de SARL des Yvelines selon leur commune d'implantation, avec une facette personnalisée (78646 + 78686 + 78158) :

```php
use LuFiipe\InseeSierene\Parameters\Facet;
use LuFiipe\InseeSierene\Parameters\SearchParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

$facet = (new Facet)
    ->addQuery('monSecteur', 'codeCommuneEtablissement:78646 OR codeCommuneEtablissement:78158 OR codeCommuneEtablissement:78686');
$parameters = (new SearchParameters)
    ->setQuery('categorieJuridiqueUniteLegale:5499 AND codeCommuneEtablissement:78*')
    ->setFacet($facet);
$sirene->searchEstablishments($parameters)->firstPage();
```

::: tip Pour plus d'info voir : Documentation API Sirene
[Utilisation des facettes pour les requêtes multicritères : Facettes sur requête](https://www.sirene.fr/static-resources/documentation/multi_facette_sur_requete_311.html)
:::

## Facettes sur intervalle

Les facettes de type intervalle sont principalement disponibles sur les champs de type date, mais aussi sur les champs numériques (nombre de périodes).

Exemple avec un champ numérique :

```php
use LuFiipe\InseeSierene\Parameters\Facet;
use LuFiipe\InseeSierene\Parameters\SearchParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

// Dénombrement des unités légales suivant leur nombre de périodes par tranche de 5 pour les unités légales présentant 30 périodes ou plus
$facet = (new Facet)
    ->addInterval('nombrePeriodesUniteLegale', 30, 71, 5);
$parameters = (new SearchParameters)
    ->setFacet($facet);
$sirene->searchLegalUnits($parameters)->firstPage();
```

Exemples avec un champ date :

```php
use LuFiipe\InseeSierene\Parameters\Facet;
use LuFiipe\InseeSierene\Parameters\SearchParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

// Dénombrement des entreprises dont la date de création est dans les trois derniers mois, par moi
$facet = (new Facet)
    ->addInterval('dateCreationUniteLegale', 'NOW-3MONTH', 'NOW', '+1MONTH');
$parameters = (new SearchParameters)
    ->setFacet($facet);
$sirene->searchLegalUnits($parameters)->firstPage();
```

::: tip Pour plus d'info voir : Documentation API Sirene
- [Utilisation des facettes pour les requêtes multicritères : Facettes sur intervalle](https://www.sirene.fr/static-resources/documentation/multi_facette_sur_requete_311.html)
- [Utilisation des facettes pour les requêtes multicritères : Paramètres des facettes sur intervalle](https://www.sirene.fr/static-resources/documentation/multi_facette_sur_intervalle_parametres_311.html)
:::

### autre

Le paramètre `Facet::FACET_SETTING_INTERVAL_AUTRE` ("autre") permet d'afficher des comptages globaux sur l'intervalle.

Exemple avec valeur tout :

```php
use LuFiipe\InseeSierene\Parameters\Facet;
use LuFiipe\InseeSierene\Parameters\SearchParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

// Comptage de toutes les unités légales créées depuis le début de l'année, semaine par semaine
$facet = (new Facet)
    ->addInterval('dateCreationUniteLegale', 'NOW/YEAR', 'NOW', '+7DAY')
    ->addIntervalSetting(Facet::FACET_SETTING_INTERVAL_AUTRE, Facet::FACET_SETTING_INTERVAL_AUTRE_TOUT)
    ->addSetting(Facet::FACET_SETTING_FIELD_NOMBRE, 100);
$parameters = (new SearchParameters)
    ->setFacet($facet);
$sirene->searchLegalUnits($parameters)->firstPage();
```

::: tip Pour plus d'info voir : Documentation API Sirene
[Utilisation des facettes sur intervalle : le paramètre autre](https://www.sirene.fr/static-resources/documentation/multi_facette_intervalle_autre_311.html)
:::
