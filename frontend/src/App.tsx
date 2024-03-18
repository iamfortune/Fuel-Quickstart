import { useEffect, useState } from "react";
import {
  useConnectUI,
  useIsConnected,
  useDisconnect,
  useWallet,
} from "@fuel-wallet/react";
// Import the contract factory -- you can find the name in src/contracts/contracts/index.ts.
// You can also do command + space and the compiler will suggest the correct name.
import { CounterContractAbi__factory } from "./sway-api/contracts/factories/CounterContractAbi__factory";
import { CounterContractAbi } from "./sway-api";

const CONTRACT_ID =
  "0xa18fcb73e062ac1929e7081f3c541f3c3f9e397b7eca3be5ca73969e594a7ab8";

export default function Home() {
  const [contract, setContract] = useState<CounterContractAbi>();
  const [counter, setCounter] = useState<number>(); // State to hold the general value
  const [multiplyValue, setMultiplyValue] = useState<number>(1); // State to hold the multiply value
  const [feedbackMessage, setFeedbackMessage] = useState(""); // for the feedback message
  const [success, setSuccess] = useState(true)
  const [isTransactionProcessing, setIsTransactionProcessing] = useState(false); // for transaction processing
  const { connect, setTheme, isConnecting } = useConnectUI();
  const { disconnect } = useDisconnect(); // To disconnect wallet button 
  const { isConnected } = useIsConnected();
  const { wallet } = useWallet();

  setTheme("dark");

  useEffect(() => {
    async function getInitialCount() {
      if (isConnected && wallet) {
        const counterContract = CounterContractAbi__factory.connect(
          CONTRACT_ID,
          wallet
        );
        await getCount(counterContract);
        setContract(counterContract);
      }
    }
    getInitialCount();
  }, [isConnected, wallet]);

  const getCount = async (counterContract: CounterContractAbi) => {
    try {
      const { value } = await counterContract.functions
        .count()
        .txParams({
          gasPrice: 1,
          gasLimit: 100_000,
        })
        .simulate();
      setCounter(value.toNumber());
    } catch (error) {
      console.error(error);
    }
  };

  const onIncrementPressed = async () => {
    if (!contract) {
      setSuccess(false)
      return setFeedbackMessage("Contract not loaded");
    }
    try {
      setIsTransactionProcessing(true);
      await contract.functions
        .increment()
        .txParams({ gasPrice: 1, gasLimit: 100_000 })
        .call();
      await getCount(contract);
      setFeedbackMessage("Counter incremented successfully!");
    } catch (error) {
      setSuccess(false)
      setFeedbackMessage("Increment operation failed.");
    } finally {
      setIsTransactionProcessing(false);
    }
  };

  /*  FOR THE DECREMENT FUNCTION HANDLER  */

  const handleDecrement = async () => {
    if (!contract) {
      setSuccess(false)
      return setFeedbackMessage("Contract not loaded");
    }
    try {
      setIsTransactionProcessing(true);
      await contract.functions
        .decrement()
        .txParams({ gasPrice: 1, gasLimit: 100_000 })
        .call();
      await getCount(contract);
      setFeedbackMessage("Counter decremented successfully!");
    } catch (error) {
      setSuccess(false)
      let errorMessage = "Counter cannot be decremented below 0.";
      setFeedbackMessage(errorMessage);
    } finally {
      setIsTransactionProcessing(false);
    }
  };

    /*  FOR THE MULTIPLY FUNCTION HANDLER  */

  const handleMultiply = async () => {
    if (!contract || !multiplyValue) {
      setSuccess(false)
      return setFeedbackMessage(
        "Contract not loaded or multiply value is invalid"
      );
    }

    try {
      setIsTransactionProcessing(true);
      await contract.functions
        .multiply(multiplyValue)
        .txParams({ gasPrice: 1, gasLimit: 100_000 })
        .call();
      await getCount(contract);
      setFeedbackMessage("Counter multiplied successfully!");
    } catch (error) {
      setSuccess(false)
      setFeedbackMessage("Increment operation failed.");
    } finally {
      setIsTransactionProcessing(false);
    }
  };

    /*  FOR THE RESET FUNCTION HANDLER  */

  const handleReset = async () => {
    if (!contract) {
      setSuccess(false)
      return setFeedbackMessage("Contract not loaded");
    }

    try {
      setIsTransactionProcessing(true);
      await contract.functions
        .reset()
        .txParams({ gasPrice: 1, gasLimit: 100_000 })
        .call();
      await getCount(contract);
      setFeedbackMessage("Counter reset successful!");
    } catch (error) {
      setSuccess(false)
      setFeedbackMessage("Increment operation failed.");
    } finally {
      setIsTransactionProcessing(false);
    }
  };

    /*  FOR THE ADDITIONAL STYLES FOR INPUT FIELDS  */

  const updatedStyles = {
    ...styles,
    input: {
      ...styles.button,
      backgroundColor: "#505050",
      color: "white",
      marginRight: "0",
    },
    confirmMessage: {
      color: "lightgreen",
      marginTop: "20px",
    },
    failed: {
      color: "red",
      marginTop: "20px"
    }
  };

  return (
    <div style={styles.root}>
      <div style={styles.container}>
        <span style={success ? updatedStyles.confirmMessage : updatedStyles.failed}>{feedbackMessage}</span>
        {isConnected ? (
          <>
            <h3 style={styles.label}>Counter</h3>
            <div style={styles.counter}>{counter ?? 0}</div>
            <button
              onClick={onIncrementPressed}
              style={styles.button}
              disabled={isTransactionProcessing}
            >
              Increment Counter
            </button>

             {/* DECREMENT BUTTON */}

            <button
              onClick={handleDecrement}
              style={styles.button}
              disabled={isTransactionProcessing}
            >
              Decrement Counter
            </button>

             {/* MULTIPLY BUTTON */}

            <div>
              <input
                onChange={(e) => setMultiplyValue(Number(e.target.value))}
                placeholder="Multiply Value"
                style={updatedStyles.input}
              />

              <button
                onClick={handleMultiply}
                style={styles.button}
                disabled={isTransactionProcessing}
              >
                Multiply Counter
              </button>
            </div>

              {/* RESET BUTTON */}

            <div>
              <button
                onClick={handleReset}
                style={styles.button}
                disabled={isTransactionProcessing}
              >
                Reset Counter
              </button>
            </div>

            {/* DISCONNECT BUTTON */}

            <button
              onClick={() => {
                disconnect();
              }}
              style={styles.button}
              disabled={isTransactionProcessing}
            >
              Disconnect Wallet
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              connect();
            }}
            style={styles.button}
          >
            {isConnecting ? "Connecting" : "Connect"}
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  root: {
    display: "grid",
    placeItems: "center",
    height: "100vh",
    width: "100vw",
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
    cursor: "pointer",
    // marginRight: "24px",
    marginLeft: "15px",
  },
};
