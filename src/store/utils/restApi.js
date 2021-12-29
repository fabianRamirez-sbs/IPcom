import Vue from 'vue'
import axios from 'axios'

const getClient = () => {
  const options = {
    headers: {
      Authorization: `Bearer ${Vue.prototype.$token}`
    }
  }

  const client = axios.create(options)

  client.interceptors.request.use(
    requestConfig => requestConfig,
    requestError => {
      // Raven.captureException(requestError);
      return Promise.reject(requestError)
    }
  )

  client.interceptors.response.use(
    response => response,
    error => {
      return Promise.reject(error)
    }
  )

  return client
}

export default {
  get (url, conf = {}) {
    const client = getClient()
    return client
      .get(url, conf)
      .then(response => Promise.resolve(response))
      .catch(error => Promise.reject(error))
  },

  delete (url, conf = {}) {
    const client = getClient()
    return client
      .delete(url, conf)
      .then(response => Promise.resolve(response))
      .catch(error => Promise.reject(error))
  },

  head (url, conf = {}) {
    const client = getClient()
    return client
      .head(url, conf)
      .then(response => Promise.resolve(response))
      .catch(error => Promise.reject(error))
  },

  options (url, conf = {}) {
    const client = getClient()
    return client
      .options(url, conf)
      .then(response => Promise.resolve(response))
      .catch(error => Promise.reject(error))
  },

  post (url, data = {}, conf = {}) {
    const client = getClient()
    return client
      .post(url, data, conf)
      .then(response => Promise.resolve(response))
      .catch(error => Promise.reject(error))
  },

  put (url, data = {}, conf = {}) {
    const client = getClient()
    return client
      .put(url, data, conf)
      .then(response => Promise.resolve(response))
      .catch(error => Promise.reject(error))
  },

  patch (url, data = {}, conf = {}) {
    const client = getClient()
    return client
      .patch(url, data, conf)
      .then(response => Promise.resolve(response))
      .catch(error => Promise.reject(error))
  },

  /* Download document */
  /*
  -----------  example  ------------

  restApi.get(url, {responseType: 'blob'})
    .then(response => {
      restApi.forceFileDownload(response, 'poliza.pdf');
      resolve(response);
    }, error => {
      reject(error);
    });
    */

  forceFileDownload (response, name = 'file.pdf', openFile = false) {
    const fileURL = window.URL.createObjectURL(new Blob([response.data]))
    const fileLink = document.createElement('a')
    fileLink.href = fileURL
    fileLink.setAttribute('download', `${name}`)
    fileLink.setAttribute('target', '_blank')
    document.body.appendChild(fileLink)
    fileLink.click()
    if (openFile) {
      window.open(fileLink)
    }
  }
  /*  / Download document */
}
