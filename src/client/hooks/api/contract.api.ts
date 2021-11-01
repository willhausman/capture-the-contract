import { useCallback } from 'react';
import { useApi } from './api';

export const useContractApi = () => {
  const { get, post } = useApi();

  const getContractMetadata = useCallback((contractName: string, account: string) => get(`contracts/${contractName}/${account}`)
    .then(contract => ({ ...contract, abi: JSON.parse(contract.abi) })), [get]);
  const makeContract = useCallback((contractName: string, txHash: string, account: string) => post(`contracts/${contractName}/${txHash}/${account}`), [post]);
  const validateContract = useCallback((contractAddress: string, account: string) => post(`contracts/${contractAddress}/${account}/validate`), [post]);

  return { getContractMetadata, makeContract, validateContract };
};
