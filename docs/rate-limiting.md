# Rate limiting

L'utilisation de l'API Sirene est limitée à 30 requêtes par minute. Au-delà de ce seuil, l'API renvoie une erreur `HTTP 429 - Too Many Requests`.

Cette librairie gère automatiquement cette limitation en suspendant temporairement l'exécution du programme, afin d'attendre la réinitialisation du quota pour ensuite reprendre les appels.

## Désactiver rate limit

Cependant, cette suspension - pouvant durer plusieurs secondes - peut s'avérer contraignante dans certains contextes.

Il est donc possible de désactiver cette gestion automatique du *rate limiting* en passant `false` en second paramètre du constructeur `Sirene`.

Vous devrez alors intercepter manuellement les exceptions liées aux erreurs de quota (`HTTP 429`).

Exemple:

```php
use LuFiipe\InseeSierene\Exception\SireneException;
use LuFiipe\InseeSierene\Sirene;

$sirene = new Sirene('YOUR-API-KEY', false);

for ($i = 0; $i < 40; $i++) {
    try {
        $res = $sirene->informations();
    } catch (SireneException $e) {
        echo $e->getMessage();
    }
    sleep(1);
}
```

L'exemple ci-dessus va afficher :

```
Client error: `GET https://api.insee.fr/api-sirene/3.11/informations` resulted in a `429 Too Many Requests` ../..
```
