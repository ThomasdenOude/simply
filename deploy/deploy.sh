#!/bin/bash
#
# Upgrade to new version and deploy to firebase
#

# Check if branch is clean
branch=$(git branch --show-current)
status=$(git status --porcelain)

if [ -n "$status" ]; then
    echo
    echo "Branch $branch has changes."
    echo "Please commit before making a deploy:"
    echo

    git status
    exit 1
fi

# Ask for version upgrade
read -p "Do you want to upgrade version to next major, minor or (patch)?  " version
if [[ -z "$version" || "$version" = "patch" ]]; then
    upgrade="patch"
elif [ "$version" = "minor" ]; then
    upgrade="minor"
elif [ "$version" = major ]; then
    upgrade="major"
else 
    echo
    echo "You must provide how to upgrade the version. Options are:"
    echo "  major"
    echo "  minor"
    echo "  patch"
    echo
    exit 1
fi

# Add new version to package.json
mktemp ./deploy/buffer
echo "Upgrading to $upgrade in package.json"
node ./deploy/version-upgrade.js "$upgrade" > buffer

# Make commit with the new version, annotate commit with deploy tag
new_version=$(head -1 buffer)
git add .
git commit -m "Upgraded to new version: ${new_version}"
git tag -a "deploy=${new_version}" -m "Deploy new version ${new-version}"
rm buffer

# Deploy app to firebase
ng deploy



