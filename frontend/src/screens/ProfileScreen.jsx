import React, { useEffect, useState } from 'react';
import { Table, Form, Button, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa';

import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useProfileMutation } from '../features/slices/userApiSlice';
import { useGetMyOrdersQuery } from '../features/slices/ordersApiSlice';
import { setCredentials } from '../features/slices/authSlice';
import Meta from '../components/Meta';

const ProfileScreen = () => {
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    email: '',
    password: '',
    password2: '',
  });

  const { firstName, lastName, email, password, password2 } = formData;

  const { userInfo } = useSelector((state) => state.auth);

  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    setFormData({
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email,
      password: '',
    });
  }, [userInfo.email, userInfo.firstName, userInfo.lastName]);

  const dispatch = useDispatch();

  const handleFormChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password && password !== password2) {
      toast.error('Passwords do not match');
    } else {
      try {
        const res = await updateProfile({
          firstName,
          lastName,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success('Profile updated successfully');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <Meta title='Profile'/>
      <Row>
        <Col md={3}>
          <h2>User Profile</h2>

          <Form onSubmit={submitHandler}>
            <Form.Group className='my-2' controlId='firstName'>
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter First Name'
                name='firstName'
                value={firstName}
                onChange={handleFormChange}
              ></Form.Control>
            </Form.Group>
            <Form.Group className='my-2' controlId='lastName'>
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Last Name'
                name='lastName'
                value={lastName}
                onChange={handleFormChange}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='my-2' controlId='email'>
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter email'
                name='email'
                value={email}
                onChange={handleFormChange}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='my-2' controlId='password'>
              <Form.Label>Change Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Enter new password'
                name='password'
                value={password}
                onChange={handleFormChange}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='my-2' controlId='password2'>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Confirm password'
                name='password2'
                value={password2}
                onChange={handleFormChange}
              ></Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary'>
              Update
            </Button>
            {loadingUpdateProfile && <Loader />}
          </Form>
        </Col>
        <Col md={9}>
          <h2>My Orders</h2>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant='danger'>
              {error?.data?.message || error.error}
            </Message>
          ) : (
            <Table striped hover responsive className='table-sm'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>PAID</th>
                  <th>DELIVERED</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>{order.totalPrice}</td>
                    <td>
                      {order.isPaid ? (
                        order.paidAt.substring(0, 10)
                      ) : (
                        <FaTimes style={{ color: 'red' }} />
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        order.deliveredAt.substring(0, 10)
                      ) : (
                        <FaTimes style={{ color: 'red' }} />
                      )}
                    </td>
                    <td>
                      <LinkContainer to={`/order/${order._id}`}>
                        <Button className='btn-sm' variant='light'>
                          Details
                        </Button>
                      </LinkContainer>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </>
  );
};

export default ProfileScreen;
