import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "ethers";


const TestCurrencyModule = buildModule("TestCurrency", (m) => {
  // Deploy currency
  const currency = m.contract("TestERC20", [18], { id: "TestERC20" });

  m.call(currency, "mint", [
    "0x11d351894506e13587d4e479b6c38e68891f1492",
    parseEther("1000000")
  ], { id: "mint_currency_1" });

  m.call(currency, "mint", [
    "0x3ebabb4da024d3346e0b42fc16c6e64fc5212870",
    parseEther("1000000")
  ], { id: "mint_currency_2" });

  m.call(currency, "mint", [
    "0x106637f4df98522dd8b6791ca3ecc4cff5fc9961",
    parseEther("10000")
  ], { id: "mint_currency_3" });
  

  return { currency }
});

export default TestCurrencyModule;
