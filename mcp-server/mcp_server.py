#!/usr/bin/env python3
"""
AbstractGo MCP Server
A Model Context Protocol server that exposes the AbstractGo API.
Based on the AbstractGo's server/api/main.py
"""
import os
import json
from typing import Dict, Any

# For MCP Server
from fastmcp import FastMCP

from lib.api.endpoint_methods import (
    authentication_tool,
    read_root_tool,
    training_metrics_tool,
    predict_tool,
    pdfread_tool,
    ai_model_params_tool,
    get_assets_tool,
    health_tool,
    dashboard_metrics_tool,
    dashboard_confusion_matrix_tool,
    dashboard_performance_tool,
    dashboard_distribution_tool,
    dashboard_analytics_tool,
    dashboard_classification_history_tool,
)

from lib.api.utilities import (
    get_standard_response,
    log_info,
    get_non_empty_value,
)
from lib.api.types import Article


class MCPServerApp:
    def __init__(self, app_name: str):
        self.mcp = FastMCP(app_name)
        self.authenticated = False

    def get_authenticated(self):
        return self.authenticated

    def authenticate(self, api_key: str) -> dict[str, Any]:
        login_result: dict = authentication_tool(api_key)
        if login_result["error"]:
            return login_result
        self.authenticated = True
        return login_result


DEBUG = os.environ.get("SERVER_DEBUG", "0") == "1"

MCP_HTTP_TRANSPORT = get_non_empty_value("MCP_HTTP_TRANSPORT", "1") == "1"
MCP_SERVER_HOST = get_non_empty_value("MCP_SERVER_HOST", "0.0.0.0")
try:
    MCP_SERVER_PORT = int(get_non_empty_value("MCP_SERVER_PORT", "8070"))
except ValueError:
    raise ValueError("MCP_SERVER_PORT must be an integer.")

DEFAULT_JSON_INDENT = 2


# Initialize FastMCP server
cac_object_list = []
app = MCPServerApp(app_name="abstractgo-mcp-server")
mcp = app.mcp


# ============================================================================
# UTILITIES
# ============================================================================


def tool_result(result: str, other_data: dict = None) -> Dict[str, Any]:
    """
    Helper function to format tool results
    """
    if not other_data:
        other_data = {}
    error = "error" in result.lower()
    return {
        **other_data,
        "success": not error,
        "error": result if error else None,
        "message": None if error else result
    }


def resource_result(result: str, mime_type: str = "text/plain") -> str:
    """
    Helper function to format resource results
    """
    if result["error"]:
        return json.dumps(result, indent=DEFAULT_JSON_INDENT)
    if mime_type == "application/json":
        return result["resultset"]
    return json.dumps(result["resultset"], indent=DEFAULT_JSON_INDENT)


def mcp_authenticate(
    api_key: str,
) -> str:
    """
    Authenticate user with API key
    """
    login_result: dict = app.authenticate(api_key)
    if login_result["error"]:
        return tool_result(login_result["error_message"])
    result = get_standard_response(
        message="User logged in successfully",
        resultset=login_result["resultset"],
    )
    return resource_result(result, mime_type="application/json")


# ============================================================================
# MCP TOOLS - USER AUTHENTICATION
# ============================================================================


@mcp.tool()
async def get_api_keys() -> Dict[str, Any]:
    """
    Get API keys
    """
    log_info("Getting API keys")
    result = {
        "resultset": {
            "AG_API_KEY": os.environ.get("AG_API_KEY")
        }
    }
    return result


@mcp.tool()
async def mcp_authentication_tool(
    api_key: str,
) -> str:
    """
    Authenticate user
    """
    log_info("Authenticating user")
    return mcp_authenticate(api_key)


# ============================================================================
# MCP TOOLS - ABSTRACTGO API INTEGRATION
# ============================================================================


@mcp.tool()
async def mcp_read_root() -> Dict[str, Any]:
    """
    Get root endpoint information
    """
    log_info("Getting root endpoint")
    result = read_root_tool()
    return result


@mcp.tool()
async def mcp_training_metrics() -> Dict[str, Any]:
    """
    Get the training metrics for the model
    """
    log_info("Getting training metrics")
    result = training_metrics_tool()
    return result


