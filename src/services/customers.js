const baseUrl = process.env.NEXT_PUBLIC_URL_RUMATKITA_API;
const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('token');

const listCustomer = async (offset, limit, category) => {
  const requestOptions = {
    method: 'GET',
    headers,
    redirect: 'follow'
  };

  return await fetch(
    `${baseUrl}/api/public/news/list?offset=${offset}&limit=${limit}&category=${category}&web=acv`,
    requestOptions
  ).then(async (r) => {
    let result;
    try {
      result = await r.json();
    } catch (e) {
      result = {};
    }

    return { ...result };
  });
};

const detailCustomer = async (slug) => {
  const requestOptions = {
    method: 'GET',
    headers,
    redirect: 'follow'
  };

  return await fetch(`${baseUrl}/api/acv/blog/${slug}`, requestOptions).then(async (r) => {
    let result;
    try {
      result = await r.json();
    } catch (e) {
      result = {};
    }

    return { ...result };
  });
};

const updateCustomer = async (slug) => {
  const requestOptions = {
    method: 'GET',
    headers,
    redirect: 'follow'
  };

  return await fetch(`${baseUrl}/api/acv/blog/${slug}`, requestOptions).then(async (r) => {
    let result;
    try {
      result = await r.json();
    } catch (e) {
      result = {};
    }

    return { ...result };
  });
};

const deleteCustomer = async (slug) => {
  const requestOptions = {
    method: 'GET',
    headers,
    redirect: 'follow'
  };

  return await fetch(`${baseUrl}/api/acv/blog/${slug}`, requestOptions).then(async (r) => {
    let result;
    try {
      result = await r.json();
    } catch (e) {
      result = {};
    }

    return { ...result };
  });
};

export { listCustomer, detailCustomer, updateCustomer, deleteCustomer };
