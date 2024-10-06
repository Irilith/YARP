# YARP - Yet Another Roblox Panel

A comprehensive Roblox panel for tracking and managing your games.

## Table of Contents

<details>
<summary>Click to expand</summary>

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  <details>
  <summary>Expand installation steps</summary>

  - [Install Rust](#install-rust)
  - [Install Bun](#install-bun)
  - [Install PostgreSQL and set up the database](#install-postgresql-and-set-up-the-database)
  - [Install the dependencies](#install-the-dependencies)
  - [Configure the database connection](#configure-the-database-connection)
  - [Run the backend](#run-the-backend)
  - [Run the frontend](#run-the-frontend)
  </details>
- [Usage](#usage)
  <details>
  <summary>Expand usage details</summary>

  - [Using YARP from Different Machines](#using-yarp-from-different-machines)
  </details>
- [Important Notes](#important-notes)
- [How to self-host and expose the panel to the internet](#how-to-self-host-and-expose-the-panel-to-the-internet)
- [Contributing](#contributing)
- [Disclaimer](#disclaimer)
- [License](#license)

</details>


## Features

- Real-time game statistics tracking
- User-friendly dashboard for data visualization
- Data Export (Coming Soon if i feel like it)
- Basic Analytics (Coming Soon if i feel like it)
- Security Features (Coming Soon if i feel like it)

## Prerequisites

- **Rust** (for backend)
- **Bun** or another JavaScript runtime (for frontend)
- **PostgreSQL** database

## Installation

1. **Install Rust**
2. **Install Bun** (or your preferred JavaScript runtime)
3. **Install PostgreSQL** and set up the database
4. **Install dependencies**
5. **Configure the database connection**
6. **Run the backend**
7. **Run the frontend**

### Install Rust

Linux/macOS:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Windows:

Download and run the installer from [rustup.rs](https://rustup.rs/).

### Install Bun

Linux/macOS:

```bash
curl -fsSL https://bun.sh/install | bash
```

Windows:

```bash
powershell -c "iwr bun.sh/install.ps1 -useb | iex"
```

### Install PostgreSQL and set up the database

1. Download and install PostgreSQL from the official website: [https://www.postgresql.org/download/](https://www.postgresql.org/download/)
2. Create a new database for YARP.
3. Navigate to the `SQL` folder in the project.
4. Execute the SQL scripts within the folder to create the necessary tables for your database.

### Install Dependencies

> [!WARNING]
>  Ensure you run the PostgreSQL database first and set up the tables before proceeding.

```bash
# Install backend dependencies
cd back_end
cargo build --release

# Install frontend dependencies
cd ../front_end
bun install
```

- Additionally, you can run `bun install` in the root directory to install `prettier`.

### Configure the Database Connection

1. Create a copy of the `.env.example` file and name it `.env` in the `back_end` directory.
2. Modify the `DATABASE_URL` variable within the `.env` file to reflect your PostgreSQL connection details:

```
DATABASE_URL=postgres://username:password@localhost/database_name
```

Replace `username`, `password`, and `database_name` with your actual PostgreSQL credentials and database name.

### Run the Backend

```bash
bun back
# OR
cd back_end
cargo run --release
```

### Run the Frontend

```bash
bun front # You must install the dependencies in the front_end folder first.
# OR
cd front_end
bun run dev
```

## Usage

1. Open the provided link in your browser.
2. Log in using the credentials provided when you started the backend.
3. Begin tracking and analyzing your game statistics.

## Using YARP from Different Machines

1. To access YARP from multiple devices, you need to expose the backend to the internet. Exposing the frontend is optional, as you can simply update the backend IP in the frontend configuration.
2. Refer to the [How to self-host and expose the panel to the internet](#how-to-self-host-and-expose-the-panel-to-the-internet) section below for instructions on exposing your YARP installation to the internet.
3. Update any necessary configuration files or environment variables with the new public IP or domain name once exposed.
4. Remember to implement appropriate security measures, such as strong authentication and encryption, when exposing your panel to the internet.

## Important Notes

- YARP is not designed for commercial use and may not be suitable for all use cases. It is recommended for personal use only.
- You need to create a custom script to send data from your Roblox game to the panel. Below is an example using Python:

```python
import requests
url = "http://127.0.0.1:8081/data/anime_defender"

payload = {
    "key": "Your auth key there",
    # You can get your key using this API:
    # http://your_ip:8081/users?username=admin&password=admin
    # Then, use the key in the payload.
    "username": "a1dmin2",
    "computer": "pc_2",
    "gem": 1012221,
    "ticket": 5,
    "gold": 20020,
    "rr": 10,
    "dice": 3,
    "frost_bind": 1,
    "random": 2 # When creating your script, make this value a random number between 1-99999.
}
headers = {
    "Content-Type": "application/json",
    "User-Agent": "YARP/1.0.0"
}

response = requests.request("PUT", url, json=payload, headers=headers)

print(response.status_code) # 200 typically indicates success.
```

Remember to replace placeholder values with your actual data and implement proper error handling and security measures in your production code.

## How to Self-Host and Expose the Panel to the Internet

> [!CAUTION]
> YARP is not designed for public use due to its lack of security measures (such as rate limiting, CAPTCHA, or other protections). Use at your own risk.

There are two main approaches to hosting and exposing YARP:

1. **Self-Hosting on Your Local Machine:**
   - Set up port forwarding on your router to expose the panel to the internet.
   - Research port forwarding techniques specific to your router model. This process typically involves accessing your router's admin panel and configuring port forwarding rules.
   - Be aware that port forwarding might not be possible in certain situations, such as when using public Wi-Fi, living in shared accommodations, or if you lack administrative access to the network router.
   - Consider using a VPN service with port forwarding capabilities as an alternative if direct port forwarding is not feasible.

2. **Cloud Hosting:**
   - For a more robust and scalable solution, consider using cloud services:
       - **Frontend:** Deploy using platforms like Vercel, Netlify, or GitHub Pages.
       - **Backend:** Host on services such as Heroku, DigitalOcean, Shuttle, or AWS Elastic Beanstalk.
       - **Database:** Use Neo.tech for hosting your PostgreSQL database.

These are recommended options for hosting YARP, but you can also use other cloud services you prefer or self-hosting options.

## Contributing

Contributions are welcome!

## Disclaimer

This project is not affiliated with, endorsed by, or associated with Roblox Corporation or any games mentioned in the project (such as Anime Defenders). The use of this project is at your own risk and responsibility.

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.
