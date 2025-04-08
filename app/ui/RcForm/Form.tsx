import useForm, { FormInstance } from './useForm';
import { FieldContextProvider } from './FieldContext';
import Field from './Field';
interface FormProps {
  children: React.ReactNode;
  form: FormInstance;
  onFinish: (values: any) => void;
  onFinishFailed: (errorFields: any) => void;
}

const Form = ({ children, form: formInstance, onFinish, onFinishFailed }: FormProps) => {
  const [form] = useForm(formInstance);

  form.registerCallbacks({ onFinish, onFinishFailed });

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        form.onSubmit();
      }}
    >
      <FieldContextProvider value={form}>{children}</FieldContextProvider>
    </form>
  );
};

Form.useForm = useForm;
Form.Field = Field;

export default Form;
