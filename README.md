# Script Executor

A lightweight Node.js and Express API for remotely executing batch scripts, built primarily for automation. This documentation provides an overview of the project, installation instructions, usage guidelines, and security considerations.

## Overview

The script-executor is designed to enable the remote triggering of batch scripts via a RESTful API. The service offers a simple yet robust interface that can be integrated into various automation workflows. With a focus on ease of use and efficiency, this solution is ideal for systems that require centralized control over script execution.

## Features

- **Remote Execution:** Trigger batch scripts through HTTP requests.
- **Lightweight:** Minimal dependencies and a straightforward design.
- **Built on Node.js & Express:** Leverages popular frameworks for reliability and scalability.
- **Extensible:** Easily integrate and customize for advanced automation needs.

## Requirements

- Node.js (v12 or later)
- Express (included as a dependency)
- A Windows-based environment with support for batch script execution

## Installation

1. **Clone the Repository**
   ```
   git clone https://github.com/PacificSilent/script-executor.git
   ```
2. **Navigate to the Project Directory**
   ```
   cd script-executor
   ```
3. **Install Dependencies**
   ```
   npm install
   ```

## Configuration

Adjust the configuration as needed:

- All batch configurations are done in the `scripts-config.json` file.
- Modify `server.js` or the relevant configuration files to set up your batch script execution paths.
- Configure security measures, such as authentication, to protect access to the API.

## Usage

1. **Start the Server**
   ```
   npm start
   ```
2. **API Endpoint**
   - **Endpoint:** `/execute-script`
   - **Method:** POST
   - **Request Body Example:**
     ```json
     {
       "scriptName": "exampleScript.bat",
       "parameters": ["param1", "param2"]
     }
     ```
3. **Response**
   A successful API call returns a JSON response indicating the execution status of the script.

## Security Considerations

- **Input Validation:** Always validate incoming parameters to prevent unauthorized script execution.
- **Authentication:** Implement authentication (e.g., API keys or tokens) to secure the API.
- **Environment Isolation:** Consider running the API within a secure, isolated environment to reduce risk.

## Contributing

Contributions are welcome! Please fork the repository and submit pull requests for any improvements or bug fixes. For major changes, open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

Made by **[Jona](https://github.com/PacificSilent)** 😊

---
