/**
 * This is essentially SelectComponent.tsx except for the typeahead feature
 * of PF.
 * TODO: Allow customization of options, such as isCreatable.
 */

import {
  FormGroup,
  Select,
  SelectOption,
} from '@patternfly/react-core';
import * as React from 'react';
import { useState } from 'react';
import { IFormControlProps } from '../models';
import { FormLabelHintComponent } from './FormLabelHintComponent';
import {
  getHelperText,
  getValidationState,
  toValidHtmlId } from './helpers';

export const FormTypeaheadComponent: React.FunctionComponent<
  IFormControlProps
> = props => {
  // @ts-ignore
  const useOpenTypeahead = initialState => {
    const [isTypeaheadOpen, setTypeaheadOpen] = useState(initialState);

    const toggleTypeaheadOpen = () => {
      const typeaheadOpenState = !isTypeaheadOpen;
      setTypeaheadOpen(typeaheadOpenState);
    };

    return [isTypeaheadOpen, toggleTypeaheadOpen];
  };

  const [isSelectOpen, toggleSelectOpen] = useOpenTypeahead(false);
  const [selectedOption, setSelectedOption] = useState('');

  const { onChange, onBlur, value, ...field } = props.field;

  const id = toValidHtmlId(field.name);

  const handleChange = (
    eventValue: any,
    event: any
  ) => {
    onChange(event);
    setSelectedOption(event);

    toggleSelectOpen(false);
  };

  const handleBlur = (event: any, value?: any) =>
    handleChange('', value);

  const { helperText, helperTextInvalid } = getHelperText(
    props.field.name,
    props.property.description,
    props.form.errors
  );

  return (
    <FormGroup
      label={
        props.property.displayName ? (
          <>
            {props.property.displayName}
            {props.property.labelHint && (
              <FormLabelHintComponent labelHint={props.property.labelHint} />
            )}
          </>
        ) : (
          undefined
        )
      }
      {...props.property.formGroupAttributes}
      fieldId={id}
      isRequired={props.property.required}
      isValid={getValidationState(props)}
      helperText={helperText}
      helperTextInvalid={helperTextInvalid}
    >
      <Select
        {...props.property.fieldAttributes}
        {...field}
        className={'autoform-select'}
        onSelect={handleChange}
        onBlur={handleBlur}
        onToggle={toggleSelectOpen}
        isCreatable={true}
        isExpanded={isSelectOpen}
        data-testid={id}
        id={id}
        aria-label={props.property.displayName || props.field.name}
        isDisabled={props.form.isSubmitting || props.property.disabled}
        title={props.property.controlHint}
        selections={selectedOption}
        //value={selectedOption}
      >
        {(props.property.enum || []).map((opt: any, index: number) => (
          <SelectOption
            key={`${index}-${opt.label}`}
            value={opt.value}
            //value={opt}
            //value={selectedOption}
            //label={opt.label}
          />
        ))}
      </Select>
    </FormGroup>
  );
};
