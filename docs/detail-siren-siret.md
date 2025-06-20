# Détail d'un Siren/Siret

Les informations relatives d'une unité légale ou d'un établissement peuvent être obtenues à l'aide d'une instance de `LuFiipe\InseeSierene\Sirene`, en utilisant les méthodes suivantes :
- `siren()` : permet d'accéder aux données d'une unité légale à partir d'un numéro Siren (9 chiffres).
- `siret()` : permet d'accéder aux données d'un établissement à partir d'un numéro Siret (14 chiffres).

Les méthodes listées ci-dessus acceptent en paramètre une instance de `LuFiipe\InseeSierene\Parameters\UnitParameters`, qui permet à la fois de retourner des données historisées et de filtrer les attributs d'une société.

La recherche d'unité légale ou d'établissement retourne une instance de [LuFiipe\InseeSierene\Response\Response](responses.md#response-unitaire).

## Historique complet

Exemple pour obtenir un historique complet du siren 120027016 :

```php
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');
$sirene->siren('120027016')->getBody();
```

Exemple pour obtenir un historique complet du siret 12002701600563 :

```php
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');
$sirene->siret('12002701600563')->getBody();
```

## Données historisées

La méthode `LuFiipe\InseeSierene\Parameters\UnitParameters::setDate()` permet d'obtenir les valeurs des données historisées.

Exemple pour obtenir la situation du siren 326094471 au 14 mars 2000 :

```php
use LuFiipe\InseeSierene\Parameters\UnitParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

$parameters = (new UnitParameters)
    ->setDate(new DateTime('2000-03-14'));

$sirene->siren('326094471', $parameters)->getBody();
```

Exemple pour obtenir la situation courante du siret 32929709700035 :

```php
use LuFiipe\InseeSierene\Parameters\UnitParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

$parameters = (new UnitParameters)
    ->setDate(new DateTime('2999-12-31'));

$sirene->siret('32929709700035', $parameters)->getBody();
```

## Filtres

Avec `LuFiipe\InseeSierene\Parameters\UnitParameters` il est aussi possible de filtrer les attributs d'une unité légale ou d'un établissement retourné par l'api SIRENE.

- `setFields()` : Liste des champs demandés.
- `setHideNull()` : Masque (true) ou affiche (false, par défaut) les attributs qui n'ont pas de valeur.

Exemple qui affiche uniquement les attributs "denominationUniteLegale" et "economieSocialeSolidaireUniteLegale" du siren 120027016 :

```php
use LuFiipe\InseeSierene\Parameters\UnitParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

$parameters = (new UnitParameters)
    ->setFields(['denominationUniteLegale', 'economieSocialeSolidaireUniteLegale']);

$sirene->siren('120027016', $parameters)->getBody();
```

Exemple qui cache les attributs `Null` du siret 12002701600563 :

```php
use LuFiipe\InseeSierene\Parameters\UnitParameters;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

$parameters = (new UnitParameters)
    ->setHideNull(true);

$sirene->siret('12002701600563', $parameters)->getBody();
```
