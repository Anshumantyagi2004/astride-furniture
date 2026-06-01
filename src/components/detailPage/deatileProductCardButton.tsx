"use client";

import React from 'react';
import styled from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className,
  ...props 
}) => {
  return (
    <StyledWrapper $variant={variant} $fullWidth={fullWidth} className={className}>
      <button {...props}>
        <span className="button_top">{children}</span>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div<{ $variant: 'primary' | 'secondary'; $fullWidth: boolean }>`
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  display: ${props => props.$fullWidth ? 'block' : 'inline-block'};

  button {
    /* Variables */
    --button_radius: 9999px; /* rounded-full to match the design */
    --button_color: ${props => props.$variant === 'primary' ? '#000000' : '#ffffff'};
    --button_outline_color: #000000;
    --text_color: ${props => props.$variant === 'primary' ? '#ffffff' : '#000000'};
    
    width: 100%;
    font-size: 14px;
    font-weight: 600;
    font-family: inherit;
    border: none;
    cursor: pointer;
    border-radius: var(--button_radius);
    background: var(--button_outline_color);
    padding: 0;
    margin: 0;
    display: block;
    letter-spacing: 0.05em;
  }

  .button_top {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    border: 2px solid var(--button_outline_color);
    border-radius: var(--button_radius);
    padding: 0.75em 1.5em;
    background: var(--button_color);
    color: var(--text_color);
    transform: translateY(-0.25em);
    transition: transform 0.1s ease;
  }

  button:hover .button_top {
    /* Pull the button upwards when hovered */
    transform: translateY(-0.35em);
  }

  button:active .button_top {
    /* Push the button downwards when pressed */
    transform: translateY(0);
  }
`;

export default Button;
