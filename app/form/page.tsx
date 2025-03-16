"use client";

import React, {Component} from "react";
// import {createForm} from "rc-form";
import createForm from "../ui/myForm";


import Input from "../ui/input";

const nameRules = {required: true, message: "请输入姓名！"};
const nameValidator = { validator: (value: string) => {
  if (!/^[\u4e00-\u9fa5]{1,6}$/.test(value)) {
    return "用户名只允许为六位以内中文";
  }
}}
const passwordRules = {required: true, message: "请输入密码！"};

class MyRCForm extends Component<any, any> {
  constructor(props: any) {
    super(props);
    // this.state = {
    //   username: "",
    //   password: ""
    // };
  }

  componentDidMount() {
    this.props.form.setFieldsValue({username: "default"});
  }

  submit = () => {
    const {validateFields} = this.props.form;
    validateFields((err: any, val: any) => {
      if (err) {
        console.log("err", err); //sy-log
      } else {
        console.log("校验成功", val); //sy-log
      }
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <div>
        <h3>MyRCFormPage</h3>
        {getFieldDecorator("username", {rules: [nameRules, nameValidator]})(
          <Input placeholder="Username" />
        )}
        {getFieldDecorator("password", {rules: [passwordRules]})(
          <Input placeholder="Password" />
        )}

        <button onClick={this.submit}>submit</button>
      </div>
    );
  }
}

// HOC higher order component : 是个函数，但是接收组件作为参数，返回一个新的组件
const MyRCFormPage = createForm()(MyRCForm);

export default MyRCFormPage;
