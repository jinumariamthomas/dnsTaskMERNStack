import React, { useContext } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './ProductForm.css';

const NewProduct = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      name: {
        value: '',
        isValid: false
      },
      price: {
        value: null,
        isValid: false
      },
      quantity: {
        value: null,
        isValid: false
      }
     
    },
    false
  );

  const history = useHistory();

  const productSubmitHandler = async event => {
    event.preventDefault();
    try {
      await sendRequest('http://localhost:5000/api/products','POST',JSON.stringify({
        name: formState.inputs.name.value,
        price:formState.inputs.price.value,
        quantity:formState.inputs.quantity.value,
      }),
      {
        Authorization: 'Bearer ' + auth.token,
        'Content-Type': 'application/json'
      }
      );

      history.push('/');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="product-form" onSubmit={productSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="name"
          element="input"
          type="text"
          label="Name"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid name."
          onInput={inputHandler}
        />
        <Input
          id="price"
          element="textarea"
          label="Price"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid price (at least 3 characters)."
          onInput={inputHandler}
        />
        <Input
          id="quantity"
          element="input"
          label="Quantity"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid quantity."
          onInput={inputHandler}
        />
        
        <Button type="submit" disabled={!formState.isValid} >
          ADD PRODUCT
        </Button>
        
      </form>
    </React.Fragment>
  );
};

export default NewProduct;
