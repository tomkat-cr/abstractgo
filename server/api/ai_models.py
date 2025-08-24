import os
from typing import Any, Dict, List, Optional

import litellm
from openai import OpenAI

from .utilities import get_non_empty_value

DEFAULT_LLM_PROVIDER = "openai"
# DEFAULT_LLM_PROVIDER = "ai_ml_api"

DEFAULT_OPENAI_LLM_MODEL = "gpt-5-nano"
DEFAULT_AIMLAPI_LLM_MODEL = "openai/gpt-4o"

DEFAULT_LLM_TEMPERATURE = "0.5"
DEFAULT_LLM_MAX_TOKENS = "2048"
DEFAULT_LLM_TOP_P = "1.0"
DEFAULT_LLM_SEED = "42"


class AIModels:
    """
    Unified LLM inference wrapper based on liteLLM for:
      - provider='openai'    -> https://api.openai.com/v1/chat/completions
      - provider='ai_ml_api' -> https://api.aimlapi.com/v1/chat/completions

    This class is used to perform inference on a LLM.

    Constructor stores 'params' as provided and exposes a 'model' property.
    Use infer(...) for non-streaming chat completion.
    """

    def __init__(self, params: Dict[str, Any] = None) -> None:
        self.debug = os.environ.get("SERVER_DEBUG", "0") == "1"

        # Store the raw params as requested so they are available to all
        # methods
        self.params: Dict[str, Any] = params or {}

        if self.debug:
            litellm._turn_on_debug()
            print(f"AIModels: {self.params}")

        # Resolve provider and endpoint
        self.provider: str = self.get_env_par_value(
            "provider", "LLM_PROVIDER", DEFAULT_LLM_PROVIDER).strip().lower()

        self.temperature: Optional[float] = self.get_env_par_value(
            "temperature", "LLM_TEMPERATURE", None)
        self.max_tokens: Optional[int] = self.get_env_par_value(
            "max_tokens", "LLM_MAX_TOKENS", None)
        self.top_p: Optional[float] = self.get_env_par_value(
            "top_p", "LLM_TOP_P", None)
        self.seed: Optional[int] = self.get_env_par_value(
            "seed", "LLM_SEED", None)

        self.model_name: str = None
        self.base_url: str = None
        self.api_key: str = None

        # Optional: let users override base_url/api_key via params;
        # otherwise use defaults
        self.is_openai: bool = False
        if self.provider == "openai":
            self.is_openai = True
            self.get_openai_params()
            self.check_llm_api_params()
        elif self.provider == "ai_ml_api":
            self.get_ai_ml_api_params()
            self.check_llm_api_params()
        else:
            raise ValueError(f"Unsupported provider: {self.provider}")

        # Simple 'model' descriptor (property requested by spec)
        self.model: Dict[str, Any] = {
            "provider": self.provider,
            "model": self.model_name,
            "base_url": self.base_url,
            "temperature": self.temperature,
            "max_tokens": self.max_tokens,
            "top_p": self.top_p,
            "seed": self.seed,
            "api_key": self.get_masked_value(self.api_key),
        }

    # --------- Private methods ---------

    def get_env_par_value(self, param_name: str, env_var_name: str,
                          default_value: str = None) -> str:
        """
        Get a parameter value from either params or environment variables.
        """
        resolved_value = self.params.get(param_name)
        if resolved_value is None:
            resolved_value = get_non_empty_value(env_var_name, default_value)
        # if self.debug:
        #     print(f"AIModels | get_env_par_value:"
        #           f"\n | param: {param_name}={self.params.get(param_name)}"
        #           f"\n | env: {env_var_name}={os.environ.get(env_var_name)}"
        #           f"\n | default: {default_value}"
        #           f"\n | resolved_value: {resolved_value}\n")
        return resolved_value

    def check_llm_api_params(self) -> None:
        if not self.api_key:
            raise ValueError(
                f"Missing API key for provider '{self.provider}'.")
        if not self.model_name:
            raise ValueError("Missing required 'model' in params.")

    def get_infer_messages(
        self,
        query: str,
        system: Optional[str] = None,
        attachments: Optional[List[str]] = None,
    ) -> List[Dict[str, Any]]:
        messages = []
        if system:
            messages.insert(0, {"content": system, "role": "system"})
        user_message = {"content": query, "role": "user"}
        if attachments:
            user_message["content"] = []
            for attachment in attachments:
                user_message["content"].append({
                    "type": "input_file",
                    "file_url": attachment.get("url", attachment["file_data"]),
                } if self.is_openai and attachment.get("url") else {
                    "file_data": attachment["file_data"],
                    "filename": attachment["file_name"],
                    "type": "input_file",
                } if self.is_openai and not attachment.get("url") else {
                    "type": "file",
                    "file": {
                        "filename": attachment["file_name"],
                        "file_data": attachment["file_data"],
                    } if not attachment.get("url") else {
                        "filename": attachment["file_name"],
                        "file_url": attachment["url"],
                    }
                })
            user_message["content"].append({
                "type": "input_text" if self.is_openai else "text",
                "text": query}
            )
        messages.append(user_message)

        return messages

    def get_model_args(self) -> Dict[str, Any]:
        model_args = {
            "model": self.model_name,
        }
        if self.api_key:
            model_args["api_key"] = self.api_key
        if self.base_url:
            model_args["base_url"] = self.base_url
        if self.temperature:
            model_args["temperature"] = float(self.temperature)
        if self.max_tokens:
            model_args["max_tokens"] = int(self.max_tokens)
        if self.top_p:
            model_args["top_p"] = float(self.top_p)
        if self.seed:
            model_args["seed"] = int(self.seed)
        return model_args

    def get_litellm_generic_completion(
        self,
        query: str,
        system: Optional[str] = None,
        **kwargs: Any,
    ) -> Dict[str, Any]:
        messages = self.get_infer_messages(
            query=query,
            system=system,
            attachments=kwargs.get("attachments"))
        model_args = self.get_model_args()
        model_args["messages"] = messages
        response = litellm.completion(**model_args)
        if self.debug:
            print(f"AIModels | {self.model_name} | {response}")
            print(f"AIModels | LLM provider: {self.provider}"
                  f" | LLM model: {self.model_name}"
                  f"\nLLM args: {model_args}")
        return response

    def get_masked_value(self, value: str) -> str:
        return value[:5] + "..." + value[-5:]

    # --------- LLM specific params ---------

    def get_ai_ml_api_params(self) -> None:
        self.base_url = self.get_env_par_value(
            "base_url", "AIMLAPI_BASE_URL",
            "https://api.aimlapi.com/v1")
        self.api_key = self.get_env_par_value(
            "api_key", "AIMLAPI_API_KEY", "")
        self.model_name = self.get_env_par_value(
            "model_name", "LLM_MODEL", DEFAULT_AIMLAPI_LLM_MODEL)
        if self.debug:
            print("AIModels | AIMLAPI params:"
                  f"\n | base_url: {self.base_url}"
                  f"\n | api_key: {self.get_masked_value(self.api_key)}"
                  f"\n | model_name: {self.model_name}")

    def get_openai_params(self) -> None:
        self.base_url = self.get_env_par_value(
            "base_url", "OPENAI_BASE_URL",
            "https://api.openai.com/v1")
        self.api_key = self.get_env_par_value(
            "api_key", "OPENAI_API_KEY", "")
        self.model_name = self.get_env_par_value(
            "model", "LLM_MODEL", DEFAULT_OPENAI_LLM_MODEL)
        if self.debug:
            print("AIModels | OpenAI params:"
                  f"\n | base_url: {self.base_url}"
                  f"\n | api_key: {self.get_masked_value(self.api_key)}"
                  f"\n | model: {self.model_name}")

    def get_openai_completion(
        self,
        query: str,
        system: Optional[str] = None,
        **kwargs: Any,
    ) -> Dict[str, Any]:
        messages = self.get_infer_messages(
            query=query,
            system=system,
            attachments=kwargs.get("attachments"))
        model_args = self.get_model_args()
        del model_args["api_key"], model_args["base_url"]
        model_args["input"] = messages
        client_args = {
            "api_key": self.api_key,
            "base_url": self.base_url,
        }

        if self.debug:
            print(f"AIModels | get_openai_completion() - {self.model_name}"
                  f"\n | model_args: {model_args}"
                  f"\n | client_args: {client_args}")

        client = OpenAI(**client_args)
        response = client.responses.create(**model_args)
        return response

    def get_ai_ml_api_completion(
        self,
        query: str,
        system: Optional[str] = None,
        **kwargs: Any,
    ) -> Dict[str, Any]:
        return self.get_litellm_generic_completion(query, system, **kwargs)

    # --------- Public API ---------

    def infer(
        self,
        query: str,
        system: Optional[str] = None,
        attachments: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        """
        Perform a non-streaming chat completion.

        Args:
          query: The user's query.
          system: Optional system message to prepend to the query.

        Returns:
          {
            "text": str,        # assistant content or ""
            "raw": dict         # full JSON response
          }
        """
        if self.provider == "openai":
            model_response = self.get_openai_completion(
                query=query,
                system=system,
                attachments=attachments)
        elif self.provider == "ai_ml_api":
            model_response = self.get_ai_ml_api_completion(
                query=query,
                system=system,
                attachments=attachments)
        else:
            raise ValueError(f"Unsupported provider: {self.provider}")

        if self.debug:
            print(f"AIModels | Infer() - {self.provider} | {self.model_name}")
            print(f"AIModels | model_response: {model_response}")

        text = model_response.output_text if self.is_openai \
            else model_response.choices[0].message.content

        return {
            "text": (text or "ERROR: No LLM response"),
            "raw": model_response
        }
