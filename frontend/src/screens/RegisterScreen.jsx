import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useRegisterMutation } from '../features/slices/userApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import { setCredentials } from '../features/slices/authSlice';
import { toast } from 'react-toastify';
import Meta from '../components/Meta';
const RegisterScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    email: '',
    password: '',
    password2: '',
  });

  const { firstName, lastName, email, password, password2 } = formData;

  const { userInfo } = useSelector((state) => state.auth);

  const [register, { isLoading }] = useRegisterMutation();
  const { search } = useLocation();

  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect, navigate);
    }
  }, [userInfo, redirect, navigate]);
  const handleFormChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      toast.error('Password do not match');
    } else {
      try {
        const res = await register({
          firstName,
          lastName,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
        toast.success(`welcome ${res.firstName}`);
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    }
  };

  return (
    <>
      <Meta title='Register' />

      <FormContainer>
        <h1>Sign in</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='firstName' className='my-3'>
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type='text'
              name='firstName'
              value={firstName}
              placeholder='Enter your firstName'
              onChange={handleFormChange}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='email' className='my-3'>
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type='text'
              name='lastName'
              value={lastName}
              placeholder='Enter your lastName'
              onChange={handleFormChange}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='email' className='my-3'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type='email'
              name='email'
              value={email}
              placeholder='Enter your email'
              onChange={handleFormChange}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='password' className='my-3'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              name='password'
              value={password}
              placeholder='Enter your password'
              onChange={handleFormChange}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='password2' className='my-3'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type='password'
              name='password2'
              value={password2}
              placeholder='Confirm password'
              onChange={handleFormChange}
            ></Form.Control>
          </Form.Group>

          <Button
            disabled={isLoading}
            type='submit'
            variant='primary'
            className='mt-2'
          >
            Sign in
          </Button>
          {isLoading && <Loader />}
        </Form>

        <Row className='py-3'>
          <Col>
            Already have an account?
            <Link to='/login'>Sign in</Link>
          </Col>
        </Row>
      </FormContainer>
    </>
  );
};

export default RegisterScreen;
