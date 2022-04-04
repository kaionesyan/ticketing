import { useState, useEffect } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import StripeCheckout from 'react-stripe-checkout';

const OrderDetails = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders'),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();

    const interval = setInterval(findTimeLeft, 1000);

    console.log(interval);

    return () => clearInterval(interval);
  }, []);

  if (timeLeft < 0) {
    return <div>Order expired</div>;
  }

  return (
    <div>
      <h1>Order Details</h1>
      <p>{timeLeft} seconds until order expires</p>
      <StripeCheckout
        token={({ id }) => {
          doRequest({ token: id });
        }}
        stripeKey="pk_test_51KefpLIYeBn4jIaHTYzHwGnO7hzx14v7rAfIW6bEivszm2iZLXjzOlr9pFx2hHx2kh6im0GvWirUjZ1ky9vp9PjY00Eb06kJwb"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderDetails.getInitialProps = async (context, client) => {
  const orderId = context.query.orderId;

  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderDetails;
