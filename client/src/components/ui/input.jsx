const Input = (props) => {
  return (
    <input
      {...props}
      className={`px-3 py-2 border rounded-md ${props.className || ''}`}
    />
  );
};

export { Input }; 