import { Keypair, Horizon } from '@stellar/stellar-sdk';

const servidor = new Horizon.Server('https://horizon-testnet.stellar.org');

async function crearCuenta(nombre) {
  const llaves = Keypair.random();
  const respuesta = await fetch(`https://friendbot.stellar.org?addr=${llaves.publicKey()}`);
  if (!respuesta.ok) throw new Error(`friendbot falló para ${nombre}: ${respuesta.status}`);
  console.log(`${nombre} creada: ${llaves.publicKey()}`);
  return llaves;
}

const remitente = await crearCuenta('remitente');
const farmacia = await crearCuenta('farmacia');

for (const [nombre, llaves] of [['remitente', remitente], ['farmacia', farmacia]]) {
  const cuenta = await servidor.loadAccount(llaves.publicKey());
  const xlm = cuenta.balances.find((b) => b.asset_type === 'native');
  console.log(`${nombre} tiene ${xlm.balance} XLM de prueba`);
}