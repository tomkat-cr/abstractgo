#! /bin/bash
# branch_update_from_main.sh
# 2025-08-23 | CR
# Update a branch from main
#
# Usage: ./branch_update_from_main.sh <branch_name>
# Usage: BRANCH=<branch_name> ./branch_update_from_main.sh
#
# If no branch name is provided, the script will use the BRANCH environment variable
# If the BRANCH environment variable is not set, the script will exit with an error
# If the branch name is provided, the script will update the branch from main
# If the branch name is not provided, the script will exit with an error

if [ -z "$1" ]; then
    if [ -z "$BRANCH" ]; then
        echo "Usage: $0 <branch_name> or make BRANCH=<branch_name> branch-update"
        exit 1
    fi
else
    BRANCH=$1
fi

# Stop on error
set -e

# Update the given branch from main
echo ""
echo "git fetch -a"
git fetch -a
echo ""
echo "git checkout main"
git checkout main
echo ""
echo "git pull"
git pull
echo ""
echo "git checkout $BRANCH"
git checkout $BRANCH
echo ""
echo "git merge main"
git merge main
# echo ""
# echo "git push"
# git push
echo ""
echo "git status"
git status
echo ""
echo "Done"

