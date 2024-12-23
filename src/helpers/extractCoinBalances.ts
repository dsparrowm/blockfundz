
export function extractBalances(accountObject: object) {
    const balances = {
        Bitcoin: 0,
        Usdt: 0,
        Ethereum: 0,
        Usdc: 0
    };
    
    for (const [key, value] of Object.entries(accountObject)) {
      if (key.toLowerCase().includes('bitcoinbalance')) {
        balances.Bitcoin = value;
      }
      if (key.toLowerCase().includes('usdtbalance')) {
        balances.Usdt = value;
      }
      if (key.toLowerCase().includes('usdcBalance')) {
        balances.Usdc = value
      }

      if (key.toLowerCase().includes('ethereumBalance')) {
        balances.Ethereum = value
      }
    }
    
    return {
      Bitcoin: balances.Bitcoin,
      Usdt: balances.Usdt,
      Ethereum: balances.Ethereum,
      Usdc: balances.Usdc
    };
  }