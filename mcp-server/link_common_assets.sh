#!/bin/sh
# scripts/link_common_assets.sh
# Link ExampleApp common files, directories and libraries
# 2025-07-04 | CR

copy_common_assets() {
    common_asset_source_name="$1"
    common_asset_target_name="$2"
    echo ""
    echo "Copying '$common_asset_source_name' to '$common_asset_target_name'"
    if ! cp -r "${BASE_DIR}/$common_asset_source_name" "${BASE_DIR}/$common_asset_target_name"
    then
        echo "ERROR: Could not copy '$common_asset_source_name' to '$common_asset_target_name'"
    fi
}

link_common_assets() {
    common_asset_source_name="$1"
    common_asset_target_name="$2"
    echo ""
    echo "Linking '$common_asset_source_name' to '$common_asset_target_name'"
    if ! ln -s "${BASE_DIR}/$common_asset_source_name/" "${BASE_DIR}/$common_asset_target_name/"
    then
        echo "ERROR: Could not link '$common_asset_source_name' to '$common_asset_target_name'"
    fi
}

unlink_common_assets() {
    common_asset_source_name="$1"
    common_asset_target_name="$2"

    echo ""
    echo "Unlinking '$common_asset_source_name' from '$common_asset_target_name'"

    if ! unlink "${BASE_DIR}/$common_asset_target_name/$common_asset_source_name"
    then
        echo "ERROR: Could not unlink '${BASE_DIR}/$common_asset_target_name/$common_asset_source_name'"
    fi
}

remove_common_assets() {
    common_asset_source_name="$1"
    echo ""
    echo "Removing '$common_asset_source_name'"
    if ! rm -rf "${BASE_DIR}/$common_asset_source_name"
    then
        echo "ERROR: Could not remove '${BASE_DIR}/$common_asset_source_name'"
    fi
}

BASE_DIR="`pwd`"
cd "`dirname "$0"`" ;
SCRIPTS_DIR="`pwd`" ;
cd "${BASE_DIR}"

ACTION="$1"

COPY_OR_SYMLINK="$2"
if [ "$COPY_OR_SYMLINK" = "" ]; then
    COPY_OR_SYMLINK="copy"
    # COPY_OR_SYMLINK="symlink"
fi

echo ""
echo "link_common_assets.sh"
echo "BASE_DIR: $BASE_DIR"
echo "SCRIPTS_DIR: $SCRIPTS_DIR"
echo "ACTION: $ACTION"
echo "COPY_OR_SYMLINK: $COPY_OR_SYMLINK"
echo ""

if [ "$ACTION" = "link" ]; then
    echo ""
    echo "link_common_assets.sh | Linking common assets..."
    copy_common_assets "../server" "./lib"
elif [ "$ACTION" = "unlink" ]; then
    echo ""
    echo "link_common_assets.sh | Unlinking common assets..."
    remove_common_assets "./lib"
else
    echo ""
    echo "ERROR: Unknown action: '$ACTION'"
    echo ""
    exit 1
fi

