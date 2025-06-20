# Evénements

Pour exécuter du code à chaque opération du client sirene, vous pouvez écouter les différents événements émis par le client sirene :

| Nom                                                | Evénement                                                      |
|----------------------------------------------------|----------------------------------------------------------------|
| `\LuFiipe\InseeSierene\Events::REQUESTING`         | Se produit au tout début de la requête.                        |
| `\LuFiipe\InseeSierene\Events::RATE_LIMIT_REACHED` | Se produit lorsque la limite de débit de l'API a été dépassée. |

Exemple :

```php
use Illuminate\Support\Facades\Log;
use LuFiipe\InseeSierene\Events;
use LuFiipe\InseeSierene\Request\Request;
use LuFiipe\SimplEvent\Event;

Event::on(Events::REQUESTING, function (Request $request) {
    Log::debug('Insee Sirene : Requête', [
        'method' => $request->getMethod(),
        'url' => $request->getUrl(),
        'body' => $request->getRequestBody(),
    ]);
});

Event::on(Events::RATE_LIMIT_REACHED, function (int $milliseconds, int $retries) {
    Log::debug('Insee Sirene : Rate limiting', [
        'delay' => $milliseconds,
        'retries' => $retries,
    ]);
});
```

Pour plus d'information sur `LuFiipe\SimplEvent\Event` consulter sa [documentation](https://github.com/lufiipe/simplevent).