from flask import Blueprint, request, jsonify
from app.middleware.auth import require_api_key
from app.utils.personalities import PERSONALITIES_DATA
from typing import TypedDict, cast, List
from openai import OpenAI
import os
from jsonschema import validate
import requests
import random
from twikit import Client as TwikitClient
import asyncio
import json


request_args_schema = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "type": "object",
    "properties": {
        "twitter_username": {"type": "string"},
    },
    "additionalProperties": False,
}


class RequestArgs(TypedDict):
    twitter_username: str


openai = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
)


async def fetch_last_tweet(user_name: str):
    """Récupère le dernier tweet d'un utilisateur"""
    twikit = TwikitClient()

    await twikit.login(
        auth_info_1=os.environ.get("TWITTER_USERNAME"),
        auth_info_2=os.environ.get("TWITTER_EMAIL"),
        password=os.environ.get("TWITTER_PASSWORD"),
        cookies_file="twitter_cookies.json",
    )

    twitter_user = await twikit.get_user_by_screen_name(user_name)
    tweets = await twitter_user.get_tweets("Tweets", count=40)

    last_tweets_text = [tweet.text for tweet in tweets]

    return last_tweets_text


async def get_personality_from_tweets(tweets: list[str]):
    """Récupère la personnalité à partir des tweets"""

    personalities_types = {
        k: {
            "code": v["code"],
            "primary": v["primary"],
            "secondary": v["secondary"],
            "description": v["description"],
        }
        for k, v in PERSONALITIES_DATA.items()
    }

    # Concaténer les tweets
    all_tweets_text = "\n".join(tweets)

    system_prompt = (
        "You are a Twitter bot that analyzes tweets to determine the personality type of the user.\n"
        "The personnality is one of the following: "
        f"{json.dumps(personalities_types, indent=2)}"
        "You must output only the code of the personality type that best fits the tweets."
        f"Output only: {" or ".join(PERSONALITIES_DATA.keys())}"
    )

    prompt = (
        "Based on the following tweets, determine the personality type from the given options.\n\n"
        "Tweets:\n"
        f"{all_tweets_text}\n\n"
        f"Output the code of the personality type that best fits the tweets."
    )

    response = openai.chat.completions.create(
        model="gpt-4-turbo",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt},
        ],
        max_tokens=50,
        temperature=0.7,
    )

    if response.choices[0].message.content is None:
        raise ValueError("No response from OpenAI")

    personality_key = response.choices[0].message.content.strip().lower()

    if personality_key not in PERSONALITIES_DATA:
        raise ValueError("Invalid personality type")

    return personality_key


async def generate_image_prompt(traits: dict[str, str]):
    """Génère un prompt basé sur les traits de personnalité"""
    prompt = (
        f"A digital illustration of an anthropomorphic cartoon-style raccoon in a standing pose, facing right. "
        f"The raccoon fur is {traits['skin']} and wears {traits['body']}. "
        f"On its head, it wears {traits['head']}. Its face has {traits['face']} and shows a {traits['expression']}. "
        f"The background is plain white."
    )
    return prompt


async def generate_image_step1(prompt: str):
    """Envoie le prompt à l'API Replicate pour générer une image"""
    payload = {
        "input": {
            "prompt": prompt,
            "image": "https://i.ibb.co/MyCTpCQB/racoon-2-variant-4-1.png",
            "cfg": 7,
            "prompt_strength": 0.85,
            "steps": 40,
        }
    }
    response = requests.post(
        "https://api.replicate.com/v1/models/stability-ai/stable-diffusion-3.5-large/predictions",
        json=payload,
        headers={
            "Authorization": f"Token {os.environ.get('REPLICATE_API_KEY')}",
            "Content-Type": "application/json",
        },
        timeout=60,
    )
    return response.json()


async def generate_image_step2(prompt: str, step1_image_url: str):
    """Upscale l'image générée"""
    payload = {
        "version": "fe514d99ca66a69724f2a768e132eb17aa5eee343505e5f5e327504012d34903",
        "input": {
            "prompt": f"{prompt} The art style is RAK, cartoon, minimalist, and consistent with the original character.",
            "image": step1_image_url,
            "guidance_scale": 3,
            "prompt_strength": 0.8,
        },
    }
    response = requests.post(
        "https://api.replicate.com/v1/predictions",
        json=payload,
        headers={
            "Authorization": f"Token {os.environ.get('REPLICATE_API_KEY')}",
            "Content-Type": "application/json",
        },
        timeout=60,
    )
    return response.json()


async def wait_for_completion(task_url):
    """Attente que la tâche de génération d'image soit terminée"""
    while True:
        response = requests.get(
            task_url,
            headers={
                "Authorization": f"Token {os.environ.get('REPLICATE_API_KEY')}",
                "Content-Type": "application/json",
            },
            timeout=60,
        ).json()
        status = response.get("status")
        if status == "succeeded":
            return response["output"][0]
        elif status in ["failed", "canceled"]:
            return None
        await asyncio.sleep(2)  # Attendre avant de vérifier à nouveau


