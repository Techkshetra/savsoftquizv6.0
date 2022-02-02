#!/bin/bash
set -e
REQUIRED_VARS="DB_HOST DB_USERNAME DB_PASSWORD DB_NAME DOMAINNAME"
CONFIG_DIR=/var/www/html
function validate(){
    for var in $REQUIRED_VARS; do
        if [[ $(env | awk -F "=" '{print $1}' | grep "^$var$") != "$var" ]]; then
            echo "Variable $var not set but required."
            exit 1
        else
             eval 'val=$'"$var"
             if [ -z "$val" ]; then
               echo "Variable $var set but empty"
               exit 1
             fi
        fi
         #[ -z "\$$var" ] && echo "Empty: Yes" || echo "Empty: No"
    done
}

validate

## Replace variables in config file
envsubst < $CONFIG_DIR/.env.template > $CONFIG_DIR/.env || { echo 'Error Replacing Variables in .env config file $CONFIG_DIR' ; exit 1; }
envsubst < $CONFIG_DIR/custom.js.template > $CONFIG_DIR/application/dist/js/custom.js || { echo 'Error Replacing Variables in custom.js config file $CONFIG_DIR' ; exit 1; }

if [ "${1#-}" != "$1" ]; then
    set -- apache2-foreground "$@"
fi

exec "$@"
