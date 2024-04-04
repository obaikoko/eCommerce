import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from '../../features/slices/userApiSlice';
import Meta from '../../components/Meta';

const UserEditScreen = () => {
  const { id: userId } = useParams();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    isAdmin: false,
  });

  const [isAdmin, setIsAdmin] = useState(false);

  const { firstName, lastName, email } = formData;

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useGetUserDetailsQuery(userId);

  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  const navigate = useNavigate();

  const handleFormChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.value]: e.target.name,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ userId, firstName, lastName, email, isAdmin });
      toast.success('user updated successfully');
      refetch();
      navigate('/admin/userlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    }
  }, [user]);

  return (
    <>
      <Meta title='EditUser' />
      <Link to='/admin/userlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit User</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>
            {error?.data?.message || error.error}
          </Message>
        ) : (
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

            <Form.Group className='my-2' controlId='isadmin'>
              <Form.Check
                type='checkbox'
                label='Is Admin'
                // name={isAdmin}
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
            </Form.Group>

            <Button type='submit' variant='primary'>
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default UserEditScreen;
