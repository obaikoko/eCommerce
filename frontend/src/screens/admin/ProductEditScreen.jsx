import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from '../../features/slices/productsApiSlice';
import Meta from '../../components/Meta';

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: 0,

    brand: '',
    category: '',
    countInStock: '',
    description: '',
  });

  const { name, price, brand, category, countInStock, description } = formData;

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductByIdQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const handleFormChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImage(reader.result);
      };
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await updateProduct({
        productId,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
      }).unwrap();
      toast.success('Product updated');
      refetch();
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        brand: product.brand,
        category: product.category,
        countInStock: product.countInStock,
        description: product.description,
      });
    }
  }, [product]);

  return (
    <>
      <Meta title='EditProduct' />
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter name'
                name='name'
                value={name}
                onChange={handleFormChange}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='price'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter price'
                name='price'
                value={price}
                onChange={handleFormChange}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='image'>
              <Form.Label>Image</Form.Label>
              <Form.Control
                label='Choose File'
                onChange={handleImageChange}
                type='file'
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='brand'>
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter brand'
                name='brand'
                value={brand}
                onChange={handleFormChange}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='countInStock'>
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter countInStock'
                name='countInStock'
                value={countInStock}
                onChange={handleFormChange}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='category'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter category'
                name='category'
                value={category}
                onChange={handleFormChange}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter description'
                name='description'
                value={description}
                onChange={handleFormChange}
              ></Form.Control>
            </Form.Group>

            <Button
              type='submit'
              variant='primary'
              style={{ marginTop: '1rem' }}
            >
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
