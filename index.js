
require('dotenv').config();
const express = require('express');
const { ethers } = require('ethers');

const app = express();
app.use(express.json());

const provider = new ethers.providers.JsonRpcProvider('https://testnet.dplabs-internal.com');
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

app.post('/faucet', async (req, res) => {
  const { address } = req.body;
  if (!ethers.utils.isAddress(address)) {
    return res.status(400).send('Invalid address');
  }

  try {
    const tx = await wallet.sendTransaction({
      to: address,
      value: ethers.utils.parseEther('0.2')
    });
    await tx.wait();
    res.send({ status: 'success', txHash: tx.hash });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Faucet running on port ${port}`);
});
