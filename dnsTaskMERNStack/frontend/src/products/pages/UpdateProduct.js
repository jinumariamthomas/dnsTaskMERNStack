import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './ProductForm.css';

const UpdateProduct = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedProduct, setLoadedProduct] = useState();
  const productId = useParams().productId;
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: '',
        isValid: false
      },
      price: {
        value: null,
        isValid: false
      }
    },
    false
  );

  useEffect(() => {
    const fetchProduct = async () => {
      try {
      
        const responseData = await sendRequest(

          `http://localhost:5000/api/products/${productId}`
        );
        setLoadedProduct(responseData.product);
        setFormData(
          {
            name: {
              value: responseData.product.name,
              isValid: true
            },
            price: {
              value: responseData.product.price,
              isValid: true
            }
          },
          true
        );
      } catch (err) {}
    };
    fetchProduct();
  }, [sendRequest, productId, setFormData]);

  const productUpdateSubmitHandler = async event => {
    
    event.preventDefault();
    try {
      await sendRequest(
        
        `http://localhost:5000/api/products/${productId}`,
        'PATCH',
        JSON.stringify({

          name: formState.inputs.name.value,
          price: formState.inputs.price.value,

        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }

      );

      history.push('/' + auth.userId + '/products');
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedProduct && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find product!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedProduct && (
        <form className="product-form" onSubmit={productUpdateSubmitHandler}>
          <Input
            id="name"
            element="input"
            type="text"
            label="Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid name."
            onInput={inputHandler}
            initialValue={loadedProduct.name}
            initialValid={true}
          />
          <Input
            id="price"
            element="textarea"
            label="Price"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid price "
            onInput={inputHandler}
            initialValue={loadedProduct.price}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE 
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateProduct;
