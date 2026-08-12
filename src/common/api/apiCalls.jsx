import { API_BASE_URL ,PDF_Download_Name } from "./apiConfig.jsx";



export const ApiPostCall = ({endpoint, data, callback }) => {
  
  fetch(API_BASE_URL + endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization":"Bearer "+localStorage.getItem("token")
    },
    body: data ? JSON.stringify(data) : null,
  })
    .then((res) => {
      if (!res.ok) {
        return res.text().then((text) => {
          throw {
            status: res.status,
            message: text || "Server Error",
          };
        });
      }
      return res.json();
    })
    .then((result) => {
      callback?.success && callback.success(result);
    })
    .catch((error) => {
      callback?.error &&
        callback.error({
          message: error.message || "Unable to connect to server",
          status: error.status || 0,
        });
    });
};

export const ApiMultipartPostCall = ({ endpoint, data, callback }) => {
try{
  fetch(API_BASE_URL + endpoint, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    },
    body: data
  })
    .then(async (res) => {
      const text = await res.text();

      if (!res.ok) {
        throw {
          status: res.status,
          message: text || "Server Error",
        };
      }

      return text ? JSON.parse(text) : {};
    })
    .then((result) => {
      callback?.success && callback.success(result);
    })
    .catch((error) => {
      callback?.error &&
        callback.error({
          message: error.message || "Unable to connect to server",
          status: error.status || 0,
        });
    });
  }catch(e){
    console.log(e)
  }
};

export const ApiGetCall = ({ endpoint, params, callback }) => {
  let url = API_BASE_URL + endpoint;

  if (params) {
    const query = new URLSearchParams(params).toString();
    url += `?${query}`;
  }

  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization":"Bearer "+localStorage.getItem("token")
    },
  })
    .then((res) => {
      if (!res.ok) {
        return res.text().then((text) => {
          throw {
            status: res.status,
            message: text || "Server Error",
          };
        });
      }
      return res.json();
    })
    .then((result) => {
      callback?.success && callback.success(result);
    })
    .catch((error) => {
      callback?.error &&
        callback.error({
          message: error.message || "Unable to connect to server",
          status: error.status || 0,
        });
    });
};

export const ApiPutCall = ({endpoint, data, callback }) => {
  fetch(API_BASE_URL + endpoint, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization":"Bearer "+localStorage.getItem("token")
    },
    body: data ? JSON.stringify(data) : null,
  })
    .then((res) => {
      if (!res.ok) {
        return res.text().then((text) => {
          throw {
            status: res.status,
            message: text || "Server Error",
          };
        });
      }
      return res.json();
    })
    .then((result) => {
      callback?.success && callback.success(result);
    })
    .catch((error) => {
      callback?.error &&
        callback.error({
          message: error.message || "Unable to connect to server",
          status: error.status || 0,
        });
    });
};


export const ApiDeleteCall = ({endpoint, callback }) => {
  fetch(API_BASE_URL + endpoint, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization":"Bearer "+localStorage.getItem("token")
    },
  })
    .then((res) => {
      if (!res.ok) {
        return res.text().then((text) => {
          throw {
            status: res.status,
            message: text || "Server Error",
          };
        });
      }
      return res.json();
    })
    .then((result) => {
      callback?.success && callback.success(result);
    })
    .catch((error) => {
      callback?.error &&
        callback.error({
          message: error.message || "Unable to connect to server",
          status: error.status || 0,
        });
    });
};


export const ApiGetExportCall = ({ endpoint, data, callback }) => {
  fetch(API_BASE_URL + endpoint, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  })
    .then(async (res) => {
      const contentType = res.headers.get("content-type") || "";

      if (!res.ok) {
        const errorText = await res.text();
        throw {
          status: res.status,
          message: errorText || "Server Error",
        };
      }

      if (contentType.includes("application/json")) {
        const json = await res.json();

        if (json.code === "401") {
          callback?.success?.(json);
          return null;
        }

        if (json.status === "Failed") {
          callback?.error?.(json);
          return null;
        }

        return null;
      }

      return await res.blob();
    })
    .then((blob) => {
      if (!blob) return;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = PDF_Download_Name || "Report.pdf";

      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);

      callback?.success?.();
    })
    .catch((error) => {
      callback?.error?.({
        message: error.message || "Unable to connect to server",
        status: error.status || 0,
      });
    });
};
export const ApiPostExportCall = ({ endpoint, data, fileName, callback }) => {
  fetch(API_BASE_URL + endpoint, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data || {})
  })
    .then(async (res) => {
      const contentType = res.headers.get("content-type") || "";

      if (!res.ok) {
        const errorText = await res.text();
        throw {
          status: res.status,
          message: errorText || "Server Error",
        };
      }

      // Handle JSON response
      if (contentType.includes("application/json")) {
        const json = await res.json();
        callback?.success?.({
          type: "json",
          data: json
        });
        return null; // stop further processing
      }

      // ✅ IMPORTANT: return blob
      return res.blob();
    })
    .then((blob) => {
      if (!blob) return;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = fileName;

      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);

      callback?.success?.({
        type: "file"
      });
    })
    .catch((error) => {
      callback?.error?.({
        message: error.message || "Unable to connect to server",
        status: error.status || 0,
      });
    });
};

export const ApiGetbarcodePreviewCall = ({ endpoint, params = null, callback }) => {
  let url = API_BASE_URL + endpoint;

  if (params) {
    const query = new URLSearchParams(params).toString();
    url += `?${query}`;
  }

  fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      Accept: "application/pdf"
    },
  })
    .then((res) => {
      if (!res.ok) {
        return res.text().then((text) => {
          throw {
            status: res.status,
            message: text || "Server Error",
          };
        });
      }
      return res.blob();
    })
    .then((blob) => {
      callback?.success?.(blob);
    })
    .catch((error) => {
      callback?.error?.({
        message: error.message || "Unable to connect to server",
        status: error.status || 0,
      });
    });
};


export const ApiPostPICKERSALARYREPORTPreviewCall = async ({ endpoint, data, callback }) => {
  const url = API_BASE_URL + endpoint;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data || {})
    });

    if (!res.ok) {
      const text = await res.text();
      throw {
        status: res.status,
        message: text || "Server Error"
      };
    }
      const contentType = res.headers.get("content-type");
     if (contentType && contentType.includes("application/json")) {
      const json = await res.json();
      callback?.success?.({
        type: "json",
        data: json
      });
      return;
    }

    const blob = await res.blob();
    const urlBlob = window.URL.createObjectURL(blob);
    callback?.success?.(urlBlob);

  } catch (err) {
    callback?.error?.({
      status: err.status || 0,
      message: err.message || "Unable to connect to server"
    });
  }
};

export const downloadIdCardsZip = async ({endpoint, data,data1,callback}) => {
  const url = API_BASE_URL + endpoint;
  const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
        "Accept": "application/pdf",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data || {})
    });

  if (!response.ok) {
    const text = await response.text();
     callback?.error?.({
        type: "json",
        data: "Error"
      });
      return;
  }

  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    const json = await response.json();
    callback?.error?.({
        type: "json",
        data: "Error"
      });
      return;
  }

  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);

  // ✅ Generate current date filename (dd-mm-yyyy)
  const today = new Date();
  const fileName =
    String(today.getDate()).padStart(2, "0") + "-" +
    String(today.getMonth() + 1).padStart(2, "0") + "-" +
    today.getFullYear()+"_" + data1+".zip";

  // ✅ Download
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(downloadUrl);
  callback?.success?.({
        type: "json",
        data: "Success"
      });
  return ;
};