class ApiResponse {
  constructor(statusCode = 200, message, data = [], status = true) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.status = status;
  }
}

export { ApiResponse };
