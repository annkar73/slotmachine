import { useState } from "react";
import styled, { keyframes, css } from "styled-components";
import isPropValid from "@emotion/is-prop-valid";

// Symbols for spin
const symbols = ["🍒", "🍋", "🍉", "🍊", "🍇", "🍓", "🍍", "🔔", "⭐", "💎"];

// create spinning animation downwards
const spinAnimation = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(0%); }
`;

// SlotMachine component container
const SlotMachineContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: #222;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  margin: 0 auto;
`;

// Container for reels
const ReelsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  background: black;
  padding: 10px;
  border-radius: 10px;
  position: relative;
`;

// Each single reel
const Reel = styled.div`
  width: 80px;
  height: 240px;
  overflow: hidden;
  background: white;
  border: 3px solid orange;
  border-radius: 5px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const SymbolWrapper = styled.div.withConfig({
    shouldForwardProp: (prop: PropertyKey) =>
      typeof prop === "string" && isPropValid(prop) && prop !== "spinning",
  })<{ spinning: boolean; duration: number }>`
    display: flex;
    flex-direction: column;
    ${(props) =>
      props.spinning &&
      css`
        animation: ${spinAnimation} ${props.duration}s cubic-bezier(0.25, 1, 0.5, 1)
          1;
      `}
  `;
  
  const Symbol = styled.div`
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
`;

const SpinButton = styled.button`
  background: linear-gradient(to bottom, #00ff00, #008000);
  border: none;
  border-radius: 10px;
  width: 80px;
  height: 80px;
  margin: 10px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  color: white;
  text-transform: uppercase;
  transition: all 0.1s ease-in-out;
  box-shadow: 0px 6px #004d00, 0 0 20px rgba(0, 255, 0, 0.8);
  outline: none;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  
  &:active {
    transform: translateY(4px);
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.8);
  }
`;

const ResultText = styled.div`
  margin-top: 10px;
  font-size: 24px;
  min-height: 30px;
  text-align: center;
`;

const SlotMachine = () => {
  const generateStaticReel = () => {
    return Array(15)
      .fill(0)
      .map(() => symbols[Math.floor(Math.random() * symbols.length)]);
  };

  const [reels, setReels] = useState<string[][]>([
    generateStaticReel(),
    generateStaticReel(),
    generateStaticReel(),
  ]);
  const [resultText, setResultText] = useState("");
  const [spinningReels, setSpinningReels] = useState([false, false, false]);

  const spinAllReels = () => {
    setResultText("");
    setSpinningReels([true, true, true]);
  
    setTimeout(() => stopReel(0), 2000 + Math.random() * 500);
    setTimeout(() => stopReel(1), 2500 + Math.random() * 500);
    setTimeout(() => stopReel(2), 3000 + Math.random() * 500);
  };
  
  const stopReel = (index: number) => {
    setSpinningReels((prev) => {
      const newSpinning = [...prev];
      newSpinning[index] = false;
      return newSpinning;
    });
  
    setReels((prevReels) => {
      if (spinningReels[index]) {  // update only if reel was spinning
        const newReels = [...prevReels];
        const shiftAmount = Math.floor(Math.random() * symbols.length);
        newReels[index] = [
          ...newReels[index].slice(shiftAmount),
          ...newReels[index].slice(0, shiftAmount),
        ];
        return newReels;
      }
      return prevReels;
    });
  
    if (index === 2) {
      setTimeout(() => {
        checkWin();
      }, 500);
    }
  };
  

  const checkWin = () => {
    const middleRow = reels.map((reel) => reel[2]);
    const isWin = middleRow.every((symbol, _, arr) => symbol === arr[0]);
    setResultText(isWin ? "🎉 VINST!" : "😔 Ingen vinst denna gång");
  };

  return (
    <>
      <SlotMachineContainer>
        <ReelsContainer>
          {reels.map((reel, index) => (
            <Reel key={index}>
              <SymbolWrapper spinning={!!spinningReels[index]} duration={2 + index * 0.5}>
                {reel.concat(reel).map((symbol, i) => (
                  <Symbol key={i}>{symbol}</Symbol>
                ))}
              </SymbolWrapper>
            </Reel>
          ))}
        </ReelsContainer>
        <SpinButton onClick={spinAllReels} disabled={spinningReels.some((s) => s)}>SPIN</SpinButton>
      </SlotMachineContainer>
      <ResultText>{resultText}</ResultText>
    </>
  );
};

export default SlotMachine;