def get_random_personality(personality_key: str):
    # Définitions des types de traits
    trait_types = ["skin", "expression", "face", "body", "head"]

    # Définitions des traits par défaut
    default_traits = {
        "skin": "Ash Gray",
        "expression": "Neutral Calm",
        "face": "Natural Raccoon Face",
        "body": "Natural Furry Raccoon",
        "head": "Natural Raccoon Head",
    }

    # Traits optionnels
    optional_traits = ["face", "body", "head"]

    # Probabilité d'utiliser un trait par défaut pour les traits optionnels
    default_traits_probability = {"face": 0.5, "body": 0.7, "head": 0.8}

    # Exemple de données d'entrée pour 'personality'
    personality = PERSONALITIES_DATA[personality_key]

    # Initialisation des traits sélectionnés
    selected_traits: dict[str, str] = {}

    # Traitement du choix des traits
    for t in trait_types:
        use_default_trait = False
        if t in optional_traits:
            use_default_trait = random.random() < default_traits_probability[t]

        if use_default_trait:
            selected_traits[t] = default_traits[t]
        else:
            possible_trait_choices = cast(dict[str, List[str]], personality["traits"]).get(t) or []
            if len(possible_trait_choices) == 0:
                raise ValueError("No possible trait choices")
            selected_traits[t] = random.choice(possible_trait_choices)

    return selected_traits


async def process_gen_image_personality(args: RequestArgs):
    print("Starting image generation process...")

    twitter_username = args.get("twitter_username")
    print(f"Received twitter username: {twitter_username}")

    if twitter_username is not None and len(twitter_username) > 0:
        # Fetching last tweet
        print("Fetching last tweet...")
        last_tweet_data = await fetch_last_tweet(twitter_username)

        # Get personality from last tweets
        print("Getting personality from last tweets...")
        personality_key = await get_personality_from_tweets(last_tweet_data)
    else:
        # Random personality selection
        print("Selecting random personality...")
        personality_key = random.choice(list(PERSONALITIES_DATA.keys()))

    print(f"Personality selected: {personality_key}")

    # Trait Selection
    print("Selecting random traits...")
    selected_traits = get_random_personality(personality_key)
    print(f"Selected traits: {selected_traits}")

    # Image Prompt Generation
    print("Generating image prompt...")
    prompt = await generate_image_prompt(selected_traits)
    if not prompt:
        print("Error: Invalid prompt")
        return jsonify({"error": "Invalid personality"}), 400

    # Image Generation - Step 1
    print("Starting image generation (Step 1)...")
    gen_step1_image_response = await generate_image_step1(prompt)
    if "urls" not in gen_step1_image_response:
        print("Error: Failed to generate image (Step 1)")
        return jsonify({"error": "Failed to generate image step 1"}), 500

    print("Waiting for image completion (Step 1)...")
    step1_image_url = await wait_for_completion(gen_step1_image_response["urls"]["get"])
    if not step1_image_url:
        print("Error: Failed to retrieve image (Step 1)")
        return jsonify({"error": "Failed to generate image step 1"}), 500

    print(f"Step 1 image successfully generated: {step1_image_url}")

    # Image Enhancement - Step 2
    print("Starting image enhancement (Step 2)...")
    gen_step2_image_response = await generate_image_step2(prompt, step1_image_url)
    if "urls" not in gen_step2_image_response:
        print("Error: Failed to generate image (Step 2)")
        return jsonify({"error": "Failed to generate image step 2"}), 500

    print("Waiting for image completion (Step 2)...")
    final_image_url = await wait_for_completion(gen_step2_image_response["urls"]["get"])
    if not final_image_url:
        print("Error: Failed to retrieve image (Step 2)")
        return jsonify({"error": "Failed to generate image step 2"}), 500

    print(f"Final image successfully generated: {final_image_url}")

    print("Process completed, sending response.")
    return (
        jsonify(
            {
                "output": final_image_url,
                "output_step1": step1_image_url,
                "traits": selected_traits,
                "personality": {
                    "code": PERSONALITIES_DATA[personality_key]["code"],
                    "primary": PERSONALITIES_DATA[personality_key]["primary"],
                    "secondary": PERSONALITIES_DATA[personality_key]["secondary"],
                    "description": PERSONALITIES_DATA[personality_key]["description"],
                },
            }
        ),
        200,
    )


###########
# Define route handler
###########


gen_image_personality_bp = Blueprint("gen_image_personality", __name__)


@gen_image_personality_bp.route("/gen-image-personality", methods=["GET"])
@require_api_key
async def route_handler():
    args = request.args
    try:
        validate(instance=args, schema=request_args_schema)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    try:
        return await process_gen_image_personality(args)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
