#!/bin/bash

pnpm install --frozen-lockfile
exec "/bin/bash" -c "cd $1 && eas build --local --platform $2 --profile $3 --output $4"
