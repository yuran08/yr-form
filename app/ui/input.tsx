import React from "react";

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  return <input {...props} />;
};

// const CustomizeInput = ({value = "", ...props}) => (
//   <div style={{padding: 10}}>
//     <Input style={{outline: "none"}} value={value} {...props} />
//   </div>
// );

class CustomizeInput extends React.Component<React.InputHTMLAttributes<HTMLInputElement>> {
  constructor(props: React.InputHTMLAttributes<HTMLInputElement>) {
    super(props);
    this.state = {};
  }
  render() {
    const {value = "", ...otherProps} = this.props;
    return (
      <div style={{padding: 10}}>
        <Input style={{outline: "none"}} value={value} {...otherProps} />
      </div>
    );
  }
}

export default CustomizeInput;