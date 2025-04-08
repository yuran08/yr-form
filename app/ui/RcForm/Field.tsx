import React from 'react';
import { FieldContext } from './FieldContext';

type ValidaterRule = {
  field: string;
  fullField: string;
  type:
    | 'string'
    | 'number'
    | 'bigint'
    | 'boolean'
    | 'symbol'
    | 'undefined'
    | 'null'
    | 'object'
    | 'array'
    | 'date'
    | 'function';
};
type Validator = (rule: ValidaterRule, value: any) => Promise<void>;

interface Rule {
  required?: boolean;
  message?: string;
  pattern?: RegExp;
  validator?: Validator;
  max?: number;
  min?: number;
}

export interface FieldProps {
  name: string;
  children: React.ReactElement;
  rules?: Rule[];
  defaultValue?: any;
}

const Field = (props: FieldProps) => {
  const { name, children } = props;
  const form = React.useContext(FieldContext);
  const forceUpdate = React.useReducer(x => x + 1, 0)[1];

  React.useEffect(() => {
    const unregister = form?.registerField({ ...props, forceUpdate });
    return () => {
      unregister?.();
    };
  }, [form, forceUpdate, props]);

  console.log('field render', name);

  const getControl = () => ({
    value: form?.getFieldValue(name),
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      form?.setFieldsValue({ [name]: e.target.value });
    },
  });

  return React.cloneElement(children, getControl());
};

export default Field;
