import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import ProductItem from './ProductItem';
import Button from '../../shared/components/FormElements/Button';
import './ProductList.css';

const ProductList = props => {
  if (props.items.length === 0) {
    return (
      <div className="product-list center">
        <Card>
          <h2>Dash board is empty</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="product-list">
      {props.items.map(product => (
        <ProductItem
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          quantity={product.quantity}
          creatorId={product.creator}
          coordinates={product.location}
          onDelete={props.onDeleteProduct}
          
        />

        
      ))}
        {/* <h2>Latest products</h2> */}
    </ul>
    
  );
};

export default ProductList;
