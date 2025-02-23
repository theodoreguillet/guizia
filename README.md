# Guiziai Generator Service

## Project Description

Guiziai Generator Service is a web service that generates personalized raccoon images based on a user's Twitter profile. This service leverages OpenAI's GPT-4 for text processing and image generation.

## Project Structure

```
guiziai-generator-service/
├── .dockerignore
├── .env.exemple
├── .gitignore
├── .pylintrc
├── Dockerfile
├── Pipfile
├── README.md
├── docker_start.sh
├── pyproject.toml
├── src/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── middleware/
│   │   │   ├── __init__.py
│   │   │   └── auth.py
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── gen-image-personality.py
│   │   │   └── health.py
│   └── index.py
├── tests/
│   └── __init__.py
└── .vscode/
    ├── extensions.json
    ├── launch.json
    └── settings.json
```

## Dependencies

### System Dependencies

- Docker
- Python 3.12

## Installation

### Clone the Repository

```sh
git clone https://github.com/yourusername/guiziai-generator-service.git
cd guiziai-generator-service
```

### Install Python Dependencies

Using Poetry:

```sh
pip install poetry
poetry install
```

## Running the Server

### Using Docker

Build and run the Docker container:

```sh
./docker_start.sh
```

### Using Python

Run the Flask application:

```sh
export FLASK_APP=src/index.py
flask run --host=0.0.0.0 --port=7777
```

## Environment Variables

Create a `.env` file in the root directory and add your environment variables as shown in `.env.exemple`.

## Executing Dev Commands

To execute the development commands defined in the `tool.taskipy.tasks` section, you can use the `task` command followed by the task name. For example:

- To run the tests:
    ```sh
    poetry run task test
    ```

- To run the linter:
    ```sh
    poetry run task lint
    ```

- To run Pylint:
    ```sh
    poetry run task lint_pylint
    ```

- To run MyPy:
    ```sh
    poetry run task lint_mypy
    ```

- To run the post-test tasks:
    ```sh
    poetry run task post_test
    ```

## License

This project is licensed under the MIT License.
