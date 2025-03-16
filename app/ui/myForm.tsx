import React from "react";

type Options = {
  rules: ({
    required: boolean,
    message: string,
  } | {
    validator: (value: any) => string | undefined,
  })[]
}


export default function CreateForm(options?: any) {

  console.log(options, "options"); //sy-log

  return function (Component: React.ComponentType<any>) {
    return class MyForm extends React.Component<any, any> {
      options: Record<string, any> = {};

      constructor(props: any) {
        super(props);
        this.state = {}
        this.options = {}
      }

      form = {
        getFieldsValue: () => ({...this.state}),
        setFieldsValue: (value: object) => this.setState(value),
        validateFields: (callback: (err: any, val: any) => void) => {
          const err: Record<string, string>[] = []

          for (const [key, value] of Object.entries(this.options)) {
            if (value.rules.length > 0) {
              for (const rule of value.rules) {
                if (rule.required && !this.state[key]) {
                  err.push({[key]: rule.message});
                } else if (rule.validator && typeof rule.validator === "function" && this.state[key]) {
                  const res = rule.validator(this.state[key]);
                  if (res) {
                    err.push({[key]: res});
                  }
                }
              }
            }
          }

          if (err.length > 0) {
            callback(err, this.state);
            console.error("Form validate failed", err); //sy-log
          } else {
            callback(null, this.state);
          }
        },
        getFieldDecorator: (field: string, options?: Options) => { 
          return (component: React.ReactElement<any>) => {
            this.options[field] = options;
            return React.cloneElement(component, {
              value: this.state[field],
              onChange: (e: any) => {
              this.setState({
                [field]: e.target.value,
              });
            },
          });
        }},
      };

      render() {
        return <Component form={this.form} />;
      }
    };
  };
}
