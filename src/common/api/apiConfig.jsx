const { protocol, hostname, port } = window.location;

export const API_BASE_URL =  port === "5173" ? `${protocol}//${hostname}:8080/harvest`: window.location.origin + "/harvest";
export const PDF_Download_Name = "harvest";