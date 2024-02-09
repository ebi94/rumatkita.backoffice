const baseUrl = process.env.NEXT_PUBLIC_URL_RUMATKITA_API;
const headers = new Headers();
let userData;
if (typeof window !== 'undefined') {
  userData = JSON.parse(localStorage.getItem('userData'));
}
const token = userData?.data?.access_token;
headers.append('Content-Type', 'application/json');
headers.append('token', `Bearer ${token}`);

const listUser = async () => {
  const requestOptions = {
    method: 'GET',
    headers,
    redirect: 'follow'
  };

  return await fetch(`/api/users/list`, requestOptions).then(async (r) => {
    let result;
    try {
      result = await r.json();
    } catch (e) {
      result = {};
    }

    return { ...result };
  });
};

const addUser = async (payload) => {
  const bodyReq = {
    role_id: payload?.role_id,
    username: payload?.username,
    email: payload?.email,
    avatar: payload?.avatar,
    name: payload?.name,
    gender: payload?.gender,
    date_of_birth: payload?.date_of_birth
  };

  const requestOptions = {
    method: 'POST',
    headers,
    body: JSON.stringify(bodyReq),
    redirect: 'follow'
  };

  return await fetch(`/api/users/add`, requestOptions).then(async (r) => {
    let result;
    try {
      result = await r.json();
    } catch (e) {
      result = {};
    }

    return { ...result };
  });
};

const editUser = async (payload) => {
  const bodyReq = {
    user_id: payload?.user_id,
    role_id: payload?.role_id,
    email: payload?.email,
    avatar: payload?.avatar,
    name: payload?.name,
    gender: payload?.gender,
    date_of_birth: payload?.date_of_birth,
    is_active: payload?.is_active
  };

  const requestOptions = {
    method: 'PUT',
    headers,
    body: JSON.stringify(bodyReq),
    redirect: 'follow'
  };

  return await fetch(`/api/users/edit/`, requestOptions).then(async (r) => {
    let result;
    try {
      result = await r.json();
    } catch (e) {
      result = {};
    }

    return { ...result };
  });
};

const detailUser = async (slug) => {
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

const updateUser = async (slug) => {
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

const deleteUser = async (slug) => {
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

export { listUser, addUser, editUser, detailUser, updateUser, deleteUser };
