import React from 'react';
import { FormInstance } from './useForm';

export const FieldContext = React.createContext<FormInstance | null>(null);

export const FieldContextProvider = FieldContext.Provider;
