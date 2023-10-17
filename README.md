# Beatline 🎉🎉

## Overview

Beatline is a game about placing songs on a time line! Play it with your friends and show them that YOU are the song master.

The projects uses Svelte and Sveltekit for frontend and Express for backend. The gameplay is leveraged using Socket.io and it is all setup with docker to make everyone able to play!

## Technologies Used

- **Svelte/SvelteKit:** For building the interactive frontend.
- **Express:** Used in the backend to set up the server.
- **Socket.io:** Enables real-time, bidirectional and event-based communication.
- **Docker:** Used for containerizing the application.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed:
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/)

### Installation & Setup

1. **Clone the repository**

    First, clone the repository to your local machine. Open your terminal and run:
    ```bash
    git clone git@github.com:DH2643-2023-Group9/Beatline.git
    ```

    Navigate to the project directory:
    ```bash
    cd Beatline
    ```

2. **Configure Environment Variables**

    You need to set up your environment variables before you start the application.

    Inside the frontend directory, create a new file named `.env` and input your variables:
    ```bash
    cd frontend
    touch .env
    ```

    Open `.env` file and insert the environment variables (If you dont have them ask us!)

    Make sure to save your changes.

3. **Build and Run with Docker**

    Go back to the root of the project directory and use docker-compose to build and start the containers:

    ```bash
    cd ..
    docker-compose up --build
    ```

    This command will build the necessary images and start the containers based on the `docker-compose.yml` file configurations.

## Usage

After your setup is complete, you can visit `http://localhost` in your browser to view the frontend application

## Contribution

Please read [CONTRIBUTING.md](CONTRIBUTING.md) to know who did what in this project


