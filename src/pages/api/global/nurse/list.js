import axios from 'axios';

export default function handler(req, res) {
  const baseUrl = process.env.NEXT_PUBLIC_URL_RUMATKITA_API;
  const accessToken = req?.headers?.token;

  const { searchParams } = new URL(`${baseUrl}${req.url}`);
  const id = searchParams.get('clinic_id');
  const bookingCode = searchParams.get('booking_code');

  if (req.method === 'GET') {
    const headers = {
      Authorization: accessToken
    };
    const requestOptions = {
      method: 'GET',
      url: `${baseUrl}api/backoffice/order-management/order-homecare/nurse-list/${id}/${bookingCode}`,
      headers,
      redirect: 'follow'
    };

    axios
      .request(requestOptions)
      .then(function (response) {
        res.status(200).json({
          result: {
            status: response?.status,
            data: response?.data?.data,
            message: response?.data?.message
          }
        });
      })
      .catch(function (error) {
        if (error.response) {
          const errorMessage =
            error?.response?.data?.message || `An error occurred during the request. ${error}`;
          const statusCode = error?.response?.status || 500;
          if (errorMessage === 'Token has expired') {
            res.status(401).json({ error: errorMessage, status: 401 });
          }
          res
            .status(statusCode)
            .json({ error: `${errorMessage} ${id} ${bookingCode} ${req} ${requestOptions}` });
        } else if (error.request) {
          res.status(500).json({ error: 'No response received from the server.' });
        } else {
          res.status(500).json({ error: 'An unexpected error occurred.' });
        }
      });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
