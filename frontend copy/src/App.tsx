import { useEffect, useState } from "react";
import {
  useConnectUI,
  useIsConnected,
  useDisconnect,
  useWallet,
} from '@fuel-wallet/react';
// Import the contract factory -- you can find the name in src/contracts/contracts/index.ts.
// You can also do command + space and the compiler will suggest the correct name.
import { CounterContractAbi__factory  } from "./sway-api/contracts/factories/CounterContractAbi__factory";
import { CounterContractAbi } from "./sway-api";



const CONTRACT_ID="0x7ed61842f2289484a399d2aa686961c5cf9fe9df51e03dc111011d24960bcacc";

export default function Home() {
  const [contract, setContract] = useState<CounterContractAbi>();
  const [counter, setCounter] = useState<number>();
  const { connect, setTheme, isConnecting } =
    useConnectUI();
    const { disconnect } = useDisconnect();
  const { isConnected } = useIsConnected();
  const { wallet } = useWallet();

  setTheme("dark");

  useEffect(() => {
    async function getInitialCount(){
      if(isConnected && wallet){
        const counterContract = CounterContractAbi__factory.connect(CONTRACT_ID, wallet);
        await getCount(counterContract);
        setContract(counterContract);
      }
    }
    
    getInitialCount();
  }, [isConnected, wallet]);

  const getCount = async (counterContract: CounterContractAbi) => {
    try{
      const { value } = await counterContract.functions
      .count()
      .txParams({
        gasPrice: 1,
        gasLimit: 100_000,
      })
      .simulate();
      setCounter(value.toNumber());
    } catch(error) {
      console.error(error);
    }
  }


  const onIncrementPressed = async () => {
    if (!contract) {
      return alert("Contract not loaded");
    }
    try {
      await contract.functions
      .increment()
      .txParams({
        gasPrice: 1,
        gasLimit: 100_000,
      })
      .call();
      await getCount(contract);
    } catch(error) {
      console.error(error);
    }
  };

  console.log(isConnected)

  return (
    <div style={styles.root}>
      <div style={styles.container}>
        {isConnected ? (
          <>
            <h3 style={styles.label}>Counter</h3>
            <div style={styles.counter}>
              {counter ?? 0}
            </div>
            <button
            onClick={onIncrementPressed}
            style={styles.button}
            >
              Increment Counter
            </button>
            <button
            onClick={() => {
              disconnect()
            }}
            style={styles.button}
            >
              Disconnect wallet
            </button>
          </>
        ) : (
          <button
          onClick={() => {
            connect();
          }}
          style={styles.button}
          >
            {isConnecting ? 'Connecting' : 'Connect'}
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  root: {
    display: 'grid',
    placeItems: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: "black",
  } as React.CSSProperties,
  container: {
    color: "#ffffffec",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  } as React.CSSProperties,
  label: {
    fontSize: "28px",
  },
  counter: {
    color: "#a0a0a0",
    fontSize: "48px",
  },
  button: {
    borderRadius: "8px",
    marginTop: "24px",
    backgroundColor: "#707070",
    fontSize: "16px",
    color: "#ffffffec",
    border: "none",
    outline: "none",
    height: "60px",
    padding: "0 1rem",
    cursor: "pointer"
  },
}


// Wallet address fuel13utvld8ypyapay8j50t7vtxzl6qn08n922h4r7ld4er0gn7y6lqqpn82mf