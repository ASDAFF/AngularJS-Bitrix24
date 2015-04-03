### Приложение для корпоративного портала на базе Bitrix 24

### Установка:
```shell
sudo npm install

bower install

grunt default
```
### Настройка Nginx
```shell
    location / {
              try_files $uri $uri/ /index.html =404;
              root /home/dmitriy/web;
              index index.html index.htm;
              autoindex on;
              expires           -1;
    }
    
    location ~* ^/api/v1/whois/(.*) {
                      add_header 'Access-Control-Allow-Origin' '*';
                      add_header 'Access-Control-Allow-Credentials' 'true';
                      proxy_pass 'http://api.whois.vu/?q=$1';
                }

```