import React from 'react';

const Button = ({ onClick }: { onClick?: React.MouseEventHandler<HTMLButtonElement> }) => {
  return (
    <button
      onClick={onClick}
      role="button"
      className="
        w-full h-[46px]
        bg-gray-100 hover:bg-white
        rounded-2xl
        border border-gray-200
        text-slate-800
        text-[10px] font-black tracking-widest
        inline-flex items-center justify-center
        whitespace-nowrap
        cursor-pointer
        shadow-[rgba(45,35,66,0.12)_0_4px_8px,rgba(45,35,66,0.08)_0_7px_13px_-3px,#e2e8f0_0_-3px_0_inset]
        transition-all duration-150
        hover:-translate-y-0.5
        hover:shadow-[rgba(45,35,66,0.2)_0_6px_12px,rgba(45,35,66,0.15)_0_9px_16px_-3px,#cbd5e1_0_-3px_0_inset]
        active:translate-y-px
        active:shadow-[#cbd5e1_0_3px_7px_inset]
      "
    >
      ADD TO CART <span className="ml-1">→</span>
    </button>
  );
};

export default Button;
