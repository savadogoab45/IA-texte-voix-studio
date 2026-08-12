/* eslint-disable @typescript-eslint/no-unsafe-return */
"use client";

import * as React from "react";
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext =
  React.createContext<FormFieldContextValue | null>(null);

type FormItemContextValue = {
  id: string;
};

const FormItemContext =
  React.createContext<FormItemContextValue | null>(null);

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

function useFormField() {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);

  if (fieldContext == null) {
    throw new Error("useFormField must be used within <FormField>.");
  }

  if (itemContext == null) {
    throw new Error("useFormField must be used within <FormItem>.");
  }

  const { getFieldState, formState } = useFormContext<FieldValues>();

  const fieldState = getFieldState(fieldContext.name, formState);
  const id = `${itemContext.id}-${fieldContext.name}`;

  return {
    id,
    name: fieldContext.name,
    formItemId: id,
    formDescriptionId: `${id}-description`,
    formMessageId: `${id}-message`,
    ...fieldState,
  };
}

function FormItem({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn("space-y-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  );
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  const { error, id } = useFormField();

  return (
    <Label
      htmlFor={id}
      className={cn(
        error ? "text-destructive" : "",
        className,
      )}
      {...props}
    />
  );
}

function FormControl({
  children,
}: {
  children: React.ReactElement<
    React.InputHTMLAttributes<HTMLInputElement>
  >;
}) {
  const { error, id, formMessageId } = useFormField();

  return React.cloneElement(children, {
    id,
    "aria-invalid": !!error,
    "aria-describedby": error ? formMessageId : undefined,
  });
}

function FormMessage({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField();

  const body =
    typeof error?.message === "string"
      ? error.message
      : children;

  if (!body) {
    return null;
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("text-sm text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  );
}

export {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
};