FROM php:7.3-apache
RUN apt-get -y update \
&& apt-get install -y libicu-dev bash gettext-base\ 
&& docker-php-ext-configure intl \
&& docker-php-ext-install intl \
&& docker-php-ext-install mysqli \
&& docker-php-ext-enable mysqli

COPY . /var/www/html
COPY docker-config/.env.template /var/www/html
COPY docker-config/entrypoint.sh /tmp
COPY docker-config/custom.js.template /var/www/html

RUN chown -R www-data:www-data /var/www/html/api

ENTRYPOINT ["/tmp/entrypoint.sh"]

CMD ["apache2-foreground"]

