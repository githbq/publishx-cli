
// backendHost: www.abc.com || 127.0.0.1
// appName project-abc 最好与工程名相同
export const getTemplateStr = ({ port, serverRootPath, backendHost, appName }) => `
##appName-${appName}##
server {
    listen ${port};
    server_name $host;
    set $appName "${appName}"; 
    root ${serverRootPath || '/export/local/www/'}$appName;
    #access_log /export/logs/$appName/access.log main;
    #error_log /export/logs/$appName/error.log warn;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $remote_addr;


    location / {
        try_files $uri $uri/ /index.html;
    }

    location ^~ /api/ {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_pass http://${backendHost}/;
    }

    location ~ ^(.*)\.(js|css|png|jpg|jpeg|ttf|eot|svg|woff|ico) {
        rewrite ^(.*) /$1 break;
    }
}
##appName-${appName}-end##
`
