const Badge = ({ children, variant = "default", className = "" }) => {
  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    secondary: "bg-gray-200 text-gray-600"
  };

  return (
    <span className={`inline-flex items-center ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

export { Badge }; 