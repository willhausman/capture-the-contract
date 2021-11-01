import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import Web3 from 'web3';
import Web3Modal from 'web3modal';

const MAINNET_ID = 1;

interface Web3Context {
  activate: () => Promise<void>;
  account: string;
  library: Web3;
  connected: boolean;
}

const Context = createContext<Web3Context>({
  activate: async () => Promise.resolve(),
  account: '',
  library: null as any,
  connected: false,
});

const Web3Provider = ({ children }: any) => {
  const web3Modal = useMemo(() => new Web3Modal(), []);

  const [library, setLibrary] = useState<Web3 | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [account, setAccount] = useState('');
  const connected = !!library && !!account;

  const deactivate = useCallback(async () => {
    const provider = library && library.currentProvider as any;
    if (provider && provider.disconnect) {
      await provider.disconnect();
    }
    web3Modal.clearCachedProvider();

    setAccount('');
    setLibrary(null);
    setChainId(null);
  }, [library, web3Modal]);

  const activate = useCallback(async () => {
    try {
      const provider = await web3Modal.connect();

      provider.on('disconnect', () => deactivate());
      provider.on('accountsChanged', (accounts: string[]) => setAccount(accounts[0]));
      provider.on('chainChanged', (chainId: number) => setChainId(chainId));
      provider.on('connect', ({ chainId }: any) => setChainId(chainId));

      const web3 = new Web3(provider);

      const accounts = await web3.eth.getAccounts();
      const chainId = await web3.eth.net.getId();

      setLibrary(web3);
      setAccount(accounts[0]);
      setChainId(chainId);
    } catch (e) {
      console.error(e);
    }
  }, [web3Modal, deactivate]);

  useEffect(() => {
    // this app would be crazy stupid to use on mainnet
    if (chainId && chainId == MAINNET_ID) { // eslint-disable-line eqeqeq
      deactivate()
        .then(() => console.log('Your wallet is connected to mainnet. You have been disconnected.'));
    }
  }, [chainId, deactivate]);

  return (
    <Context.Provider value={{
      activate, deactivate, account, connected, library, chainId,
    } as any}
    >
      {children}
    </Context.Provider>
  );
};

const useWeb3 = () => useContext(Context);

export { Web3Provider, useWeb3 };
