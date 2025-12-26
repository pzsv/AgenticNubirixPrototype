# Data Centre Migration Prototype

This is a FastAPI-based prototype for a Data Centre Migration application.

## Modules

1. **Prepare**: Ingest or manually input configuration items (Servers, VMs, DBs, etc.).
2. **Map**: Group CIs into workloads, define relationships and dependencies.
3. **Plan**: Organize workloads into migration waves and get strategy recommendations.
4. **Move**: Generate and manage migration runbooks based on templates.
5. **Evaluate**: View dashboards and reports on migration progress, TCO, ESG, and risks.

## Getting Started

### Prerequisites

- Python 3.8+
- Dependencies listed in `requirements.txt`

### Installation

```bash
pip install -r requirements.txt
```

### Configuration

The application configuration is stored in `config.yaml`. You can configure:
- **Application Settings**:
    - `title`: Application title.
    - `description`: Application description.
    - `version`: Application version.
    - `root_url`: The base URL where the application is hosted.
    - `host`: The interface to bind the server to (e.g., `0.0.0.0`).
    - `port`: The port to listen on.
    - `reload`: Enable or disable auto-reload.
- **Database Settings**:
    - `url`: Database connection URL (e.g., `sqlite:///./prototype.db`).
    - `username`: Database username.
    - `password`: Database password.

Most of these can be overridden by environment variables:
- `APP_HOST` overrides `app.host`
- `APP_PORT` overrides `app.port`
- `APP_RELOAD` overrides `app.reload`

### Running the Application

```bash
python main.py
```
The application UI will be available at `http://localhost:8000`.
Interactive API documentation (Swagger UI) is at `http://localhost:8000/docs`.
The raw API status can be checked at `http://localhost:8000/api-status`.

Alternatively, run with uvicorn:
```bash
uvicorn main:app --reload
```

### Troubleshooting: Address already in use

If you see `ERROR: [Errno 48] Address already in use`, it means port 8000 is taken.

**Option 1: Use a different port**
```bash
# Using python script
APP_PORT=8080 python main.py

# Using uvicorn directly
uvicorn main:app --reload --port 8080
```

**Option 2: Find and kill the process using port 8000**
```bash
# On macOS/Linux
lsof -i :8000
kill -9 <PID>
```

### Using the API

The application follows a linear workflow:
1. **Prepare**: Start by adding CIs via `POST /prepare/items` or uploading a CSV/Excel via `POST /prepare/ingest`.
2. **Map**: Group your CIs into workloads via `POST /map/workloads`.
3. **Plan**: Create migration waves via `POST /plan/waves`.
4. **Move**: Generate runbooks via `POST /move/generate/{workload_id}`.
5. **Evaluate**: Check the overall status at `GET /evaluate/dashboard`.

## Deployment on AWS EC2

### Initial Deployment
Follow the instructions provided in the deployment guide using `deploy_ec2.sh`.

### Updating the Code
When you make changes to your code and push them to your repository, you can update the EC2 instance by following these steps:

1.  SSH into your EC2 instance:
    ```bash
    ssh -i "your-key.pem" ubuntu@<EC2-PUBLIC-IP>
    ```
2.  Navigate to the project directory:
    ```bash
    cd AgenticNubirixPrototype
    ```
3.  Run the update script:
    ```bash
    chmod +x update_ec2.sh
    ./update_ec2.sh
    ```

The `update_ec2.sh` script will:
- Pull the latest code from `main`.
- Update Python dependencies.
- Restart the `nubirix` service.
