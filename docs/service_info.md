# Service informations

Le service d'information permet de consulter l'état de chaque collection (disponible ou non) ainsi que leurs dates de mise à jour.

```php
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY');

$r = $sirene->informations()->getBody();
```

Exemple de retour :
```json
{
    "header":{
		"statut":200,
		"message":"OK"
	},
	"etatService":"UP",
	"etatsDesServices":[
		{
			"Collection":"Unités Légales",
			"etatCollection":"UP"
		},
		{
			"Collection":"Établissements",
			"etatCollection":"UP"
		},
		{
			"Collection":"Liens de succession",
			"etatCollection":"UP"
		}
	],
	"versionService":"3.11.19",
	"journalDesModifications":"https://api.insee.fr/registry/resource/_system/governance/apimgt/applicationdata/provider/insee/Sirene/V3.11/documentation/files/changelog%203.11.txt",
	"datesDernieresMisesAJourDesDonnees":[
		{
			"collection":"Unités Légales",
			"dateDerniereMiseADisposition":"2024-03-26T07:02:52.000",
			"dateDernierTraitementMaximum":"2024-03-26T05:20:08.847",
			"dateDernierTraitementDeMasse":"2024-03-26T05:20:08.847"
		},
		{
			"collection":"Établissements",
			"dateDerniereMiseADisposition":"2024-03-26T14:16:01.000",
			"dateDernierTraitementMaximum":"2024-03-26T07:21:46.628",
			"dateDernierTraitementDeMasse":"2024-03-26T07:21:46.628"
		},
		{
			"collection":"Liens de succession",
			"dateDerniereMiseADisposition":"2024-03-26T11:05:04.000",
			"dateDernierTraitementMaximum":"2024-03-26T10:56:56.543",
			"dateDernierTraitementDeMasse":"2024-03-26T10:56:56.543"
		}
	]
}
```

::: tip Pour plus d'info voir : Documentation API Sirene
- [Service informations : Appel du service. En-tête de la requête, variables de la réponse et résultat](https://www.sirene.fr/static-resources/documentation/service_info_311.html)
- [Service informations : codes retour, en-tête et variables de la réponse](https://www.sirene.fr/static-resources/documentation/service_info_resultat_311.html)
:::