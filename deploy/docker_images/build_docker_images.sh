#!/bin/bash
# build_docker_images.sh
# 2025-08-28 | CR

BASE_DIR=$(pwd)
SCRIPT_DIR=$(dirname "$0")

USE_BUILDX="${USE_BUILDX:-0}"
IMAGE_VERSION="${IMAGE_VERSION:-latest}"

BUILD_PYTHON_ONLY="${BUILD_PYTHON_ONLY:-1}"
BUILD_PYTHON_NODE="${BUILD_PYTHON_NODE:-0}"

cd $SCRIPT_DIR

run_build_cmd() {
    if [ "$USE_BUILDX" = "1" ]; then
        BUILD_CMD="docker buildx build --platform linux/amd64 --provenance=false -t $IMAGE_NAME:$IMAGE_VERSION -f $DOCKER_FILE ."
    else
        BUILD_CMD="docker build -t $IMAGE_NAME -f $DOCKER_FILE ."
    fi
    echo ""
    echo "Building $IMAGE_NAME:"
    echo "Using build command: $BUILD_CMD"
    echo ""
    if ! $BUILD_CMD
    then
        echo "Error building the '$IMAGE_NAME' image"
        echo "Failed command: $BUILD_CMD"
        exit 1
    fi
    echo "Built image: $IMAGE_NAME"
}

if [ "$BUILD_PYTHON_NODE" = "1" ]; then
    IMAGE_NAME="abstractgo_python_node"
    DOCKER_FILE="Dockerfile_python_node"
    run_build_cmd
fi

if [ "$BUILD_PYTHON_ONLY" = "1" ]; then
    IMAGE_NAME="abstractgo_python_only"
    DOCKER_FILE="Dockerfile_python_only"
    run_build_cmd
fi

echo ""
echo "Build completed"
echo ""
echo "To run the images, use the following commands:"
if [ "$BUILD_PYTHON_NODE" = "1" ]; then
    echo "docker run -d --name abstractgo_python_node abstractgo_python_node:$IMAGE_VERSION"
fi
if [ "$BUILD_PYTHON_ONLY" = "1" ]; then
    echo "docker run -d --name abstractgo_python_only abstractgo_python_only:$IMAGE_VERSION"
fi

echo ""
echo "Done!"

cd $BASE_DIR