import { useState } from 'react';
import { useWeb3 } from '~/components/Web3Provider';
import ContractMethod from './ContractMethod';
import { ContractProps } from './contract-props.interface';

const ComeAgain = ({ contract, sol }: ContractProps) => {
  const { account, library } = useWeb3();
  const [dedication, setDedication] = useState('0');

  const getDedication = () => contract.methods.getDedication().call()
    .then((address: string) => console.log('getDedication ', address))
    .catch(console.error);

  const showDedication = () => contract.methods.showDedication().send({ from: account, value: library.utils.toWei(dedication) })
    .on('transactionHash', (txHash: string) => console.log('showDedication ', txHash))
    .catch(console.error);

  const reclaimPayment = () => contract.methods.reclaimPayment().send({ from: account })
    .on('transactionHash', (txHash: string) => console.log('reclaimPayment ', txHash))
    .catch(console.error);

  const methods = (
    <div className="methods">
      <ContractMethod name="getDedication" call={getDedication} />
      <ContractMethod name="showDedication" send={showDedication}>
        <label>
          Dedication
          <input value={dedication} type="number" onChange={e => setDedication(e.target.value)} />
        </label>
      </ContractMethod>
      <ContractMethod name="reclaimPayment" send={reclaimPayment} />
    </div>
  );

  return (
    <div>
      <h2>Come again</h2>
      <p>How do you fare when those around you are fleeing with your hard-earned coin?</p>
      <code>{sol}</code>
      {contract ? methods : ''}
    </div>
  );
};

export { ComeAgain };
