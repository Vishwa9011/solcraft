import React from 'react';

const Header = () => {
  return (
    <div className="flex items-center justify-center w-full h-16 mx-auto bg-slate-50/10">
      <div className="flex items-center justify-between w-full h-full px-4 max-w-[1400px]">
        <div className="h3-medium">SolCraft.io</div>
        <div className="p-medium-20">Connect</div>
      </div>
    </div>
  );
}

export default Header;