import axios from 'axios';

export default function handler(req, res) {
  const baseUrl = process.env.NEXT_PUBLIC_URL_RUMATKITA_API;
  const accessToken = req?.headers?.token;

  if (req.method === 'POST') {
    const { role_id, username, email, avatar, name, gender, date_of_birth } = req.body;

    if (!role_id || !username || !email || !avatar || !name || !gender || !date_of_birth) {
      return res.status(400).json({ error: 'Missing required fields in the request body' });
    }

    const headers = {
      Authorization: accessToken
    };

    const bodyReq = {
      role_id,
      username,
      email,
      avatar,
      name,
      gender,
      date_of_birth
    };

    const requestOptions = {
      method: 'POST',
      url: `${baseUrl}api/backoffice/user/create`,
      headers,
      data: bodyReq,
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
            error?.response?.data?.message || 'An error occurred during the request.';
          const statusCode = error?.response?.status || 500;
          if (errorMessage === 'Token has expired') {
            res.status(401).json({ error: errorMessage, status: 401 });
          }
          res.status(statusCode).json({ error: errorMessage });
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
