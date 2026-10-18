import { Keypair, Horizon, Asset, Operation, TransactionBuilder, Networks, Claimant, BASE_FEE } from '@stellar/stellar-sdk';

const servidor = new Horizon.Server('https://horizon-testnet.stellar.org');

async function crearCuenta() {
  const llaves = Keypair.random();
  const respuesta = await fetch(`https://friendbot.stellar.org?addr=${llaves.publicKey()}`);
  if (!respuesta.ok) throw new Error(`friendbot falló: ${respuesta.status}`);
  return llaves;
}

async function enviar(llaves, operacion) {
  const cuenta = await servidor.loadAccount(llaves.publicKey());
  const tx = new TransactionBuilder(cuenta, { fee: BASE_FEE, networkPassphrase: Networks.TESTNET })
    .addOperation(operacion)
    .setTimeout(30)
    .build();
  tx.sign(llaves);
  return servidor.submitTransaction(tx);
}

const remitente = await crearCuenta();
const farmacia = await crearCuenta();

const limite = (Math.floor(Date.now() / 1000) + 60).toString();
const antesDelLimite = Claimant.predicateBeforeAbsoluteTime(limite);

const cobradores = [
  new Claimant(farmacia.publicKey(), antesDelLimite),
  new Claimant(remitente.publicKey(), Claimant.predicateNot(antesDelLimite)),
];

const resultado = await enviar(
  remitente,
  Operation.createClaimableBalance({ asset: Asset.native(), amount: '100', claimants: cobradores })
);

console.log('saldo bloqueado. transacción:', resultado.hash);
console.log(`ver en el explorador: https://stellar.expert/explorer/testnet/tx/${resultado.hash}`);

const lista = await servidor.claimableBalances().claimant(farmacia.publicKey()).call();
const idSaldo = lista.records[0].id;

try {
  await enviar(remitente, Operation.claimClaimableBalance({ balanceId: idSaldo }));
  console.log('ERROR: el remitente pudo cobrar antes de tiempo');
} catch (error) {
  const motivo = error?.response?.data?.extras?.result_codes?.operations?.join(',') ?? error.message;
  console.log('el remitente intentó cobrar antes de tiempo -> rechazado:', motivo);
}