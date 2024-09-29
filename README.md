# 🐶 Woof

Woof is a customer support dashboard and API that supports basic banking functions like customer management, account management, and transfers.

## 🎥 Demo

## 🚀 Running the Project

To run this project, follow these simple steps:

1. Clone the repository to your local machine.
2. Make a copy of the `.env.template` file and rename it to `.env`. Fill in the required environment variables:
   - `API_KEY`: A secret key used to authenticate API requests
   - `POSTGRES_USER`: The username for the PostgreSQL database
   - `POSTGRES_PASSWORD`: The password for the PostgreSQL database
   - `POSTGRES_DB`: The name of the PostgreSQL database
3. Ensure you have Docker installed on your system.
4. Navigate to the project directory in your terminal.
5. Run the command `docker-compose up --build` to start the project.
6. Wait for the containers to start. This might take a couple of minutes.
7. Once the containers are running, you can access the application at `http://localhost:3000`.

That's it! You should now have Woof up and running on your local machine.
