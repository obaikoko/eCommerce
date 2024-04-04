import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../features/slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';
import Meta from '../components/Meta';

const ShippingScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  const [formData, setFormData] = useState({
    address: shippingAddress?.address || '',
    city: shippingAddress?.city || '',
    postalCode: shippingAddress?.postalCode || '',
    country: shippingAddress?.country || '',
  });

  const { address, city, postalCode, country } = formData;

  const handleFormChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate('/payment');
  };

  return (
    <FormContainer>
      <Meta title='Shipping' />
      <CheckoutSteps step1 step2 />
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='address' className='my-2'>
          <Form.Label>Address</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter address'
            name='address'
            value={address}
            required
            onChange={handleFormChange}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='city' className='my-2'>
          <Form.Label>City</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter city'
            name='city'
            value={city}
            required
            onChange={handleFormChange}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='postalCode' className='my-2'>
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter postalCode'
            name='postalCode'
            value={postalCode}
            required
            onChange={handleFormChange}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='country' className='my-2'>
          <Form.Label>Country</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter country'
            name='country'
            value={country}
            required
            onChange={handleFormChange}
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary' className='my-2'>
          continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingScreen;
