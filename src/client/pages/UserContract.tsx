import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useContractApi } from '~/hooks';
import { useWeb3 } from '~/components/Web3Provider';
import { ComeAgain, Connection, ThievingSnake } from '~/components/Contracts';

const ContractSwitchCase = ({ contractName, contract, sol }: any) => {
  switch (contractName) {
    case 'connection':
      return <Connection contract={contract} sol={sol} />;
    case 'thievingsnake':
      return <ThievingSnake contract={contract} sol={sol} />;
    case 'comeagain':
      return <ComeAgain contract={contract} sol={sol} />;
    default:
      return <p>No contract found</p>;
  }
};

const UserContract = () => {
  const { contractName } = useParams<{ contractName: string }>();
  const { library, account } = useWeb3();
  const { getContractMetadata, validateContract, makeContract } = useContractApi();
  const [contract, setContract] = useState<any>();
  const [isWaiting, setIsWaiting] = useState(true);
  const [meta, setMeta] = useState<any>();
  const canDeploy = !isWaiting && !contract && !!meta;

  useEffect(() => {
    setIsWaiting(true);
    getContractMetadata(contractName, account)
      .then(({
        contractAddress, abi, bytes, sol,
      }) => {
        setMeta({
          abi, bytes, sol,
        });

        if (contractAddress) {
          setContract(new library.eth.Contract(abi, contractAddress));
          console.log('contract at ', contractAddress);
        }
      })
      .catch(console.error)
      .finally(() => setIsWaiting(false));
  }, [
    getContractMetadata,
    contractName,
    account,
    library,
  ]);

  const deployContract = useCallback(() => {
    setIsWaiting(true);
    setContract(null);
    const { abi, bytes } = meta;
    const contract = new library.eth.Contract(abi);
    const payload = {
      data: bytes,
    };

    let deployHash = '';

    contract.deploy(payload)
      .send({ from: account })
      .on('receipt', receipt => {
        console.log('receipt ', receipt);
        deployHash = receipt.transactionHash;
      })
      .then(instance => new Promise((resolve, reject) => makeContract(contractName, deployHash, account)
        .then(() => resolve(instance))
        .catch(reject)))
      .then((instance: any) => {
        console.log(`deployed contract to ${instance.options.address} in tx ${deployHash}`);
        setContract(instance);
      })
      .catch(console.error)
      .finally(() => setIsWaiting(false));
  }, [
    meta,
    contractName,
    account,
    library,
    makeContract,
  ]);

  const validate = useCallback(() => validateContract(contract.options.address, account)
    .then(flag => console.log(flag))
    .catch(console.error), [
    validateContract,
    contract,
    account,
  ]);

  return (
    <div>
      {contract ? (
        <span style={{
          position: 'absolute', right: '8px', top: '70px', textAlign: 'right',
        }}
        >Contract: {contract.options.address}
        </span>
      ) : ''}
      {meta ? <ContractSwitchCase contractName={contractName} contract={contract} sol={meta.sol} /> : ''}
      <br />
      {canDeploy ? <button className="primary-action" onClick={deployContract}>Begin</button> : ''}
      {contract ? <button className="primary-action" onClick={validate}>Validate</button> : ''}
      {contract ? <button className="secondary-action" onClick={deployContract}>Start over</button> : ''}
      {!isWaiting && !meta ? 'Contract not found' : ''}
    </div>
  );
};

export { UserContract };
