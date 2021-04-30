import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './ProductItem.css';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import TableHead from '@material-ui/core/TableHead';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
// import { TableHead } from '@material-ui/core';
/////////////////////////////

const ProductItem = props => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:5000/api/products/${props.id}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + auth.token
        }
      );
      props.onDelete(props.id);
    } catch (err) { }
  };

  return (

    <React.Fragment>

      <ErrorModal error={error} onClear={clearError} />
      
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="product-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this product? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>
      <li className="product-item">
        <Card className="product-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          {/* /////////// */}
          <div>
            <TableContainer>
              <Table>
                <TableHead>
                <TableRow>
                    <TableCell component="th" scope="row"><h3>Product Name</h3>
                    </TableCell>
                    <TableCell style={{ width: 160 }} >
                      <h3>Quantity</h3>
                    </TableCell>
                    <TableCell style={{ width: 160 }} >
                      <h3>Price</h3>
                    </TableCell>
                    <TableCell style={{ width: 160 }} >
                      <h3>Edit</h3>
                    </TableCell>
                    <TableCell style={{ width: 160 }} >
                      <h3>Delete</h3>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  
                  <TableRow>
                    <TableCell style={{ width: 160 }} >
                      <p>{props.name}</p>
                    </TableCell>
                    <TableCell style={{ width: 160 }} >
                      <p>{props.quantity}</p>
                    </TableCell>
                    <TableCell style={{ width: 160 }} >
                      <p>{props.price}</p>
                    </TableCell>
                    <TableCell style={{ width: 160 }} >
                      <div className="product-item__actions">
                        {auth.userId === props.creatorId && (
                          <Button to={`/products/${props.id}`}><EditIcon/></Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell style={{ width: 160 }} >
                      <div className="product-item__actions">
                        {auth.userId === props.creatorId && (
                          <Button danger onClick={showDeleteWarningHandler}>
                            <DeleteIcon/>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};
export default ProductItem;








