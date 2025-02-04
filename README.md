# Electricity statistics dashboard
The app has overview for daily statistic list, with sorting and pagination. The overview is responsive, so it's working on desktop and mobile.
You can open the single day view -modal by pressing the table rows. The single day view is unfinished but the modal functionality is working.

You don't need .env file to run the project. I have added all the needed variables to the project as they are public.

## Get started

1. Clone the repository.

2. Make sure you have the database running at postgres://localhost:5432/electricity, according to the instructions here: [solita/dev-academy-spring-2025-exercise](https://github.com/solita/dev-academy-spring-2025-exercise)

3. Install depedencies and run backend
    - In the backend directory, run the following commands:
    ```sh
        npm install
    ```
    ```sh
        npm run dev
    ```
    The backend is now running at port 3001

4. Install depedencies and run frontend
    - In the frontend directory, run the following commands:
    ```sh
        npm install
    ```
    ```sh
        npm run dev
    ```
    The frontend is now running at port 3000 (note, if you're running other projects simultaneously, the port might be differrent)

5. The app is now running and you can start testing at [http://localhost:3000](http://localhost:3000)
