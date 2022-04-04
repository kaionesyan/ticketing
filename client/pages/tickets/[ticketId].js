import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const TicketDetails = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      Router.push('/orders/[orderId]', `/orders/${order.id}`),
  });

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>{ticket.price}</h4>
      {errors}
      <button onClick={() => doRequest()} className="btn btn-primary">
        Purchase
      </button>
    </div>
  );
};

TicketDetails.getInitialProps = async (context, client) => {
  const { data } = await client.get(`/api/tickets/${context.query.ticketId}`);

  return {
    ticket: data,
  };
};

export default TicketDetails;
