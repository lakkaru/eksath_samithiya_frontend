// MemberContext.js
import React, { createContext, useContext, useState } from "react";

const MemberContext = createContext();

export const MemberProvider = ({ children }) => {
  const [memberData, setMemberData] = useState(null);

  return (
    <MemberContext.Provider value={{ memberData, setMemberData }}>
      {children}
    </MemberContext.Provider>
  );
};

export const useMember = () => useContext(MemberContext);
