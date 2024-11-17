const Button = ({ children, ...props }) => {
  return (
    <button 
      {...props}
      className={`px-4 py-2 rounded-md ${props.className || ''}`}
    >
      {children}
    </button>
  );
};

export { Button }; 