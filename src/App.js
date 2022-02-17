import { useEffect, useState } from 'react';
import lottery from './lottery';
import web3 from './web3';

function App() {
  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState('');
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    (async function () {
      try {
        const manager = await lottery.methods.manager().call();
        const players = await lottery.methods.getPlayers().call();
        const balance = await web3.eth.getBalance(lottery.options.address);

        setManager(manager);
        setPlayers(players);
        setBalance(balance);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();

    if (value === '') return;

    const accounts = await web3.eth.getAccounts();

    setMessage('Waiting on transaction success...')

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, 'ether')
    });

    setMessage('You have been entered!')

  };

  const onClick = async () => {
    if (players.length > 1) {
      const accounts = await web3.eth.getAccounts();

      setMessage('Waiting on transaction success...')

      await lottery.methods.pickWinner().send({
        from: accounts[0]
      });

      setMessage('A winner has been picked!')
    }
  };

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>This contract is managed by {manager}. There are currently {players.length} people entered, competing to win {web3.utils.fromWei(balance, 'ether')} ether!</p>
      <hr />
      <form onSubmit={onSubmit}>
        <h4>Want to try your luck?</h4>
        <label>Enter Amount of ether greaten than 1 to join the lottery.</label>
        <input type="text" value={value} onChange={e => setValue(e.target.value)} />
        <button type="submit">Enter</button>
      </form>
      <hr />
      <h1>{message}</h1>
      <h1>Ready to pick a winner?</h1>
      <button type="button" onClick={onClick}>Pick a winner!</button>
    </div>
  );
}

export default App;