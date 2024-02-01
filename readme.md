** env_guied **

PORT=

JWT_KEY=

------

** api_service **

methof                path              params      body

POST                /auth/register      none        {username, password confirmPassword , email}
POST                /auth/login         none        {username, password}
PUT                 /todo/              :id         {title, duedate}