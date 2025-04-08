import React from 'react';
import { FieldProps } from './Field';

export interface FormInstance {
  getFieldValue: (name: string) => any;
  setFieldsValue: (values: Record<string, any>) => void;
  registerCallbacks: (callbacks: Record<string, any>) => void;
  registerField: (field: Field) => () => void;
  onSubmit: () => void;
}

interface FormCallbacks {
  onFinish?: (values: Record<string, any>) => void;
  onFinishFailed?: (error: finishFailedObj) => void;
}

interface finishFailedObj {
  errorFields: FieldError[];
  outOfDate: boolean;
  values: Record<string, any>;
}

interface FieldError {
  name: string[];
  errors: string[];
  warnings: string[];
}

interface Field extends FieldProps {
  forceUpdate: () => void;
}

class Form {
  private state: Record<string, any>;
  private callbacks: FormCallbacks = {};
  private fields: Field[] = [];
  constructor() {
    this.state = {};
  }

  registerField(field: Field) {
    this.fields.push(field);
    this.state[field.name] = field.defaultValue ?? undefined;
    return () => {
      this.fields = this.fields.filter(f => f.name !== field.name);
    };
  }

  registerCallbacks(callbacks: Record<string, any>) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  updateField(name: string) {
    const field = this.fields.find(f => f.name === name);
    if (field) {
      field.forceUpdate();
    }
  }

  getFieldValue(name: string) {
    return this.state[name];
  }

  setFieldsValue(values: Record<string, any>) {
    Object.assign(this.state, values);
    for (const name of Object.keys(values)) {
      this.updateField(name);
    }
  }

  validateFields() {
    const errorFields: FieldError[] = [];
    for (const field of this.fields) {
      const errorField: FieldError = {
        name: [field.name],
        errors: [],
        warnings: [],
      };
      for (const rule of field.rules ?? []) {
        if (rule.required && !this.state[field.name]) {
          errorField.errors.push(rule.message ?? `missing param ${field.name}`);
        }
        if (rule.validator) {
          rule
            .validator(
              { field: field.name, fullField: field.name, type: typeof this.state[field.name] },
              this.state[field.name]
            )
            .catch(message => {
              errorField.errors.push(message);
            });
        }
        if (rule.max && this.state[field.name]?.length > rule.max) {
          errorField.errors.push(rule.message ?? `max length is ${rule.max}`);
        }
        if (rule.min && this.state[field.name]?.length < rule.min) {
          errorField.errors.push(rule.message ?? `min length is ${rule.min}`);
        }
        if (rule.pattern && !rule.pattern.test(this.state[field.name])) {
          errorField.errors.push(rule.message ?? `pattern is not match`);
        }
      }
      if (errorField.errors.length > 0) {
        errorFields.push(errorField);
      }
    }
    return errorFields;
  }

  onSubmit() {
    const validateResult = this.validateFields();
    const { onFinish, onFinishFailed } = this.callbacks;
    if (validateResult.length > 0) {
      onFinishFailed?.({
        errorFields: validateResult,
        outOfDate: false,
        values: { ...this.state },
      });
    } else {
      onFinish?.({ ...this.state });
    }
  }

  getForm() {
    return this;
  }
}

const useForm = (form?: FormInstance) => {
  const formRef = React.useRef<FormInstance>(form || new Form().getForm());
  return [formRef.current];
};

export default useForm;
