'use client';

import React from 'react';
// import Form, { Field } from 'rc-field-form';
import Input from '../ui/input';
import Form from '../ui/RcForm/Form';
const { Field } = Form;

const nameRules = { required: true, message: '请输入姓名！' };
const maxLengthRules = { max: 4, message: '用户名长度不能超过4个字符' };
const nameValidator = {
  validator: (rule: any, value: string) => {
    console.log('rule', rule);
    if (!/^[\u4e00-\u9fa5]{1,6}$/.test(value)) {
      return Promise.reject('用户名只允许为六位以内中文');
    }
    return Promise.resolve();
  },
};
const passwordRules = { required: true, message: '请输入密码！' };

const MyRCForm = () => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    form.setFieldsValue({ username: 'default' });
  }, [form]);

  const onFinish = (values: any) => {
    console.log('校验成功', values);
  };

  const onFinishFailed = (errorFields: any) => {
    console.log('err', errorFields);
  };

  console.log('render');

  return (
    <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
      <div>
        <h3>MyRCFormPage</h3>
        <Field name="username" rules={[nameRules, nameValidator, maxLengthRules]}>
          <Input placeholder="Username" />
        </Field>

        <Field name="password" rules={[passwordRules]}>
          <Input placeholder="Password" />
        </Field>

        <button type="submit">submit</button>
      </div>
    </Form>
  );
};

export default MyRCForm;
