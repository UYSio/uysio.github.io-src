#!/bin/bash

set -e

DATE=$(date +"%Y-%m-%d")
TIME=$(date +"%T")

read -p "Enter the title:" TITLE
TITLE=${TITLE:-The good, the bad, and the ugly.}

KEBAB=$(echo $TITLE | tr -cd '[:alnum:][:space:]' | tr [:upper:] [:lower:] | tr [:space:] '-')

NEW=_posts/${DATE}-${KEBAB%?}.md
cp _drafts/template.md $NEW

read -p "A comma-delimited list of tags:" TAGS
TAGS=${TAGS:-foo,bar}

read -p "Category (default: blog):" CATEGORY
CATEGORY=${CATEGORY:-blog}

sed -i -e "s/%TITLE%/$TITLE/" $NEW
sed -i -e "s/%DATE%/${DATE} ${TIME}/" $NEW
sed -i -e "s/%TAGS%/$TAGS/" $NEW
sed -i -e "s/%CATEGORY%/$CATEGORY/" $NEW


echo "New post ready for edits at $NEW"
