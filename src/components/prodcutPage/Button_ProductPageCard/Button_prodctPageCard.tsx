import React from 'react';
import styled from 'styled-components';

const Button = ({ onClick }: { onClick?: React.MouseEventHandler<HTMLButtonElement> }) => {
  return (
    <StyledWrapper>
      <button onClick={onClick} className="button-name" role="button">
        ADD TO CART <span className="ml-1">→</span>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .button-name {
    align-items: center;
    appearance: none;
    background-color: #f3f4f6;
    border-radius: 16px;
    border-width: 0;
    box-shadow:
      rgba(45, 35, 66, 0.15) 0 4px 8px,
      rgba(45, 35, 66, 0.1) 0 7px 13px -3px,
      #e2e8f0 0 -3px 0 inset;
    box-sizing: border-box;
    color: #1e293b;
    cursor: pointer;
    display: inline-flex;
    height: 46px;
    width: 100%;
    justify-content: center;
    line-height: 1;
    list-style: none;
    overflow: hidden;
    padding-left: 20px;
    padding-right: 20px;
    position: relative;
    text-align: center;
    text-decoration: none;
    transition:
      box-shadow 0.15s,
      background-color 0.15s,
      transform 0.15s;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    white-space: nowrap;
    will-change: box-shadow, transform;
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.1em;
  }

  .button-name:focus {
    box-shadow:
      #cbd5e1 0 0 0 1.5px inset,
      rgba(45, 35, 66, 0.3) 0 2px 4px,
      rgba(45, 35, 66, 0.2) 0 7px 13px -3px,
      #cbd5e1 0 -3px 0 inset;
  }

  .button-name:hover {
    box-shadow:
      rgba(45, 35, 66, 0.2) 0 6px 12px,
      rgba(45, 35, 66, 0.15) 0 9px 16px -3px,
      #cbd5e1 0 -3px 0 inset;
    transform: translateY(-2px);
    background-color: #ffffff;
    color: #0f172a;
  }

  .button-name:active {
    box-shadow: #cbd5e1 0 3px 7px inset;
    transform: translateY(1px);
  }`;

export default Button;