@mcp.tool()
async def mcp_predict(
    title: str,
    abstract: str
) -> Dict[str, Any]:
    """
    Predict categories for a biomedical article

    Args:
        title: The title of the article
        abstract: The abstract of the article
    """
    log_info("Making prediction")
    article = Article(title=title, abstract=abstract)
    result = predict_tool(article)
    return result


@mcp.tool()
async def mcp_pdfread(
    file_content: str,
    file_name: str
) -> Dict[str, Any]:
    """
    Read a file and extract the title and abstract

    Args:
        file_content: Base64 encoded file content
        file_name: Name of the file
    """
    log_info("Reading file content")
    import base64
    raw_bytes = base64.b64decode(file_content)
    result = pdfread_tool(raw_bytes, file_name)
    return result


@mcp.tool()
async def mcp_ai_model_params() -> Dict[str, Any]:
    """
    Get the parameters for the AI model
    """
    log_info("Getting AI model parameters")
    result = ai_model_params_tool()
    return result


@mcp.tool()
async def mcp_get_assets(filename: str) -> Dict[str, Any]:
    """
    Get temp file from local filesystem

    Args:
        filename: The filename to retrieve
    """
    log_info(f"Getting assets for filename: {filename}")
    result = get_assets_tool(filename)
    return result


@mcp.tool()
async def mcp_health() -> Dict[str, Any]:
    """
    Health check endpoint
    """
    log_info("Health check")
    result = health_tool()
    return result


@mcp.tool()
async def mcp_dashboard_metrics() -> Dict[str, Any]:
    """
    Get dashboard metrics
    """
    log_info("Getting dashboard metrics")
    result = dashboard_metrics_tool()
    return result


@mcp.tool()
async def mcp_dashboard_confusion_matrix() -> Dict[str, Any]:
    """
    Get dashboard confusion matrix
    """
    log_info("Getting dashboard confusion matrix")
    result = dashboard_confusion_matrix_tool()
    return result


@mcp.tool()
async def mcp_dashboard_performance() -> Dict[str, Any]:
    """
    Get dashboard performance metrics
    """
    log_info("Getting dashboard performance")
    result = dashboard_performance_tool()
    return result


@mcp.tool()
async def mcp_dashboard_distribution() -> Dict[str, Any]:
    """
    Get dashboard distribution analysis
    """
    log_info("Getting dashboard distribution")
    result = dashboard_distribution_tool()
    return result


@mcp.tool()
async def mcp_dashboard_analytics() -> Dict[str, Any]:
    """
    Get dashboard analytics
    """
    log_info("Getting dashboard analytics")
    result = dashboard_analytics_tool()
    return result


@mcp.tool()
async def mcp_dashboard_classification_history() -> Dict[str, Any]:
    """
    Get dashboard classification history
    """
    log_info("Getting dashboard classification history")
    result = dashboard_classification_history_tool()
    return result


# ============================================================================
# MCP RESOURCES - DATA ACCESS
# ============================================================================


@mcp.resource("user://login/{api_key}",
              mime_type="application/json")
async def authenticate(
    api_key: str,
) -> str:
    """
    Get user login as a resource
    """
    log_info("Getting user login for resource")
    return mcp_authenticate(api_key)


@mcp.resource("api://root",
              mime_type="application/json")
async def root_resource() -> str:
    """
    Get root endpoint as a resource
    """
    log_info("Getting root endpoint as resource")
    result = read_root_tool()
    return json.dumps(result, indent=DEFAULT_JSON_INDENT)


@mcp.resource("api://training-metrics",
              mime_type="application/json")
async def training_metrics_resource() -> str:
    """
    Get training metrics as a resource
    """
    log_info("Getting training metrics as resource")
    result = training_metrics_tool()
    return json.dumps(result, indent=DEFAULT_JSON_INDENT)


@mcp.resource("api://health",
              mime_type="application/json")
async def health_resource() -> str:
    """
    Get health status as a resource
    """
    log_info("Getting health status as resource")
    result = health_tool()
    return json.dumps(result, indent=DEFAULT_JSON_INDENT)


@mcp.resource("api://ai-model-params",
              mime_type="application/json")
async def ai_model_params_resource() -> str:
    """
    Get AI model parameters as a resource
    """
    log_info("Getting AI model parameters as resource")
    result = ai_model_params_tool()
    return json.dumps(result, indent=DEFAULT_JSON_INDENT)


