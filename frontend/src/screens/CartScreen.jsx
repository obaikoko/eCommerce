import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  Form,
  Row,
  Col,
  ListGroup,
  Card,
  Image,
  Button,
} from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import Message from '../components/Message';
import { addToCart } from '../features/slices/cartSlice';
import { removeFromCart } from '../features/slices/cartSlice';
import Meta from '../components/Meta';

const CartScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const cart = useSelector((state) => state.cart);
  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };
  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };
  const { cartItems } = cart;

  const checkOutHandler = () => {
    if (userInfo) {
      navigate('/shipping');
    } else {
      navigate('/login');
    }
    // navigate('/login?redirect=shipping');
  };
  return (
    <>
      <Meta title='Cart' />
      <Row>
        <Col md={8}>
          <h1 style={{ marginBottom: '20px' }}> Shopping Cart</h1>
          {cartItems.length === 0 ? (
            <>
              <Message>Your Cart is Empty</Message>
              <Link to='/'>Go back</Link>
            </>
          ) : (
            <ListGroup varient='flush'>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row>
                    <Col md={2}>
                      <Image
                        src={item.image.url}
                        alt={item.name}
                        fluid
                        rounded
                      />
                    </Col>
                    <Col md={3}>
                      <Link to={`/product/${item._id}`}>{item.name}</Link>
                    </Col>
                    <Col md={2}>$ {item.price}</Col>
                    <Col>
                      <Form.Control
                        as='select'
                        value={item.qty}
                        onChange={(e) =>
                          addToCartHandler(item, Number(e.target.value))
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col md={2}>
                      <Button
                        type='button'
                        variant='light'
                        onClick={() => removeFromCartHandler(item._id)}
                      >
                        <FaTrash />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup varient='flush'>
              <ListGroup.Item>
                <h2>
                  SubTotal({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                  items
                </h2>
                $
                {cartItems
                  .reduce((acc, item) => acc + item.price * item.qty, 0)
                  .toFixed(2)}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block'
                  disabled={cartItems.length === 0}
                  onClick={checkOutHandler}
                >
                  Proceed to checkout
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CartScreen;
