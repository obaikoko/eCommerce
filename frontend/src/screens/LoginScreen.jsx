import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useLoginMutation } from '../features/slices/userApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import { setCredentials } from '../features/slices/authSlice';
import { toast } from 'react-toastify';
import Meta from '../components/Meta';

const LoginScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = formData;

  const { userInfo } = useSelector((state) => state.auth);

  const [login, { isLoading }] = useLoginMutation();

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
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success(`welcome ${res.firstName}`);
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  return (
    <>
      <Meta title='Login' />
      <FormContainer>
        <h1>Sign in</h1>
        <Form onSubmit={submitHandler}>
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
          <Button
            type='submit'
            variant='primary'
            className='mt-2'
            disabled={isLoading}
          >
            Sign in
          </Button>
          {isLoading && <Loader />}
        </Form>

        <Row className='py-3'>
          <Col>
            New Costomer?
            <Link
              to={redirect ? `/register?redirect=${redirect}` : '/register'}
            >
              Register
            </Link>
          </Col>
        </Row>
      </FormContainer>
    </>
  );
};

export default LoginScreen;