@mcp.resource("dashboard://metrics",
              mime_type="application/json")
async def dashboard_metrics_resource() -> str:
    """
    Get dashboard metrics as a resource
    """
    log_info("Getting dashboard metrics as resource")
    result = dashboard_metrics_tool()
    return json.dumps(result, indent=DEFAULT_JSON_INDENT)


@mcp.resource("dashboard://confusion-matrix",
              mime_type="application/json")
async def dashboard_confusion_matrix_resource() -> str:
    """
    Get dashboard confusion matrix as a resource
    """
    log_info("Getting dashboard confusion matrix as resource")
    result = dashboard_confusion_matrix_tool()
    return json.dumps(result, indent=DEFAULT_JSON_INDENT)


@mcp.resource("dashboard://performance",
              mime_type="application/json")
async def dashboard_performance_resource() -> str:
    """
    Get dashboard performance as a resource
    """
    log_info("Getting dashboard performance as resource")
    result = dashboard_performance_tool()
    return json.dumps(result, indent=DEFAULT_JSON_INDENT)


@mcp.resource("dashboard://distribution",
              mime_type="application/json")
async def dashboard_distribution_resource() -> str:
    """
    Get dashboard distribution as a resource
    """
    log_info("Getting dashboard distribution as resource")
    result = dashboard_distribution_tool()
    return json.dumps(result, indent=DEFAULT_JSON_INDENT)


@mcp.resource("dashboard://analytics",
              mime_type="application/json")
async def dashboard_analytics_resource() -> str:
    """
    Get dashboard analytics as a resource
    """
    log_info("Getting dashboard analytics as resource")
    result = dashboard_analytics_tool()
    return json.dumps(result, indent=DEFAULT_JSON_INDENT)


@mcp.resource("dashboard://classification-history",
              mime_type="application/json")
async def dashboard_classification_history_resource() -> str:
    """
    Get dashboard classification history as a resource
    """
    log_info("Getting dashboard classification history as resource")
    result = dashboard_classification_history_tool()
    return json.dumps(result, indent=DEFAULT_JSON_INDENT)


# ============================================================================
# SERVER STARTUP AND CONFIGURATION
# ============================================================================


def main():
    """
    Main entry point for the AbstractGo MCP Server
    """

    print("🥗 Starting AbstractGo MCP Server...")
    print("\n📋 Available Tools:")
    print("      - mcp_authentication_tool: Authenticate user")
    print("      - get_api_keys: Get API keys")
    print("      - mcp_read_root: Get root endpoint")
    print("      - mcp_training_metrics: Get training metrics")
    print("      - mcp_predict: Predict article categories")
    print("      - mcp_pdfread: Read file content")
    print("      - mcp_ai_model_params: Get AI model parameters")
    print("      - mcp_get_assets: Get assets")
    print("      - mcp_health: Health check")
    print("      - mcp_dashboard_metrics: Get dashboard metrics")
    print("      - mcp_dashboard_confusion_matrix: Get confusion matrix")
    print("      - mcp_dashboard_performance: Get performance metrics")
    print("      - mcp_dashboard_distribution: Get distribution analysis")
    print("      - mcp_dashboard_analytics: Get analytics")
    print("      - mcp_dashboard_classification_history: "
          "Get classification history")

    print("\n📂 Available Resources:")
    print("      - user://login/{api_key}: User login data")
    print("      - api://root: Root endpoint data")
    print("      - api://training-metrics: Training metrics data")
    print("      - api://health: Health status data")
    print("      - api://ai-model-params: AI model parameters")
    print("      - dashboard://metrics: Dashboard metrics")
    print("      - dashboard://confusion-matrix: Confusion matrix")
    print("      - dashboard://performance: Performance metrics")
    print("      - dashboard://distribution: Distribution analysis")
    print("      - dashboard://analytics: Analytics data")
    print("      - dashboard://classification-history: Classification history")

    print("\n🔧 Transport: STDIO (Standard Input/Output)")
    print("💡 Connect via Claude Desktop, VS Code, or other MCP clients")

    print("\n✅ Server ready for connections!")

    # Run the FastMCP server
    if MCP_HTTP_TRANSPORT:
        mcp.run(transport="http", host=MCP_SERVER_HOST, port=MCP_SERVER_PORT)
    else:
        mcp.run()


# if __name__ == "__main__":
main()
