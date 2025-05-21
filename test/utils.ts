import { OfferWithSignature, SignStep, SendStep, StepAction } from "../src";
import { Signer } from "ethers";

export const DAY_SECONDS = 60 * 60 * 24;

export async function executeCreateSteps(signer: Signer, steps: (SignStep | SendStep)[]): Promise<OfferWithSignature> {
  let output: OfferWithSignature | null = null;
  for (const step of steps) {
    if (step.action === StepAction.SEND) {
      await step.send(signer);
    } else if (step.action === StepAction.SIGN) {
      output = await step.sign(signer);
    }
  }

  const { offer, signature } = output || {};

  if (!offer || !signature) {
    throw new Error("Offer not created");
  }

  return { offer, signature };
}

export async function executeTakeSteps(signer: Signer, steps: (SignStep | SendStep)[]): Promise<string> {
  let txnHash: string | null = null;
  for (const step of steps) {
    if (step.action === StepAction.SEND) {
      if (step.type.startsWith("take") || step.type.startsWith("escrow") || step.type.startsWith("redeem") || step.type.endsWith("escrow")) {
        txnHash = await step.send(signer);
      } else {
        await step.send(signer);
      }
    }
  }

  if (!txnHash) {
    throw new Error("Offer not taken");
  }

  return txnHash;
}
