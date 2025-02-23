# Guizia Twitter Bot

Guizia Twitter Bot is a forked version of [Zerepy](https://github.com/blorm-network/ZerePy).

## Features

### Core Platform

- CLI interface for managing agents
- Modular connection system
- Blockchain integration

### Platform Integrations

- Social Platforms:
  - Twitter/X
- Blockchain Networks:
  - EVM Networks:
    - Sonic

### Language Model Support

- Anthropic

## Requirements

System:

- Python 3.11 or higher
- Poetry 1.5 or higher

Environment Variables:

- LLM: make an account and grab an API key (at least one)
  - Anthropic: https://console.anthropic.com/account/keys
- Social (based on your needs):
  - X API: https://developer.x.com/en/docs/authentication/oauth-1-0a/api-key-and-secret
- On-chain Integration:
  - Sonic: private keys

## Installation

1. First, install Poetry for dependency management if you haven't already:

Follow the steps here to use the official installation: https://python-poetry.org/docs/#installing-with-the-official-installer

2. Clone the repository:

```bash
git clone https://github.com/Shamzamg/GuiziaTwitterBot.git
```

3. Go to the `GuiziaTwitterBot` directory:

```bash
cd GuiziaTwitterBot
```

4. Install dependencies:

```bash
poetry install --no-root
```

This will create a virtual environment and install all required dependencies.

## Usage

1. Activate the virtual environment:

```bash
poetry shell
```

2. Run the application:

```bash
poetry run python main.py
```

## Configure connections & launch Guizia agent

1. Configure your desired connections:

   ```
   configure-connection twitter    # For Twitter/X integration
   configure-connection anthropic  # For Anthropic
   ```

2. Use `list-connections` to see all available connections and their status

3. Load agent (usually guizia is loaded by default, which can be set using the CLI or in agents/general.json):

   ```
   load-agent guizia
   ```

4. Start agent:
   ```
   start
   ```

## Platform Features

### Blockchain Networks

- EVM Networks
  - Sonic
    - Fast EVM transactions
    - Custom slippage settings
    - Token swaps via Sonic DEX
    - Network switching (mainnet/testnet)

### Social Platforms

- Twitter/X

  - Post and reply to tweets
  - Timeline management
  - Engagement features

## Available Commands

Use `help` in the CLI to see all available commands. Key commands include:

- `list-agents`: Show available agents
- `load-agent`: Load a specific agent
- `agent-loop`: Start autonomous behavior
- `agent-action`: Execute single action
- `list-connections`: Show available connections
- `list-actions`: Show available actions for a connection
- `configure-connection`: Set up a new connection
- `chat`: Start interactive chat with agent
- `clear`: Clear the terminal screen

---

Made with ♥ GuiziaTeam
