import { Row, Col } from 'react-bootstrap';
import { useGetProductsQuery } from '../features/slices/productsApiSlice';
import Products from '../components/Products';
import Loader from '../components/Loader';
import Message from '../components/Message.jsx';
import { Link, useParams } from 'react-router-dom';
import Paginate from '../components/Pagination.jsx';
import ProductCarousel from '../components/ProductCarousel.jsx';

const HomeScreen = () => {
  const { keyword, pageNumber } = useParams();
  const { data, error, isLoading } = useGetProductsQuery({
    keyword,
    pageNumber,
  });
  console.log(error);

  return (
    <>
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to='/' className='btn btn-light mb-4'>
          Go Back
        </Link>
      )}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          <p>{error?.data?.message || error.error}</p>
        </Message>
      ) : (
        <>
          <h1>Latest Products</h1>
          <Row>
            {data &&
              data.products.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                  <Products product={product} />
                </Col>
              ))}
          </Row>
          <Paginate pages={data.pages} page={data.page} keyword={keyword} />
        </>
      )}
    </>
  );
};

export default HomeScreen;
