import os
import requests
from typing import Any, Dict, List, Optional, Union, Tuple
from llm_infer import predict_infer


class AIModels:
    """
    Unified LLM inference wrapper for:
      - provider='openai'    -> https://api.openai.com/v1/chat/completions
      - provider='ai_ml_api' -> https://api.aimlapi.com/v1/chat/completions

    Constructor stores 'params' as provided and exposes a 'model' property.
    Use infer(...) for non-streaming chat completion.
    """

    def __init__(self, params: Dict[str, Any]) -> None:
        # Store the raw params as requested so they are available to all methods
        self.params: Dict[str, Any] = params or {}

        # Resolve provider and endpoint
        self.provider: str = self.params.get("provider", "").strip().lower()
        if self.provider not in {"openai", "ai_ml_api"}:
            raise ValueError("Unsupported provider. Use 'openai' or 'ai_ml_api'.")

        # Model + common generation params
        self.model_name: str = self.params.get("model") or ""
        if not self.model_name:
            raise ValueError("Missing required 'model' in params.")

        self.temperature: Optional[float] = self.params.get("temperature")
        self.max_tokens: Optional[int] = self.params.get("max_tokens")
        self.top_p: Optional[float] = self.params.get("top_p")
        self.seed: Optional[int] = self.params.get("seed")

        # Optional: let users override base_url/api_key via params; otherwise use defaults
        if self.provider == "openai":
            self.base_url: str = self.params.get("base_url") or "https://api.openai.com/v1"
            self.api_key: str = self.params.get("api_key") or os.getenv("OPENAI_API_KEY", "")
        else:  # ai_ml_api
            self.base_url = self.params.get("base_url") or "https://api.aimlapi.com/v1"
            self.api_key = self.params.get("api_key") or os.getenv("AIMLAPI_API_KEY", "")

        if not self.api_key:
            raise ValueError(f"Missing API key for provider '{self.provider}'.")

        # Simple 'model' descriptor (property requested by spec)
        self.model: Dict[str, Any] = {
            "provider": self.provider,
            "model": self.model_name,
            "base_url": self.base_url,
        }

        # Precompute endpoint
        self._chat_completions_url: str = f"{self.base_url}/chat/completions"

    # --------- Public API ---------

    def infer(
        self,
        prompt: Optional[str] = None,
        messages: Optional[List[Dict[str, str]]] = None,
        system: Optional[str] = None,
        tools: Optional[List[Dict[str, Any]]] = None,
        tool_choice: Optional[Union[str, Dict[str, Any]]] = None,
        timeout: int = 60,
        extra: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Perform a non-streaming chat completion.
        - Accepts either 'prompt' (string) or 'messages' (OpenAI-format list).
        - Optional 'system' message is prepended when provided.
        - 'tools' and 'tool_choice' are passed through if provided.
        - 'extra' can include any additional OpenAI-compatible params.
        Returns:
          {
            "text": str,        # assistant content or ""
            "raw": dict         # full JSON response
          }
        """
        msgs = self._build_messages(prompt=prompt, messages=messages, system=system)

        payload: Dict[str, Any] = {
            "model": self.model_name,
            "messages": msgs,
        }
        if self.temperature is not None:
            payload["temperature"] = self.temperature
        if self.max_tokens is not None:
            payload["max_tokens"] = self.max_tokens
        if self.top_p is not None:
            payload["top_p"] = self.top_p
        if self.seed is not None:
            payload["seed"] = self.seed
        if tools:
            payload["tools"] = tools
        if tool_choice is not None:
            payload["tool_choice"] = tool_choice

        if extra:
            # Allow user to pass any additional OpenAI-compatible parameters
            payload.update(extra)

        headers = self._headers()
        resp = requests.post(
            self._chat_completions_url,
            headers=headers,
            json=payload,
            timeout=timeout,
        )

        if resp.status_code != 200:
            self._raise_http_error(resp)

        data = resp.json()
        text, _ = self._extract_assistant_content_and_tools(data)
        return {"text": text or "", "raw": data}

    # --------- Helpers ---------

    def _headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    @staticmethod
    def _build_messages(
        prompt: Optional[str],
        messages: Optional[List[Dict[str, str]]],
        system: Optional[str],
    ) -> List[Dict[str, str]]:
        out: List[Dict[str, str]] = []
        if system:
            out.append({"role": "system", "content": system})
        if messages:
            # Assume already in OpenAI format
            out.extend(messages)
        elif prompt:
            out.append({"role": "user", "content": prompt})
        else:
            raise ValueError("Either 'prompt' or 'messages' must be provided.")
        return out

    @staticmethod
    def _extract_assistant_content_and_tools(
        data: Dict[str, Any]
    ) -> Tuple[Optional[str], Optional[List[Dict[str, Any]]]]:
        """
        Extract assistant text and tool calls (if any) from a chat.completions response.
        """
        try:
            choices = data.get("choices", [])
            if not choices:
                return None, None
            msg = choices[0].get("message", {})
            content = msg.get("content")
            tool_calls = msg.get("tool_calls")
            return content, tool_calls
        except Exception:
            return None, None

    @staticmethod
    def _raise_http_error(resp: requests.Response) -> None:
        try:
            payload = resp.json()
        except Exception:
            payload = {"error": {"message": resp.text}}
        err_msg = payload.get("error", {}).get("message") or str(payload)
        raise RuntimeError(f"LLM API error {resp.status_code}: {err_msg}")