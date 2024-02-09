import axios from 'axios';

export default function handler(req, res) {
  const baseUrl = process.env.NEXT_PUBLIC_URL_RUMATKITA_API;
  const accessToken = req?.headers?.token;

  if (req.method === 'PUT') {
    const {
      article_id,
      title,
      slug,
      meta_description,
      content,
      media_icon_id,
      article_category_id,
      active,
      is_highlighted
    } = req.body;

    if (!title || !slug || !meta_description) {
      return res.status(400).json({ error: 'Missing required fields in the request body' });
    }

    const headers = {
      Authorization: accessToken
    };

    const bodyReq = {
      article_id,
      article_category_id,
      media_icon_id,
      title,
      slug,
      meta_description,
      active,
      is_highlighted,
      content
    };

    const requestOptions = {
      method: 'PUT',
      url: `${baseUrl}api/backoffice/article-list/update`,
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
        console.error(error);
        if (error.response) {
          const errorMessage =
            error?.response?.data?.message || 'An error occurred during the request.';
          const statusCode = error?.response?.status || 500;
          if (errorMessage === 'Token has expired') {
            res.status(401).json({ error: errorMessage, status: 401 });
          }
          res.status(statusCode).json({ error: errorMessage, errorlag: error });
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
