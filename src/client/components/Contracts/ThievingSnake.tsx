import { useWeb3 } from '~/components/Web3Provider';
import { ContractProps } from './contract-props.interface';
import ContractMethod from './ContractMethod';

const ThievingSnake = ({ contract, sol }: ContractProps) => {
  const { account } = useWeb3();

  const getDedication = () => contract.methods.getDedication().call()
    .then((address: string) => console.log('getDedication ', address))
    .catch(console.error);

  const showDedication = () => contract.methods.showDedication().send({ from: account })
    .on('transactionHash', (txHash: string) => console.log('showDedication ', txHash))
    .catch(console.error);

  const reclaimPayment = () => contract.methods.reclaimPayment().send({ from: account })
    .on('transactionHash', (txHash: string) => console.log('reclaimPayment ', txHash))
    .catch(console.error);

  const methods = (
    <div className="methods">
      <ContractMethod name="getDedication" call={getDedication} />
      <ContractMethod name="showDedication" send={showDedication} />
      <ContractMethod name="reclaimPayment" send={reclaimPayment} />
    </div>
  );

  return (
    <div>
      <h2>Thieving snake</h2>
      <p>It is not always so easy to show your mettle.</p>
      <code>{sol}</code>
      {contract ? methods : ''}
    </div>
  );
};

export { ThievingSnake };
