# Pacta

**Dinero con destino: tú decides quién cobra, cuánto y hasta cuándo.**

Pacta es una idea de app para mandar dinero desde otros países hacia Bolivia con reglas claras, usando USDC en la red Stellar. Quien manda bloquea el dinero definiendo quién puede cobrarlo (por ejemplo una universidad, una farmacia o un proveedor), el monto exacto y el plazo. Si nadie cobra a tiempo, el dinero vuelve a quien lo mandó.

> Proyecto para la Ideatón Stellar (Bolivia), Track 2: pagos y remesas.
> **Estado: idea con diseño, entrevistas y una prueba técnica en testnet. Todavía no hay una app funcionando.**

## Cómo funciona (la idea)

1. Quien manda convierte su dinero a USDC y lo bloquea con reglas: quién cobra, cuánto, hasta cuándo.
2. Quien cobra presenta un código de un solo uso en un negocio aliado.
3. El aliado confirma la entrega y cobra.
4. Si vence el plazo sin cobro, el dinero vuelve a quien lo mandó.
5. Cada operación deja un comprobante verificable en la red.

Ideas para más adelante: pagos divididos en cuotas (cada una cobrable solo en su fecha) y fondos familiares entre países.

## Qué existe hoy

| pieza | estado |
|---|---|
| Diseño de pantallas (web y móvil) | hecho, en Figma |
| Entrevistas con remitentes | 5 hechas, en video |
| Prueba técnica en testnet de Stellar | hecha, en `prueba-testnet/` |
| App funcionando (backend, base de datos, código de un solo uso) | **no existe todavía** |
| Conversión entre bolivianos y USDC | **no existe**; se resolvería con aliados autorizados |

## Diseño

[Ver el diseño en Figma](https://www.figma.com/design/RTSqmbZxnU252D9EyQdZ9G/Sin-t%C3%ADtulo?node-id=0-1)

## Entrevistas

Entrevistas a personas que mandan dinero. Se comparten con el permiso de los entrevistados.

- [Entrevista 1, remitente actual](https://youtu.be/Z0FuqzGUiXI)
- [Entrevista 2, remitente futura](https://youtu.be/K5MtYKKty_I)
- [Entrevista 3, remitente activo](https://youtu.be/G5ZWHAQ51MM)
- [Entrevista 4, remitente actual](https://youtu.be/uKi_gCib-R8)
- [Entrevista 5, remitente activo](https://youtu.be/9cADG1CMl3Y)

## Prueba técnica en testnet

Scripts en Node que prueban, con transacciones reales en la testnet de Stellar, que la regla central funciona:

| paso | qué prueba |
|---|---|
| `paso2-cuentas.mjs` | crear dos cuentas de prueba (remitente y farmacia) |
| `paso3-bloquear.mjs` | bloquear 100 XLM de prueba con plazo y cobradores definidos |
| `paso4-reglas.mjs` | la red rechaza un cobro anticipado (`op_cannot_claim`) |
| `paso5-cobro.mjs` | la farmacia cobra dentro del plazo |
| `paso6-reembolso.mjs` | nadie cobra, vence el plazo y el remitente recupera su dinero |

Transacciones de ejemplo (testnet):

- Bloqueo con plazo: [5a4655d8…](https://stellar.expert/explorer/testnet/tx/5a4655d8f997960b7443a7efcd090c2972546fb5772dbeb530c2dabdcce46de9)
- Cobro de la farmacia a tiempo: [af0b5381…](https://stellar.expert/explorer/testnet/tx/af0b53819a7c38b6e5015f1a03c4d16d995d262f475c29748246f776aaa01a7c)
- Bloqueo (prueba de reembolso): [b983bd8e…](https://stellar.expert/explorer/testnet/tx/b983bd8eff45c4d4a1ae02eff6b27ed2417113f55cfebcf52a2d24c54a0b55f9)
- Reembolso al vencer el plazo: [ba7960ca…](https://stellar.expert/explorer/testnet/tx/ba7960caec95dbf481aac03f6c973807965ca5b73ca88bb5041cbc5714c3e182)

La testnet de Stellar se reinicia cada cierto tiempo, así que estos enlaces pueden dejar de funcionar. Los scripts se pueden volver a correr para generar transacciones nuevas.

### Cómo correrlo

Probado con Node 22.

```bash
cd prueba-testnet
npm install
node paso6-reembolso.mjs
```

Cada script crea cuentas nuevas de prueba, así que no necesita llaves ni configuración.

### Límites de la prueba

- Usa **XLM de prueba**, no USDC.
- Usa **saldos reclamables** de Stellar (una función nativa de la red), no un contrato inteligente.
- No hay backend ni código de un solo uso todavía. En la idea, el código lo verificaría el backend y no la red.

## Cómo ganaría dinero

Una comisión pequeña a quien manda y otra al aliado en los envíos con reglas. El envío libre (sin reglas) no cobraría.

## Uso de IA

Se usó un asistente de IA como apoyo: explicó cada paso y propuso el código de las pruebas; el autor lo escribió o lo pegó, lo ejecutó, lo probó en testnet y lo subió. Las entrevistas y las decisiones del proyecto son del autor.

## Autor

Alan ([@Alan021011](https://github.com/Alan021011))
